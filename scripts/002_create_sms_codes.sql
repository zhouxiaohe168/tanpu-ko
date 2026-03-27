-- 创建短信验证码存储表
CREATE TABLE IF NOT EXISTS sms_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sms_codes_phone ON sms_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sms_codes_expires_at ON sms_codes(expires_at);

-- 允许匿名用户插入和查询验证码（用于登录前验证）
ALTER TABLE sms_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON sms_codes
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON sms_codes
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous delete" ON sms_codes
  FOR DELETE TO anon USING (true);

-- 服务端也需要权限
CREATE POLICY "Allow service role all" ON sms_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);
