/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Domain models for the music instruments e-commerce
export type UUID = string;

export type UserRole = "admin" | "manager" | "customer";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'online' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type AdminPermission = 
  | 'users:read' | 'users:write' | 'users:delete'
  | 'products:read' | 'products:write' | 'products:delete'
  | 'orders:read' | 'orders:write' | 'orders:delete'
  | 'reviews:read' | 'reviews:write' | 'reviews:delete'
  | 'analytics:read'
  | 'system:config';

export interface User {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'blocked';
  permissions?: AdminPermission[];
  department?: string;
  position?: string;
}

export interface Address {
  id: UUID;
  userId: UUID;
  title: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: UUID;
  productId: UUID;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: UUID;
  userId: UUID;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: UUID;
  userId: UUID;
  productId: UUID;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

export interface User {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'blocked';
  // Дополнительные поля
  addresses?: Address[];
  orders?: Order[];
  reviews?: Review[];
  totalOrders?: number;
  totalSpent?: number;
}

export interface User {
  id: UUID;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO string
  status: "active" | "blocked";
}

export interface Product {
  id: UUID;
  name: string;
  brand: string;
  category: CategoryKey;
  price: number; // in smallest currency unit? using number of selected currency
  currency: "RUB" | "USD" | "EUR";
  rating: number; // 0..5
  reviews: number;
  image: string; // URL or path to public asset
  description: string;
  inStock: number; // quantity
}

export type CategoryKey =
  | "guitars"
  | "keyboards"
  | "drums"
  | "brass"
  | "strings"
  | "studio"
  | "dj"
  | "accessories";

export interface Category {
  key: CategoryKey;
  title: string;
  icon: string; // lucide icon name or custom id
}
