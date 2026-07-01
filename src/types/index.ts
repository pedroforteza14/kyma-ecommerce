export type Category = {
  id: string
  name: string
  slug: string
  order: number
}

export type ProductVariant = {
  id: string
  product_id: string
  size: string
  color: string | null
  stock: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  images: string[]
  category_id: string
  category?: Category
  variants?: ProductVariant[]
  is_active: boolean
  is_featured: boolean
  created_at: string
}

export type CartItem = {
  product_id: string
  variant_id: string
  name: string
  slug?: string
  price: number
  image: string
  size: string
  color: string | null
  quantity: number
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: CartItem[]
  total: number
  status: OrderStatus
  mp_payment_id: string | null
  created_at: string
}
