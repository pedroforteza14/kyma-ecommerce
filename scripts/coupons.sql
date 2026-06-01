-- ════════════════════════════════════════════════════════════════════════════
-- KYMA — Cupones de descuento
-- Ejecutar completo en Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Tabla de cupones ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text UNIQUE NOT NULL,
  description    text,
  discount_type  text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10, 2) NOT NULL,
  min_amount     numeric(10, 2) DEFAULT 0,
  max_uses       integer,              -- null = ilimitado
  used_count     integer DEFAULT 0,
  active         boolean DEFAULT true,
  expires_at     timestamptz,          -- null = sin vencimiento
  created_at     timestamptz DEFAULT now()
);

-- Índice para búsqueda por código (case-insensitive)
CREATE INDEX IF NOT EXISTS coupons_code_lower_idx ON coupons (lower(code));

-- Row Level Security
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede leer/escribir coupons
CREATE POLICY "Service role full access on coupons" ON coupons
  FOR ALL
  USING (auth.role() = 'service_role');

-- ── 2. Función RPC para incrementar usos ─────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_coupon_uses(coupon_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE lower(code) = lower(coupon_code);
END;
$$;

-- ── 3. Columnas extra en orders (si no existen) ───────────────────────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount    numeric(10, 2) DEFAULT 0;

-- ── 4. Cupones de ejemplo ─────────────────────────────────────────────────────

-- Lanzamiento: 15% off (50 usos, sin mínimo)
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
VALUES ('KYMA15', 'Lanzamiento 15% OFF', 'percentage', 15, 50)
ON CONFLICT (code) DO NOTHING;

-- Welcome: $5000 off en compras de +$20000
INSERT INTO coupons (code, description, discount_type, discount_value, min_amount, max_uses)
VALUES ('BIENVENIDA', 'Descuento bienvenida $5000', 'fixed', 5000, 20000, 100)
ON CONFLICT (code) DO NOTHING;

-- VIP: 20% off, ilimitado (para campañas de redes)
INSERT INTO coupons (code, description, discount_type, discount_value)
VALUES ('KYMAVIP', 'Descuento VIP 20%', 'percentage', 20)
ON CONFLICT (code) DO NOTHING;
