// Shapes principales del dominio.

export type SellerRole = "productor" | "curador";

export interface Coffee {
  id: string;
  name: string;
  farm: string;
  farmer: string;
  region: string;
  altitude?: string;
  process: string;
  variety: string;
  notes: string[];
  score: number;
  price: number;
  weight: string;
  roast: string;
  micro?: boolean;
  fairtrade?: boolean;
  fresh: string;
  tag: string;
  img: string;
  bean: string;
  stock?: number;
  verified?: boolean;
  // Específicos de curador
  isCurator?: boolean;
  brand?: string;
  curator?: string;
  city?: string;
  credential?: string;
  bio?: string;
  // Específicos de café del vendedor
  bySeller?: boolean;
  sellerId?: string;
  draft?: boolean;
  imageUrl?: string;
  brandLogo?: string; // logo de la marca del vendedor (sello en el empaque)
}

export interface CartItem extends Coffee {
  qty: number;
  grind?: string;
}

export interface Customer {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  shippingId?: string;
  paymentId?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  farm: string;
  price: number;
  qty: number;
  grind?: string;
  bySeller?: boolean;
  sellerId?: string;
}

export type OrderStatus = "Nuevo" | "Preparando" | "Enviado" | "Entregado";

export interface Order {
  id: string;
  date: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  byUser?: boolean;
  shippingMethod?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface Seller {
  id: string;
  role: SellerRole;
  fincaName: string;
  farmerName: string;
  region: string;
  altitude?: string;
  story?: string;
  certifications?: string[];
  verified?: boolean;
  joined: string;
  logoUrl?: string; // logo de marca subido por el vendedor
}

export interface Subscription {
  planId: string;
  startDate: string;
}

export interface Review {
  id: string;
  coffeeId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Filters {
  priceMin: number;
  priceMax: number;
  scoreMin: number;
  roasts: string[];
  onlyMicro: boolean;
  onlyFairtrade: boolean;
}

export interface FincaEntity {
  name: string;
  farmer: string;
  region: string;
  altitude?: string;
  story?: string;
  certifications?: string[];
  coffees: Coffee[];
  isSeller: boolean;
  kind: "finca" | "curador";
  verified: boolean;
  joined?: string;
  logoUrl?: string;
}

export type Toast = { id: number; text: string } | null;
