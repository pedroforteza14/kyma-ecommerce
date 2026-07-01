-- Tabla para carritos abandonados (recovery emails)
-- Pegar en: https://supabase.com/dashboard/project/wdzbledtvuoaujrgusti/sql/new

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid default gen_random_uuid() primary key,
  customer_email text not null,
  customer_name text,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  recovered boolean default false,
  reminder_sent boolean default false,
  created_at timestamp with time zone default now()
);

-- Un solo carrito abandonado por email (el más reciente reemplaza al anterior)
CREATE UNIQUE INDEX IF NOT EXISTS idx_abandoned_carts_email
  ON abandoned_carts(customer_email);

-- Para el cron: buscar carritos no recuperados y no enviados
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_pending
  ON abandoned_carts(reminder_sent, recovered)
  WHERE reminder_sent = false AND recovered = false;

-- RLS
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Service role tiene acceso total
CREATE POLICY "Solo admin maneja carritos abandonados"
  ON abandoned_carts FOR ALL
  USING (auth.role() = 'service_role');

-- Cualquiera puede crear (checkout guarda el carrito)
CREATE POLICY "Checkout puede crear carrito abandonado"
  ON abandoned_carts FOR INSERT
  WITH CHECK (true);
