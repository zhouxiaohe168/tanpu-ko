-- 探铺数据库表结构

-- 1. 用户扩展表（与 auth.users 关联）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  nickname TEXT,
  avatar_url TEXT,
  membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'single', 'monthly', 'yearly')),
  membership_expires_at TIMESTAMPTZ,
  query_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. 品牌表（系统数据，所有用户可读）
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_select_all" ON public.brands FOR SELECT TO authenticated USING (true);

-- 3. 查询记录表
CREATE TABLE IF NOT EXISTS public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id),
  brand_name TEXT NOT NULL,
  competitors TEXT[], -- 竞品名称数组
  city TEXT NOT NULL,
  radius INTEGER NOT NULL, -- 搜索半径（米）
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "queries_select_own" ON public.queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "queries_insert_own" ON public.queries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. 空白点结果表
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  grade TEXT CHECK (grade IN ('S', 'A', 'B', 'C', 'D')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  competitors JSONB, -- 周边竞品 [{name, distance}]
  facilities JSONB, -- 配套设施
  projects JSONB, -- 在建项目
  score_details JSONB, -- 评分明细
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locations_select_own" ON public.locations 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.queries WHERE queries.id = locations.query_id AND queries.user_id = auth.uid())
  );

-- 5. 订单/支付记录表
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL CHECK (product_type IN ('single', 'monthly', 'yearly')),
  amount INTEGER NOT NULL, -- 金额（分）
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_id TEXT, -- 第三方支付ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. 自动创建用户 profile 的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. 插入初始品牌数据
INSERT INTO public.brands (name, category) VALUES
  ('蜜雪冰城', '茶饮'),
  ('古茗', '茶饮'),
  ('霸王茶姬', '茶饮'),
  ('茶百道', '茶饮'),
  ('瑞幸咖啡', '咖啡'),
  ('星巴克', '咖啡'),
  ('华莱士', '快餐'),
  ('正新鸡排', '小吃'),
  ('绝味鸭脖', '卤味'),
  ('周黑鸭', '卤味')
ON CONFLICT (name) DO NOTHING;
