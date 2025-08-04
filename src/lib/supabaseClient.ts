import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type CouponType = "percentage" | "fixed_amount";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  price: number;
  stock_quantity: number;
  sku: string | null;
  image_urls: string[];
  weight_grams: number | null;
  dimensions_cm: {
    height: number;
    width: number;
    length: number;
  } | null;
  created_at: string;
  updated_at: string | null;
  original_price: number | null;
  is_offer: boolean;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  status: ProductStatus;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
  variants: ProductVariant[]; // NOVO: lista de variantes
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  description: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  times_used: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  coupon_id: string | null;
  customer_email: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_price: number;
  status: OrderStatus;
  shipping_method: string | null;
  tracking_code: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  installments?: number | null;
  payment_fee?: number | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null; // NOVO: referência à variante
  quantity: number;
  price_at_purchase: number;
}

export function getProductImageUrls(imagePaths: string[]): string[] {
  return (imagePaths || []).map((path) => {
    const { data } = supabase.storage
      .from("imagens-produtos")
      .getPublicUrl(path);
    return data.publicUrl;
  });
}

export function getProductImageUrl(filename: string): string {
  if (!filename) return "";
  // Adicionar parâmetros para melhor qualidade e otimização
  return `https://bxybenfsenafildrevew.supabase.co/storage/v1/object/public/imagens-produtos/${filename}?quality=90&format=webp`;
}
