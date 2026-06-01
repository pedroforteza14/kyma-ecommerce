-- ════════════════════════════════════════════════════════════════════════════
-- KYMA — Tracking de pedidos
-- Ejecutar en Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS carrier         text;
