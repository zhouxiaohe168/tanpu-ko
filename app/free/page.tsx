import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FreeDensityQuery } from "@/components/free-density-query"

export const metadata: Metadata = {
  title: "免费品牌密度查询 - 探铺",
  description: "免费查询指定位置周边的连锁品牌门店密度，了解区域商业活跃度",
}

export default function FreePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <FreeDensityQuery />
      </main>
      <Footer />
    </div>
  )
}
