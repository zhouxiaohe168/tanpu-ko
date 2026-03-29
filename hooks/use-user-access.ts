"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  membership_type: "free" | "basic" | "pro" | "enterprise"
  membership_expires_at: string | null
  query_count: number
  free_query_used: boolean
}

export interface UserAccess {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isLoggedIn: boolean
  isPremium: boolean
  canQuery: boolean
  freeQueryUsed: boolean
  membershipType: "free" | "basic" | "pro" | "enterprise"
  refreshProfile: () => Promise<void>
  consumeFreeQuery: () => Promise<boolean>
}

export function useUserAccess(): UserAccess {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    
    if (!error && data) {
      setProfile(data as UserProfile)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  // 消耗免费查询次数
  const consumeFreeQuery = async (): Promise<boolean> => {
    if (!user || !profile) return false
    
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ 
        free_query_used: true,
        query_count: (profile.query_count || 0) + 1
      })
      .eq("id", user.id)
    
    if (!error) {
      await refreshProfile()
      return true
    }
    return false
  }

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null
      setUser(user)
      if (user) await fetchProfile(user.id)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setUser(user)
      if (user) await fetchProfile(user.id)
      else { setProfile(null); setIsLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 计算状态
  const isLoggedIn = !!user
  const membershipType = profile?.membership_type || "free"
  const membershipExpiresAt = profile?.membership_expires_at
  const freeQueryUsed = profile?.free_query_used || false
  
  // 检查会员是否过期
  const isMembershipActive = membershipExpiresAt 
    ? new Date(membershipExpiresAt) > new Date() 
    : false
  
  const isPremium = isLoggedIn && membershipType !== "free" && isMembershipActive

  // 查询权限判断：
  // 1. 未登录：不能查询
  // 2. 免费用户：只能查询1次（free_query_used = false 时可查）
  // 3. 付费用户：根据会员类型无限制
  const canQuery = (() => {
    if (!isLoggedIn) return false
    if (isPremium) return true
    // 免费用户只有1次机会
    return !freeQueryUsed
  })()

  return {
    user,
    profile,
    isLoading,
    isLoggedIn,
    isPremium,
    canQuery,
    freeQueryUsed,
    membershipType,
    refreshProfile,
    consumeFreeQuery,
  }
}

// 检查特定功能是否需要付费
export function checkFeatureAccess(
  membershipType: string,
  feature: "ai_analysis" | "export" | "unlimited_query" | "priority_support"
): boolean {
  const featureRequirements: Record<string, string[]> = {
    ai_analysis: ["basic", "pro", "enterprise"],
    export: ["pro", "enterprise"],
    unlimited_query: ["basic", "pro", "enterprise"],
    priority_support: ["pro", "enterprise"],
  }

  const allowedMemberships = featureRequirements[feature] || []
  return allowedMemberships.includes(membershipType)
}
