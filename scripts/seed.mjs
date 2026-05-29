/**
 * Seed script — productos reales de kymaba.com.ar con imágenes placeholder de Unsplash
 * Uso: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzbledtvuoaujrgusti.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemJsZWR0dnVvYXVqcmd1c3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg4MTM4MCwiZXhwIjoyMDk1NDU3MzgwfQ.vQ_fh5aI68k9jS6op-ASHbk-L6-d3GCirVxmLdZaDsA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ─────────────────────────────────────────────────────────────
// CATEGORÍAS (igual a las slugs del sitio real)
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Básicos Esenciales', slug: 'basicos-esenciales',  order: 1 },
  { name: 'Sweaters',           slug: 'sweaters',             order: 2 },
  { name: 'Camperas & Blazers', slug: 'camperas',             order: 3 },
  { name: 'Polleras & Shorts',  slug: 'polleras-shorts',      order: 4 },
  { name: 'Camisas',            slug: 'camisas',              order: 5 },
  { name: 'Denim',              slug: 'denim-pantalones',     order: 6 },
  { name: 'Sale',               slug: 'sale',                 order: 7 },
]

// Unsplash IDs reutilizables por tipo de prenda
const IMG = {
  // Básicos / remeras
  b1: 'photo-1523381210434-271e8be1f52b', // modelo remera blanca
  b2: 'photo-1618453292459-37cb0d0a9d53', // top liso nude
  b3: 'photo-1515886657613-9f3515b0c78f', // modelo top negro
  b4: 'photo-1539109136881-3be0616acf4b', // musculosa minimal
  b5: 'photo-1512436991641-6745cdb1723f', // remera cropped
  b6: 'photo-1594938298603-c8148c4b4f4a', // top beige/rosé

  // Sweaters
  sw1: 'photo-1576566588028-4147f3842f27', // sweater crema grueso
  sw2: 'photo-1511963211013-83bba110595d', // sweater chocolate oversize
  sw3: 'photo-1487222477894-8943e31ef7b2', // sweater beige editorial
  sw4: 'photo-1434389677669-e08b4cac3105', // knit gris/neutro

  // Camperas & Blazers
  c1: 'photo-1485968579580-b6d095142e6e', // blazer arena / beige
  c2: 'photo-1551028719-00167b16eac5', // campera estructurada
  c3: 'photo-1509631179647-0177331693ae', // blazer blanco oversize
  c4: 'photo-1548036328-c9fa89d128fa', // campera cuero negro

  // Polleras & Shorts
  p1: 'photo-1583496661160-fb5218afa9a3', // shorts encaje
  p2: 'photo-1551489186-cf8726f514f8', // shorts denim verano
  p3: 'photo-1503342217505-b0a15ec3261c', // mini falda denim
  p4: 'photo-1564257631407-4deb1f99d992', // shorts tiro alto

  // Camisas
  cs1: 'photo-1434389677669-e08b4cac3105', // camisa blanca oversize
  cs2: 'photo-1469334031218-e382a71b716b', // camisa editorial

  // Denim
  d1: 'photo-1541099649105-f69ad21f3246', // jeans baggy
  d2: 'photo-1475180098004-ca77a66827be', // denim editorial
}

const u = (id, q = 80) => `https://images.unsplash.com/${id}?w=800&q=${q}`

// ─────────────────────────────────────────────────────────────
// PRODUCTOS  (precios reales de kymaba.com.ar, mayo 2025)
// ─────────────────────────────────────────────────────────────
function buildProducts(cat) {
  return [
    // ══ BÁSICOS ESENCIALES ══════════════════════
    {
      name: 'Remera Iron | Oliva',
      slug: 'remera-iron-oliva',
      description: 'Remera de algodón pima, talle holgado, largo regular. Cuello redondo y mangas cortas. Disponible en varios colores.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.b2), u(IMG.b1)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Remera Iron | Blanco',
      slug: 'remera-iron-blanco',
      description: 'Remera de algodón pima, talle holgado, largo regular. Cuello redondo y mangas cortas.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.b1), u(IMG.b2)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Remera Kaleo | Blanco',
      slug: 'remera-kaleo-blanco',
      description: 'Remera cropped en punto canalé. Silueta ajustada, cuello redondo. Básico clave de temporada.',
      price: 28900,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.b5), u(IMG.b1)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Remera Kaleo | Marrón',
      slug: 'remera-kaleo-marron',
      description: 'Remera cropped en punto canalé. Silueta ajustada, cuello redondo.',
      price: 28900,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.b4), u(IMG.b3)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Musculosa Avaia | Negro',
      slug: 'musculosa-avaia-negro',
      description: 'Musculosa en algodón jersey, breteles anchos, espalda recta. Imprescindible para armar looks.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.b3), u(IMG.b4)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Musculosa Michigan | Blanca',
      slug: 'musculosa-michigan-blanca',
      description: 'Musculosa oversize en algodón 100%. Caída suelta, ideal para layering o como prenda principal.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.b1), u(IMG.b6)],
      sizes: ['S','M','L','XL'],
    },
    {
      name: 'Remera Solene | Rosé',
      slug: 'remera-solene-rose',
      description: 'Remera suave en modal, manga corta, cuello en V sutil. Textura sedosa y color delicado.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.b6), u(IMG.b2)],
      sizes: ['XS','S','M','L','XL'],
    },

    // ══ SWEATERS ════════════════════════════════
    {
      name: 'Sweater Kala | Chocolate',
      slug: 'sweater-kala-chocolate',
      description: 'Sweater de punto suave en tono chocolate. Cuello redondo, mangas con puño acanalado. Cálido y versátil.',
      price: 46000,
      original_price: 63000,
      category_id: cat['sweaters'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.sw2), u(IMG.sw1)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Sweater Kala | Gris',
      slug: 'sweater-kala-gris',
      description: 'Sweater de punto suave en gris melange. Cuello redondo, mangas con puño acanalado.',
      price: 46000,
      original_price: 63000,
      category_id: cat['sweaters'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.sw4), u(IMG.sw3)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Sweater Venus | Crema',
      slug: 'sweater-venus-crema',
      description: 'Sweater oversize en tejido de punto. Tono crema cálido, escote amplio, mangas largas. Look atemporal.',
      price: 63000,
      original_price: 75000,
      category_id: cat['sweaters'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.sw1), u(IMG.sw3)],
      sizes: ['S','M','L','XL'],
    },
    {
      name: 'Sweater Venus | Negro',
      slug: 'sweater-venus-negro',
      description: 'Sweater oversize en tejido de punto. Negro intenso, escote amplio, mangas largas.',
      price: 63000,
      original_price: 75000,
      category_id: cat['sweaters'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.sw3), u(IMG.sw2)],
      sizes: ['S','M','L','XL'],
    },
    {
      name: 'Sweater Venka | Negro',
      slug: 'sweater-venka-negro',
      description: 'Sweater premium en mezcla de lana y alpaca. Silueta amplia, cuello levemente subido. Tejido de temporada.',
      price: 75000,
      original_price: null,
      category_id: cat['sweaters'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.sw3), u(IMG.sw4)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Sweater Venka | Chocolate',
      slug: 'sweater-venka-chocolate',
      description: 'Sweater premium en mezcla de lana y alpaca. Silueta amplia, cuello levemente subido.',
      price: 75000,
      original_price: null,
      category_id: cat['sweaters'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.sw2), u(IMG.sw1)],
      sizes: ['XS','S','M','L','XL'],
    },

    // ══ CAMPERAS & BLAZERS ═══════════════════════
    {
      name: 'Campera Atenea',
      slug: 'campera-atenea',
      description: 'Campera estructurada en paño. Cuello con solapa, cierre frontal, bolsillos laterales. Pieza emblema de temporada.',
      price: 69000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.c2), u(IMG.c1)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Campera Lisboa',
      slug: 'campera-lisboa',
      description: 'Campera tipo bomber en nylon liviano. Cuello redondo, puños y bajo a rib. Combinable con todo.',
      price: 71000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.c4), u(IMG.c2)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Campera Gales',
      slug: 'campera-gales',
      description: 'Campera oversize en lana bouclé. Botones al tono, bolsillos externos. Textura y calidez en una sola pieza.',
      price: 87000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.c1), u(IMG.c3)],
      sizes: ['S','M','L'],
    },
    {
      name: 'Campera Makia | Crema',
      slug: 'campera-makia-crema',
      description: 'Campera en cuero ecológico, corte recto. Cierre metálico al tono, bolsillos con tapa. Disponible en 4 colores.',
      price: 47000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.c3), u(IMG.c1)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Blazer Gia',
      slug: 'blazer-gia',
      description: 'Blazer oversize de corte masculino en paño premium. Solapa ancha, bolsillos internos y externos. Pieza clave.',
      price: 75000,
      original_price: 112000,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.c1), u(IMG.c3)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Blazer Carmin',
      slug: 'blazer-carmin',
      description: 'Blazer en crepe de alta calidad. Solapa a muesca, botón único. Sin stock, pronto disponible.',
      price: 85000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: false,
      is_active: false, // sin stock → inactivo
      images: [u(IMG.c3), u(IMG.c2)],
      sizes: [],
    },

    // ══ POLLERAS & SHORTS ════════════════════════
    {
      name: 'Short Kali | Encaje Negro',
      slug: 'short-kali-encaje-negro',
      description: 'Short en encaje floral con forro interno. Cintura elástica, tiro medio. Diseño delicado y femenino.',
      price: 35000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.p1), u(IMG.p4)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Short Kali | Encaje Blanco',
      slug: 'short-kali-encaje-blanco',
      description: 'Short en encaje floral con forro interno. Cintura elástica, tiro medio.',
      price: 35000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.p4), u(IMG.p1)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Short Veka',
      slug: 'short-veka',
      description: 'Short de tiro alto en sarga de algodón. Pinzas frontales, cierre con cremallera invisible. Minimal y elegante.',
      price: 48000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.p2), u(IMG.p3)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Short Makai',
      slug: 'short-makai',
      description: 'Short denim celeste de tiro alto. Lavado claro, detalles desgastados en las costuras. Básico de verano.',
      price: 45000,
      original_price: 56000,
      category_id: cat['polleras-shorts'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.p3), u(IMG.p2)],
      sizes: ['XS','S','M','L'],
    },
    {
      name: 'Short Genesis',
      slug: 'short-genesis',
      description: 'Short denim azul de tiro alto, corte recto. Cintura ajustable con pasadores y cierre metálico.',
      price: 43000,
      original_price: 53000,
      category_id: cat['polleras-shorts'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.p2), u(IMG.p4)],
      sizes: ['XS','S','M','L','XL'],
    },
    {
      name: 'Pollera Calabria',
      slug: 'pollera-calabria',
      description: 'Pollera midi en seda natural. Corte recto, lateral con abertura. Última unidades.',
      price: 18000,
      original_price: 42000,
      category_id: cat['polleras-shorts'],
      is_featured: false,
      is_active: true,
      images: [u(IMG.p4), u(IMG.p1)],
      sizes: ['S','M'],
    },
    {
      name: 'Mini Mevak',
      slug: 'mini-mevak',
      description: 'Mini falda acampanada en paño liviano. Cintura alta con pliegues, largo mini. Femenina y versátil.',
      price: 46000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.p3), u(IMG.p4)],
      sizes: ['XS','S','M','L'],
    },

    // ══ CAMISAS ══════════════════════════════════
    {
      name: 'Camisa Fonte',
      slug: 'camisa-fonte',
      description: 'Camisa oversize en popelín de algodón. Cuello italiano, botones nácar. Clásico renovado, para usar de día o noche.',
      price: 66000,
      original_price: 73000,
      category_id: cat['camisas'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.cs1), u(IMG.cs2)],
      sizes: ['XS','S','M','L','XL'],
    },

    // ══ DENIM ════════════════════════════════════
    {
      name: 'Baggy Sage',
      slug: 'baggy-sage',
      description: 'Jean baggy en denim premium. Tiro ultra alto, pierna ancha. Lavado azul medio con rasgados sutiles en las rodillas.',
      price: 75000,
      original_price: null,
      category_id: cat['denim-pantalones'],
      is_featured: true,
      is_active: true,
      images: [u(IMG.d1), u(IMG.d2)],
      sizes: ['XS','S','M','L','XL'],
    },
  ]
}

// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Iniciando seed con productos reales de KYMA...\n')

  // ── 1. Limpiar tabla anterior ──────────────────
  console.log('🗑️  Limpiando productos anteriores...')
  await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('   OK\n')

  // ── 2. Upsert categorías ───────────────────────
  console.log('📂 Creando categorías...')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select()

  if (catErr) { console.error('❌', catErr.message); process.exit(1) }

  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))
  console.log(`✅ ${cats.length} categorías\n`)

  // ── 3. Insertar productos ──────────────────────
  const products = buildProducts(catMap)
  console.log(`🛍️  Insertando ${products.length} productos de kymaba.com.ar...\n`)

  for (const { sizes, ...product } of products) {
    const { data: p, error } = await supabase
      .from('products')
      .insert(product)
      .select('id')
      .single()

    if (error) {
      console.error(`  ❌ ${product.name}: ${error.message}`)
      continue
    }

    const label = product.original_price ? `${product.name}  🏷️  SALE` : product.name
    console.log(`  ✅ ${label}`)

    // variantes por talle
    if (sizes.length > 0) {
      const variants = sizes.map(size => ({
        product_id: p.id,
        size,
        color: null,
        stock: size === 'S' || size === 'M' ? 8 : 4, // más stock en talles intermedios
      }))
      const { error: varErr } = await supabase.from('product_variants').insert(variants)
      if (varErr) console.error(`     ⚠️  variantes: ${varErr.message}`)
    }
  }

  const activeCount = products.filter(p => p.is_active).length
  const saleCount   = products.filter(p => p.original_price).length
  const featCount   = products.filter(p => p.is_featured && p.is_active).length

  console.log(`
🎉 Seed completado!
   • ${activeCount} productos activos
   • ${featCount} destacados (aparecen en homepage)
   • ${saleCount} con descuento (aparecen en sección Sale)

👉 Abrí http://localhost:3000 para ver la tienda`)
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1) })
