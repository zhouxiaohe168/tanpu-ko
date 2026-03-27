# 探铺系统复盘报告

> 更新时间：2026-03-27
> 项目域名：https://tanpuai.com

---

## 一、项目概述

**探铺** 是一个连锁品牌智能选址数据平台，帮助加盟商通过数据找到品牌空白点位。

**核心价值主张**：连锁品牌智能选址，一键发现黄金空白点

---

## 二、当前系统架构

### 技术栈
| 层级 | 技术 | 状态 |
|------|------|------|
| 前端框架 | Next.js 16 + TypeScript | ✅ 完成 |
| UI组件库 | TailwindCSS + shadcn/ui | ✅ 完成 |
| 地图服务 | 高德地图 JS API 2.0 | ✅ 完成 |
| 数据库 | Supabase (PostgreSQL) | ✅ 已连接 |
| 认证 | Supabase Auth | ⚠️ 部分完成 |
| 支付 | Stripe | ✅ 已集成 |
| 短信 | Twilio Verify | ❌ 待调试 |
| 部署 | Vercel | ✅ 已部署 |

### 数据库表结构（已创建）
```
public.profiles    - 用户资料（会员类型、查询次数）
public.brands      - 品牌数据（蜜雪冰城、古茗等）
public.queries     - 查询记录
public.locations   - 空白点数据
public.orders      - 订单记录
public.sms_codes   - 短信验证码
```

### 环境变量（已配置）
```
# Supabase
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
POSTGRES_URL, POSTGRES_USER, POSTGRES_PASSWORD

# Stripe
STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY

# 高德地图
NEXT_PUBLIC_AMAP_KEY=03aa0dc32408d2b234f5e2bd4af013ff

# Twilio
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
TWILIO_VERIFY_SERVICE_SID
```

---

## 三、已完成功能

### 页面（10个）
| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | Hero、功能介绍、定价、Footer |
| 查询页 | `/query` | 品牌选择、竞品多选、城市、半径 |
| 结果页 | `/results` | 空白点列表、地图标记、详情面板 |
| 免费查询 | `/free` | 品牌密度查询（引流用） |
| 登录 | `/auth/login` | 账号密码 + 短信验证 |
| 注册 | `/auth/sign-up` | 邮箱 + 短信两种方式 |
| 注册成功 | `/auth/sign-up-success` | 提示验证邮箱 |
| 认证错误 | `/auth/error` | 错误提示页 |
| 支付 | `/checkout/[productId]` | Stripe嵌入式支付 |
| 服务条款 | `/terms` | 法律条款 |
| 隐私政策 | `/privacy` | 隐私保护 |
| 退款政策 | `/refund` | 退款说明 |

### 组件（15个业务组件）
- `header.tsx` - 顶部导航（含用户状态）
- `hero.tsx` - 首页Hero区
- `features.tsx` - 功能介绍卡片
- `pricing.tsx` - 定价卡片
- `footer.tsx` - 页脚
- `query-form.tsx` - 查询表单
- `map-container.tsx` - 高德地图容器
- `location-card.tsx` - 空白点卡片
- `details-panel.tsx` - 详情面板
- `user-nav.tsx` - 用户导航
- `checkout.tsx` - 支付组件
- `free-density-query.tsx` - 免费密度查询

### API路由（6个）
- `GET /api/brands` - 获取品牌列表
- `POST /api/query` - 执行选址查询
- `POST /api/sms/send` - 发送验证码
- `POST /api/sms/verify` - 验证验证码
- `POST /api/webhooks/stripe` - Stripe支付回调

---

## 四、未完成/待修复

### 阻塞问题（P0）
| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `@supabase/ssr` 模块找不到 | 依赖版本不兼容 | 需要锁定正确版本或换用其他方案 |
| 短信验证失败 | 依赖P0问题 | P0解决后重新测试 |

### 待开发功能（P1）
- 邮箱验证码登录（目前只有密码登录）
- 会员权限控制（查询次数限制）
- 真实数据对接（替换Mock数据）
- AI研判功能

### 优化项（P2）
- 移动端响应式优化
- 加载状态和错误处理
- SEO优化

---

## 五、商业模式

### 收入结构
```
C端查询收入（40%）
├── 单次 ¥9.9
├── 月卡 ¥199
└── 年卡 ¥1499

B端服务（30%）
├── 品牌总部 ¥5-50万/年
└── 商业地产 ¥3-10万/年

内容付费（15%）
├── 城市报告 ¥499
└── 品牌白皮书 ¥999

分销合作（15%）
└── 推广佣金30%
```

### 目标用户
1. 想开加盟店的创业者
2. 连锁品牌总部拓展团队
3. 商业地产招商人员
4. 加盟中介/咨询公司

---

## 六、下一步工作计划

### 立即处理（本周）
1. **修复依赖问题** - 解决 `@supabase/ssr` 模块问题
2. **测试短信功能** - 确保Twilio Verify正常工作
3. **端到端测试** - 完整用户流程验证

### 短期目标（2周内）
1. **用户系统完善** - 会员权限、查询次数限制
2. **支付流程测试** - Stripe支付完整流程
3. **真实数据对接** - 品牌门店POI数据接入

### 中期目标（1个月）
1. **AI研判功能** - 接入大模型生成分析报告
2. **数据采集系统** - 自动化POI数据更新
3. **运营后台** - 数据统计、用户管理

---

## 七、给Claude的工作指令

### 当前优先级
```
P0: 修复 @supabase/ssr 依赖问题
P1: 调试短信验证功能
P2: 完善用户认证流程
P3: 对接真实POI数据
```

### 技术债务
1. 短信服务需要备用方案（阿里云短信）
2. 地图标记点需要真实坐标数据
3. 查询结果需要对接真实算法

### 建议下一步
1. 先解决依赖问题，确保基础功能可用
2. 然后完善用户系统（登录、会员、支付）
3. 最后对接真实数据和AI功能

---

## 八、项目文件结构

```
/vercel/share/v0-project/
├── app/                      # Next.js App Router
│   ├── page.tsx              # 首页
│   ├── query/page.tsx        # 查询页
│   ├── results/page.tsx      # 结果页
│   ├── free/page.tsx         # 免费查询
│   ├── auth/                 # 认证相关
│   ├── checkout/             # 支付页面
│   ├── api/                  # API路由
│   └── ...
├── components/               # React组件
├── lib/                      # 工具库
│   ├── supabase/            # Supabase客户端
│   ├── stripe.ts            # Stripe配置
│   └── twilio-sms.ts        # 短信服务
├── hooks/                    # React Hooks
├── docs/                     # 项目文档
└── scripts/                  # 数据库脚本
```

---

**文档结束**

下次会话时，请 Claude 阅读此文档了解项目全貌，然后根据优先级继续开发。
