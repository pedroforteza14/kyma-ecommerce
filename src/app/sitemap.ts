import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kyma.com.ar'

  // En build time sin credenciales reales, devolvemos solo la home
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  if (!supabaseUrl.startsWith('http')) {
    return [{ url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }]
  }

  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, created_at').eq('is_active', true),
    supabase.from('categories').select('slug'),
  ])

  const productUrls: MetadataRoute.Sitemap =
    products?.map((p) => ({
      url: `${base}/producto/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) ?? []

  const categoryUrls: MetadataRoute.Sitemap =
    categories?.map((c) => ({
      url: `${base}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })) ?? []

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
