# 探铺 (TanpuAI) - 项目规划与开发日志

## 产品愿景

**探铺** 是一款面向连锁品牌的智能选址工具，帮助用户一键发现黄金空白点，降低选址决策成本。

**官网**: https://tanpuai.com

---

## 当前状态 (2026-03-27)

### 已完成功能

| 模块 | 状态 | 说明 |
|------|------|------|
| 首页 | ✅ 完成 | Hero、功能介绍、定价、Footer |
| 查询页 | ✅ 完成 | 品牌选择、竞品多选、城市选择、半径滑块 |
| 结果页 | ✅ 完成 | 空白点列表、评级卡片、详情面板、地图标记 |
| 高德地图 | ✅ 完成 | 标记点、信息窗口、飞行定位 |
| 用户认证 | ✅ 完成 | 邮箱密码登录/注册 |
| 数据库 | ✅ 完成 | Supabase 表结构、RLS 策略 |
| 支付系统 | ✅ 完成 | Stripe 三档定价 |
| 域名 | ✅ 完成 | tanpuai.com 已绑定 |
| 法律页面 | ✅ 完成 | 服务条款、隐私政策、退款政策 |
| 免费引流页 | ✅ 完成 | 品牌密度查询 |

### 待解决问题

| 问题 | 优先级 | 状态 | 备注 |
|------|--------|------|------|
| @supabase/ssr 模块错误 | P0 | 待修复 | 依赖版本兼容性问题 |
| 短信验证码 (Twilio) | P1 | 待调试 | Twilio Verify 已配置，需排查 API 调用 |

---

## 开发路线图

### Phase 1: MVP 稳定化 (本周)

**目标**: 确保核心功能稳定可用

- [ ] 修复 @supabase/ssr 依赖问题
- [ ] 调试短信验证码功能
- [ ] 测试完整用户注册-登录-查询流程
- [ ] 测试支付流程

### Phase 2: 后端数据对接 (下周)

**目标**: 真实数据替换 Mock 数据

- [ ] 对接高德 POI 搜索 API（获取真实品牌门店数据）
- [ ] 实现空白点算法（基于竞品分布计算）
- [ ] 实现评分算法（人流、竞品密度、配套设施）
- [ ] 对接在建项目数据源

### Phase 3: AI 研判功能 (第3周)

**目标**: 实现 AI 智能分析

- [ ] 接入 AI 模型（GPT-4 或 Claude）
- [ ] 实现 AI 选址研判报告生成
- [ ] 实现投资回报预测
- [ ] 实现反向推荐（输入预算，推荐位置）

### Phase 4: 增值功能 (第4周)

**目标**: 提升付费转化

- [ ] 位置 PK 比较功能
- [ ] 数据导出（Excel 报告）
- [ ] 分享海报生成
- [ ] 推广佣金系统

### Phase 5: 运营与增长 (持续)

**目标**: 用户获取与留存

- [ ] SEO 优化
- [ ] 微信公众号/小程序
- [ ] 内容营销（选址案例、行业报告）
- [ ] KOL 合作

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 15 + React 19 |
| UI 组件 | shadcn/ui + Tailwind CSS |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Supabase Auth |
| 支付 | Stripe |
| 地图 | 高德地图 JS API |
| 短信 | Twilio Verify |
| 部署 | Vercel |
| 开发工具 | v0 |

---

## 环境变量清单

| 变量名 | 用途 | 状态 |
|--------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 项目 URL | ✅ 已配置 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 匿名 Key | ✅ 已配置 |
| NEXT_PUBLIC_AMAP_KEY | 高德地图 API Key | ✅ 已配置 |
| STRIPE_SECRET_KEY | Stripe 密钥 | ✅ 已配置 |
| STRIPE_PUBLISHABLE_KEY | Stripe 公钥 | ✅ 已配置 |
| TWILIO_ACCOUNT_SID | Twilio 账户 SID | ✅ 已配置 |
| TWILIO_AUTH_TOKEN | Twilio 认证令牌 | ✅ 已配置 |
| TWILIO_PHONE_NUMBER | Twilio 电话号码 | ✅ 已配置 |
| TWILIO_VERIFY_SERVICE_SID | Twilio Verify 服务 SID | ✅ 已配置 |

---

## 开发日志

### 2026-03-27

**完成工作：**
1. 创建完整的三页网站（首页、查询页、结果页）
2. 集成高德地图，支持空白点和竞品标记
3. 集成 Supabase 数据库和认证
4. 集成 Stripe 支付（三档定价）
5. 创建法律页面（服务条款、隐私政策、退款政策）
6. 配置域名 tanpuai.com
7. 配置 Twilio 短信服务

**遇到问题：**
1. @supabase/ssr 模块加载失败 - 尝试多个版本组合未解决
2. Twilio 短信发送失败 - "Unsupported phone provider" 错误

**下一步计划：**
1. 深入排查依赖问题，可能需要检查 pnpm lockfile
2. 测试 Twilio Verify API 是否正确配置
3. 考虑备选短信方案（阿里云短信）

---

## 联系方式

- **GitHub**: https://github.com/zhouxiaohe168/tanpu-ko
- **Vercel 项目**: v0-project-jd

---

*本文档由 v0 AI 助手维护，作为项目开发的核心参考文档。*
