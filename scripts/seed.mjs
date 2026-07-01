/**
 * Seed script — productos reales de kymaba.com.ar con imágenes reales
 * Uso: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzbledtvuoaujrgusti.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemJsZWR0dnVvYXVqcmd1c3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg4MTM4MCwiZXhwIjoyMDk1NDU3MzgwfQ.vQ_fh5aI68k9jS6op-ASHbk-L6-d3GCirVxmLdZaDsA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Helper: construir URL de imagen en tamaño 1024
const img = (path) =>
  `https://acdn-us.mitiendanube.com/stores/006/445/993/products/${path}`

// ─────────────────────────────────────────────────────────────
// CATEGORÍAS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Básicos & Tops',      slug: 'basicos-esenciales', order: 1 },
  { name: 'Sweaters',            slug: 'sweaters',            order: 2 },
  { name: 'Camperas & Tapados',  slug: 'camperas',            order: 3 },
  { name: 'Polleras & Shorts',   slug: 'polleras-shorts',     order: 4 },
  { name: 'Denim',               slug: 'denim-pantalones',    order: 5 },
  { name: 'Accesorios',          slug: 'accesorios',          order: 6 },
  { name: 'Sale',                slug: 'sale',                order: 7 },
]

// ─────────────────────────────────────────────────────────────
// PRODUCTOS REALES DE KYMABA.COM.AR
// ─────────────────────────────────────────────────────────────
function buildProducts(cat) {
  return [

    // ══ REMERAS & TOPS ══════════════════════════════════════

    {
      name: 'Remera Iron | Oliva',
      slug: 'remera-iron-oliva',
      description: 'Remera 100% algodón super elastizada. Talle único que abarca de S a L. Corte recto, cuello redondo. Ideal para combinar con todo.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('245-36efb0a285d388300617706587030915-1024-1024.webp'),
        img('246-a2fbe5f3384174ba4517706587025769-1024-1024.webp'),
        img('494-88ee617ceea50fa5c217665088300376-1024-1024.webp'),
        img('492-49d0b5b0137f54d31817665088296438-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Iron | Arena',
      slug: 'remera-iron-arena',
      description: 'Remera 100% algodón super elastizada. Talle único que abarca de S a L. Corte recto, cuello redondo.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('243-d30bce1e472cafc61c17706588727566-1024-1024.webp'),
        img('249-bb4b6345eefcd534f217706588728218-1024-1024.webp'),
        img('493-7ce92a276273b2c28917706588597704-1024-1024.webp'),
        img('492-3ed3e1dd3d58edb3d217706588595639-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Kaleo | Blanco',
      slug: 'remera-kaleo-blanco',
      description: 'Remera 100% algodón super elastizada. Talle único que abarca de S a L. Básico imprescindible de temporada.',
      price: 28900,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('213-19cc560bd7d0d244fe17667941314188-1024-1024.webp'),
        img('471-58f8467f996eb067e317665039743392-1024-1024.webp'),
        img('478-5e8683bb83f39815cd17665087776250-1024-1024.webp'),
        img('477-2a9f0734452c66f48517665087781071-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Musculosa Avaia | Negro',
      slug: 'musculosa-avaia-negro',
      description: 'Musculosa 100% algodón super elastizada. Talle único que abarca de S a L. Breteles anchos, espalda recta.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('480-d4109b7d14ed20dabf17665086593121-1024-1024.webp'),
        img('481-c844445e7cffdb13e817665086599076-1024-1024.webp'),
        img('483-f1b39ab9389ef7df9017665086594199-1024-1024.webp'),
        img('482-e8bd2c4d7959519ba217665086592126-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Solene | Blanco',
      slug: 'remera-solene-blanco',
      description: 'Remera 100% algodón super elastizada. Talle único que abarca de S a L. Suave, cómoda y versátil.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('solene-68d50f2f9182d61f0517706534126016-1024-1024.webp'),
        img('489-0ad2ff37968450572217665087029457-1024-1024.webp'),
        img('474-091663deba11dc25cf17665040045992-1024-1024.webp'),
        img('490-6e35878edf6972e27b17665087030905-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Milan | Blanco',
      slug: 'remera-milan-blanco',
      description: 'Remera de algodón suave en blanco. Corte recto, cuello redondo. Básico de colección que nunca falla.',
      price: 28700,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('437-1cc92829b9d7b96b5217810174196314-1024-1024.webp'),
        img('438-15ca48e40720e7af3a17810175072058-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Milan | Negro',
      slug: 'remera-milan-negro',
      description: 'Remera de algodón suave en negro. Corte recto, cuello redondo. Básico de colección que nunca falla.',
      price: 28000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('440-dd2e4e81447843140217810175072814-1024-1024.webp'),
        img('439-73eb663e9dbd12d88317810175071890-1024-1024.webp'),
        img('441-9a199175fe7c15897c17810175067198-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Moss | Blanco',
      slug: 'remera-moss-blanco',
      description: 'Remera premium de algodón en blanco. Silueta relaxed, talle levemente oversize. Calidad y confort en una pieza.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('404-4ca309b5bb0ff6702117810177618914-1024-1024.webp'),
        img('406-8e6b26ee96e259d60517810177616713-1024-1024.webp'),
        img('405-c55a0f9e4c2120ad8317810177621190-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Remera Moss | Negro',
      slug: 'remera-moss-negro',
      description: 'Remera premium de algodón en negro. Silueta relaxed, talle levemente oversize. Calidad y confort en una pieza.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('382-3055828afcdbb0f8c217810177182327-1024-1024.webp'),
        img('383-9c0e16c0ae4bad5ccb17810177181971-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Polera Amalfi | Blanco',
      slug: 'polera-amalfi-blanco',
      description: 'Polera de algodón suave en blanco. Cuello alto, manga larga. Pieza esencial para días fríos con estilo.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('387-46e425fcbd3fb72a2f17810176327058-1024-1024.webp'),
        img('388-0669a58b0cf921deac17810176330928-1024-1024.webp'),
        img('389-acfea5c8792ce2325f17810176326387-1024-1024.webp'),
        img('390-011c2155ddae5c7b6a17810176328404-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Polera Amalfi | Negro',
      slug: 'polera-amalfi-negro',
      description: 'Polera de algodón suave en negro. Cuello alto, manga larga. Pieza esencial para días fríos con estilo.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: false,
      is_active: true,
      images: [
        img('386-072ec8d868278785e817810175765722-1024-1024.webp'),
        img('385-a0e9d2a1a27e1f28c417810175766045-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Top Firenze | Chocolate',
      slug: 'top-firenze-chocolate',
      description: 'Strapless confeccionado en lino con frunces en los costados. Cierre invisible en el lateral. Totalmente forrado al tono. Elástico anti-busto para mayor comodidad.',
      price: 29000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('46-99a58451ecabe775ee17596104957657-1024-1024.webp'),
        img('47-b2702229f81a4e5bf417596104961942-1024-1024.webp'),
        img('45-f35fe89463fe3355e117596104966536-1024-1024.webp'),
        img('44-6aae292ac7c0f945c417596104964461-1024-1024.webp'),
        img('43-5f27f118ad8cb0f9a717596104960311-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Body Chelsa',
      slug: 'body-chelsa',
      description: 'Body de encaje. Talle único, abarca de S a L. Diseño delicado y femenino, ideal para usar solo o debajo de blazers y camperas.',
      price: 32000,
      original_price: null,
      category_id: cat['basicos-esenciales'],
      is_featured: true,
      is_active: true,
      images: [
        img('469-32727c377e70bc535917805013942218-1024-1024.webp'),
        img('468-3f8b54c5a5cd4a840d17805013943584-1024-1024.webp'),
        img('470-00f8f7704d344f27bf17805013942600-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    // ══ SWEATERS ════════════════════════════════════════════

    {
      name: 'Sweater Royale',
      slug: 'sweater-royale',
      description: 'Sweater de la colección After Hours. Tejido de punto premium, silueta oversize. Perfecto para looks nocturnos o casuales con actitud.',
      price: 71000,
      original_price: null,
      category_id: cat['sweaters'],
      is_featured: true,
      is_active: true,
      images: [
        img('422-b32c7dca32b85ae8f817805020614745-1024-1024.webp'),
        img('418-becbd305c58ce57ed817805020614554-1024-1024.webp'),
        img('419-c1ebdf7cfe5b248c6f17805020612954-1024-1024.webp'),
        img('420-3ad19ed456fe4088be17805020613243-1024-1024.webp'),
        img('421-e15134af54f79ad0c417805020612930-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    // ══ CAMPERAS & TAPADOS ══════════════════════════════════

    {
      name: 'Tapado Kira',
      slug: 'tapado-kira',
      description: 'Tapado estructurado de corte recto. Tela de alta calidad, caída impecable. Pieza emblema para la temporada fría.',
      price: 85000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [
        img('429-792f8abeb7a8c8e68217805016855797-1024-1024.webp'),
        img('430-aad710800c407e8ba217805016847273-1024-1024.webp'),
        img('432-0e3a36d76adae5f38e17805016848422-1024-1024.webp'),
        img('431-bef197f394cd0d8f5c17805016851367-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Trench Velvet',
      slug: 'trench-velvet',
      description: 'Trench en terciopelo de lujo. Corte clásico actualizado, cinturón al tono. Una declaración de estilo para cada ocasión.',
      price: 160000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [
        img('463-1decc8de474a2a990b17805017533579-1024-1024.webp'),
        img('466-8bb6726479cdea610217805017537658-1024-1024.webp'),
        img('458-2dddf3adeab59e8ecc17805017527760-1024-1024.webp'),
        img('457-c87dc8ea4435f5a8e717805017530330-1024-1024.webp'),
        img('456-5d53ae2bf8ccf07b1617805017530498-1024-1024.webp'),
        img('465-e6eb8e31a6f649029517805017530844-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Campera Revel | Crema',
      slug: 'campera-revel-crema',
      description: 'Campera en color crema con acabado premium. Corte recto, cierre frontal. Versátil para cualquier ocasión.',
      price: 72000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: true,
      is_active: true,
      images: [
        img('414-2bc1fa028a2ca6736a17810179062988-1024-1024.webp'),
        img('416-ba01d50a94e6a80b5e17810179070774-1024-1024.webp'),
        img('415-9e45ed9433d89b6a0717810179064835-1024-1024.webp'),
        img('413-85b663c386e635769d17810179077548-1024-1024.webp'),
        img('412-26fd1d33096337e6de17810179102272-1024-1024.webp'),
        img('411-29ee0292acf294b88917810179098302-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Campera Revel | Negro',
      slug: 'campera-revel-negro',
      description: 'Campera en negro con acabado premium. Corte recto, cierre frontal. Clásico que combina con todo.',
      price: 68000,
      original_price: null,
      category_id: cat['camperas'],
      is_featured: false,
      is_active: true,
      images: [
        img('410-c4f5950efdb7c863a417810178620481-1024-1024.webp'),
        img('409-75c0a15c543d85e09417810178619764-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    // ══ POLLERAS & SHORTS ════════════════════════════════════

    {
      name: 'Short Kali | Encaje Negro',
      slug: 'short-kali-encaje-negro',
      description: 'Short en encaje negro con forro interno. Cintura elástica, tiro medio. Diseño delicado y femenino. Disponible en S/M y L/XL.',
      price: 35000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: true,
      is_active: true,
      images: [
        img('317-46a13e092080569e5c17730717836463-1024-1024.webp'),
        img('316-894d23b8f1eb71fc3f17730717839167-1024-1024.webp'),
        img('428-6015f27be20b39836817767222158514-1024-1024.webp'),
        img('431-15e865193f1ce51fdd17767222152316-1024-1024.webp'),
        img('430-01a4f9af6809d5021817767222157291-1024-1024.webp'),
        img('429-225e74a2af1a466cc317767222156781-1024-1024.webp'),
      ],
      sizes: ['S/M', 'L/XL'],
    },

    {
      name: 'Short Veka',
      slug: 'short-veka',
      description: 'Tiro bajo y amplio de pierna. Corte relajado en la cadera y el muslo. El talle de la foto es 36. Ante dudas de talle, consultanos.',
      price: 48000,
      original_price: null,
      category_id: cat['polleras-shorts'],
      is_featured: true,
      is_active: true,
      images: [
        img('415-bd506c7f837891fb3817640947021782-1024-1024.webp'),
        img('417-15391e1464c42418b917640947016716-1024-1024.webp'),
        img('416-d31538bf2beb5436a717640947034836-1024-1024.webp'),
        img('413-53446e65e4156ac42317640947023207-1024-1024.webp'),
      ],
      sizes: ['36', '38', '40', '42'],
    },

    {
      name: 'Short Makai',
      slug: 'short-makai',
      description: 'Denim celeste tiro bajo y amplio de pierna. El detalle de los bolsillos delanteros a la vista le da el toque especial. Talle de la foto: 36.',
      price: 45000,
      original_price: 56000,
      category_id: cat['polleras-shorts'],
      is_featured: false,
      is_active: true,
      images: [
        img('485-d21f773e1a729ce93917638351773600-1024-1024.webp'),
        img('486-11fea353577e625fac17638351764982-1024-1024.webp'),
        img('487-a5e982c358e9975da817638351764879-1024-1024.webp'),
        img('484-002b222de79bb6bfce17638351764126-1024-1024.webp'),
        img('488-7aa602852bebf3cf6a17638351768871-1024-1024.webp'),
      ],
      sizes: ['36', '38', '40', '42'],
    },

    // ══ DENIM ════════════════════════════════════════════════

    {
      name: 'Baggy Sage',
      slug: 'baggy-sage',
      description: 'Baggy color azul para usarlo bajo y amplio como en la foto. Elegir un talle más del que sos normalmente. El talle de la foto es 38.',
      price: 75000,
      original_price: null,
      category_id: cat['denim-pantalones'],
      is_featured: true,
      is_active: true,
      images: [
        img('428-71adb586b9e8dd1a6b17767223314811-1024-1024.webp'),
        img('430-090053b5c93c3327d317767223315254-1024-1024.webp'),
        img('431-fe162f2007dfe8de5017767223316645-1024-1024.webp'),
        img('429-f43afd28fdbf60caa117767223311652-1024-1024.webp'),
        img('432-11e8541d9567e1fb7e17767223315436-1024-1024.webp'),
      ],
      sizes: ['36', '38', '40'],
    },

    {
      name: 'Denim Madison',
      slug: 'denim-madison',
      description: 'Denim tiro medio bajo con costuras a tono. Calce rígido y caída recta. Super cómodo para tu día a día. Tener en cuenta la medida de la cadera al elegir talle.',
      price: 47360,
      original_price: 59200,
      category_id: cat['denim-pantalones'],
      is_featured: false,
      is_active: true,
      images: [
        img('332-41fc179214ee1c7f6317563176290037-1024-1024.webp'),
        img('333-76ed0f2990436b6d6517563176291684-1024-1024.webp'),
        img('331-160972df69f7b1333317563176289951-1024-1024.webp'),
        img('57-d7478c90ff63a9b79917531241256886-1024-1024.webp'),
        img('58-b64739395864860a3917531241262284-1024-1024.webp'),
        img('59-152b91c9297a5c74d117531241256272-1024-1024.webp'),
      ],
      sizes: ['36', '38'],
    },

    // ══ ACCESORIOS ═══════════════════════════════════════════

    {
      name: 'Balaclava | Crema',
      slug: 'balaclava-crema',
      description: 'Balaclava en color crema. Talle único. El accesorio de temporada que transforma cualquier look al instante.',
      price: 28000,
      original_price: null,
      category_id: cat['accesorios'],
      is_featured: false,
      is_active: true,
      images: [
        img('400-d17f98e27067882b7817810171426621-1024-1024.webp'),
        img('401-9ca5e4b5c7b0b78d7517810171426415-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Balaclava | Visón',
      slug: 'balaclava-vison',
      description: 'Balaclava en color visón. Talle único. El accesorio de temporada que transforma cualquier look al instante.',
      price: 28000,
      original_price: null,
      category_id: cat['accesorios'],
      is_featured: true,
      is_active: true,
      images: [
        img('442-4de659f5b3ad49dcb017810169630971-1024-1024.webp'),
        img('443-3b64282dfcf5d2555217810169631070-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

    {
      name: 'Balaclava | Negro',
      slug: 'balaclava-negro',
      description: 'Balaclava en color negro. Talle único. El accesorio de temporada que transforma cualquier look al instante.',
      price: 28000,
      original_price: null,
      category_id: cat['accesorios'],
      is_featured: false,
      is_active: true,
      images: [
        img('398-6fa031241d6da7d34817810166264578-1024-1024.webp'),
        img('395-10846dfbd2193b1e7f17810166264914-1024-1024.webp'),
        img('399-402663b1eb50dc74b917810166256559-1024-1024.webp'),
        img('396-f92274f227aed78ddb17810166255663-1024-1024.webp'),
      ],
      sizes: ['Único'],
    },

  ]
}

// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seed con productos reales de kymaba.com.ar...\n')

  // ── 1. Limpiar datos anteriores ────────────────────────────
  console.log('🗑️  Limpiando productos anteriores...')
  await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('   OK\n')

  // ── 2. Upsert categorías ───────────────────────────────────
  console.log('📂 Creando categorías...')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select()

  if (catErr) { console.error('❌', catErr.message); process.exit(1) }

  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))
  console.log(`✅ ${cats.length} categorías\n`)

  // ── 3. Insertar productos ──────────────────────────────────
  const products = buildProducts(catMap)
  let inserted = 0
  let errors = 0
  console.log(`🛍️  Insertando ${products.length} productos...\n`)

  for (const { sizes, ...product } of products) {
    const { data: p, error } = await supabase
      .from('products')
      .insert(product)
      .select('id')
      .single()

    if (error) {
      console.error(`  ❌ ${product.name}: ${error.message}`)
      errors++
      continue
    }

    const badge = product.original_price ? ' 🏷️  SALE' : ''
    const featBadge = product.is_featured ? ' ⭐' : ''
    console.log(`  ✅ ${product.name}${badge}${featBadge}`)
    inserted++

    // Variantes por talle
    if (sizes.length > 0) {
      const variants = sizes.map(size => ({
        product_id: p.id,
        size,
        color: null,
        stock: 5,
      }))
      const { error: varErr } = await supabase.from('product_variants').insert(variants)
      if (varErr) console.error(`     ⚠️  variantes: ${varErr.message}`)
    }
  }

  const saleCount   = products.filter(p => p.original_price).length
  const featCount   = products.filter(p => p.is_featured && p.is_active).length
  const activeCount = products.filter(p => p.is_active).length

  console.log(`
🎉 Seed completado!
   • ${inserted} productos insertados (${errors} errores)
   • ${activeCount} productos activos
   • ${featCount} destacados (aparecen en homepage)
   • ${saleCount} en sale

👉 Abrí http://localhost:3000 para ver la tienda`)
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1) })
