-- Categorías
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  "order" integer default 0,
  created_at timestamp with time zone default now()
);

-- Productos
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  images text[] default '{}',
  category_id uuid references categories(id),
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Variantes de producto (talles y colores)
create table product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  size text not null,
  color text,
  stock integer default 0,
  created_at timestamp with time zone default now()
);

-- Pedidos
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  mp_payment_id text,
  created_at timestamp with time zone default now()
);

-- Índices para performance
create index on products(category_id);
create index on products(is_active);
create index on products(is_featured);
create index on product_variants(product_id);
create index on orders(status);
create index on orders(mp_payment_id);

-- Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;

-- Políticas: lectura pública para productos y categorías
create policy "Categorias publicas" on categories for select using (true);
create policy "Productos activos publicos" on products for select using (is_active = true);
create policy "Variantes publicas" on product_variants for select using (true);

-- Políticas: solo service_role puede escribir
create policy "Solo admin inserta categorias" on categories for all using (auth.role() = 'service_role');
create policy "Solo admin maneja productos" on products for all using (auth.role() = 'service_role');
create policy "Solo admin maneja variantes" on product_variants for all using (auth.role() = 'service_role');
create policy "Solo admin ve pedidos" on orders for all using (auth.role() = 'service_role');

-- Pedidos: cualquiera puede insertar (checkout)
create policy "Clientes pueden crear pedidos" on orders for insert with check (true);

-- Función para descontar stock de forma segura (evita stock negativo)
create or replace function decrement_stock(variant_id uuid, qty integer)
returns void language plpgsql as $$
begin
  update product_variants
  set stock = greatest(0, stock - qty)
  where id = variant_id;
end;
$$;

-- Datos de ejemplo: categorías
insert into categories (name, slug, "order") values
  ('Remeras & Tops', 'remeras-tops', 1),
  ('Camisas', 'camisas', 2),
  ('Sweaters', 'sweaters', 3),
  ('Camperas & Blazers', 'camperas-blazers', 4),
  ('Denim & Pantalones', 'denim-pantalones', 5),
  ('Polleras & Shorts', 'polleras-shorts', 6),
  ('Accesorios', 'accesorios', 7),
  ('Sale', 'sale', 8);
