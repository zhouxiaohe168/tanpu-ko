-- 添加免费查询已使用字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_query_used BOOLEAN DEFAULT FALSE;

-- 添加注释
COMMENT ON COLUMN profiles.free_query_used IS '免费查询是否已使用（每个用户永久只有1次免费机会）';
