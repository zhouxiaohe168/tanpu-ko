-- 创建门店数据表
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  store_name text,
  province text NOT NULL,
  city text NOT NULL,
  district text,
  address text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  category text NOT NULL DEFAULT '奶茶饮品',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stores_select_all" ON public.stores
  FOR SELECT USING (true);

-- 创建空间索引加速地理查询
CREATE INDEX IF NOT EXISTS stores_brand_name_idx ON public.stores(brand_name);
CREATE INDEX IF NOT EXISTS stores_city_idx ON public.stores(city);
CREATE INDEX IF NOT EXISTS stores_lat_lng_idx ON public.stores(lat, lng);
