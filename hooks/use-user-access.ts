"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  membership_type: "free" | "basic" | "pro" | "enterprise"
  membership_expires_at: string | null
  query_count: number
}

export interface UserAccess {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isLoggedIn: boolean
  isPremium: boolean
  canQuery: boolean
  remainingQueries: number
  maxQueries: number
  refreshProfile: () => Promise<void>
}

const FREE_DAILY_LIMIT = 3
const BASIC_DAILY_LIMIT = 10
const PRO_DAILY_LIMIT = 50
const ENTERPRISE_LIMIT = Infinity

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

  useEffect(() => {
    const supabase = createClient()

    // 获取当前用户
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        await fetchProfile(user.id)
      }
      setIsLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 计算会员状态
  const isLoggedIn = !!user
  
  const membershipType = profile?.membership_type || "free"
  const membershipExpiresAt = profile?.membership_expires_at
  
  // 检查会员是否过期
  const isMembershipActive = membershipExpiresAt 
    ? new Date(membershipExpiresAt) > new Date() 
    : false
  
  const isPremium = isLoggedIn && membershipType !== "free" && isMembershipActive

  // 获取每日查询限制
  const getMaxQueries = () => {
    if (!isLoggedIn) return FREE_DAILY_LIMIT
    if (!isMembershipActive || membershipType === "free") return FREE_DAILY_LIMIT
    
    switch (membershipType) {
      case "basic": return BASIC_DAILY_LIMIT
      case "pro": return PRO_DAILY_LIMIT
      case "enterprise": return ENTERPRISE_LIMIT
      default: return FREE_DAILY_LIMIT
    }
  }

  const maxQueries = getMaxQueries()
  const queryCount = profile?.query_count || 0
  const remainingQueries = Math.max(0, maxQueries - queryCount)
  const canQuery = remainingQueries > 0 || maxQueries === Infinity

  return {
    user,
    profile,
    isLoading,
    isLoggedIn,
    isPremium,
    canQuery,
    remainingQueries,
    maxQueries,
    refreshProfile,
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
    unlimited_query: ["enterprise"],
    priority_support: ["pro", "enterprise"],
  }

  const allowedMemberships = featureRequirements[feature] || []
  return allowedMemberships.includes(membershipType)
}
