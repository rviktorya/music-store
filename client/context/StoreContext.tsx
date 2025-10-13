import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Product, User, Order, Review, Address, UUID } from "@shared/api";
import { 
  products as seedProducts, 
  users as seedUsers,
  orders as seedOrders,
  reviews as seedReviews,
  addresses as seedAddresses
} from "@shared/data";

// Добавьте типы для корзины
export interface CartItem {
  productId: UUID;
  quantity: number;
}

// Обновите State интерфейс
interface State {
  products: Product[];
  users: User[];
  orders: Order[];
  reviews: Review[];
  addresses: Address[];
  cart: CartItem[]; // Добавляем корзину
}

// Добавьте действия для корзины
type Action =
  | { type: "user/add"; payload: User }
  | { type: "user/update"; payload: User }
  | { type: "user/remove"; payload: string }
  | { type: "order/add"; payload: Order }
  | { type: "order/update"; payload: Order }
  | { type: "order/remove"; payload: string }
  | { type: "review/add"; payload: Review }
  | { type: "review/update"; payload: Review }
  | { type: "review/remove"; payload: string }
  | { type: "address/add"; payload: Address }
  | { type: "address/update"; payload: Address }
  | { type: "address/remove"; payload: string }
  | { type: "address/set_default"; payload: { addressId: string; userId: string } }
  | { type: "cart/add"; payload: Product } // Добавить товар в корзину
  | { type: "cart/remove"; payload: string } // Удалить товар из корзины
  | { type: "cart/update_quantity"; payload: { productId: string; quantity: number } } // Обновить количество
  | { type: "cart/clear" }; // Очистить корзину

// Обновите начальное состояние
const initialState: State = {
  products: seedProducts,
  users: seedUsers,
  orders: seedOrders,
  reviews: seedReviews,
  addresses: seedAddresses,
  cart: [], // Пустая корзина по умолчанию
};

// Добавьте функции в контекст
const StoreContext = createContext<{
  state: State;
  // User actions
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
  removeUser: (id: string) => void;
  // Order actions
  addOrder: (o: Order) => void;
  updateOrder: (o: Order) => void;
  removeOrder: (id: string) => void;
  // Review actions
  addReview: (r: Review) => void;
  updateReview: (r: Review) => void;
  removeReview: (id: string) => void;
  // Address actions
  addAddress: (a: Address) => void;
  updateAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (addressId: string, userId: string) => void;
  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Helper functions
  getUserOrders: (userId: string) => Order[];
  getUserReviews: (userId: string) => Review[];
  getUserAddresses: (userId: string) => Address[];
  getUserStats: (userId: string) => ReturnType<typeof getUserStats>;
  getEnhancedUser: (user: User) => EnhancedUser;
  getEnhancedUsers: () => EnhancedUser[];
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    // User actions
    case "user/add":
      return { ...state, users: [action.payload, ...state.users] };
    case "user/update":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
      };
    case "user/remove":
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
        // Optional: also remove user's orders, reviews, addresses
        orders: state.orders.filter((o) => o.userId !== action.payload),
        reviews: state.reviews.filter((r) => r.userId !== action.payload),
        addresses: state.addresses.filter((a) => a.userId !== action.payload),
      };

    // Order actions
    case "order/add":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "order/update":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o,
        ),
      };
    case "order/remove":
      return {
        ...state,
        orders: state.orders.filter((o) => o.id !== action.payload),
      };

    // Review actions
    case "review/add":
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case "review/update":
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      };
    case "review/remove":
      return {
        ...state,
        reviews: state.reviews.filter((r) => r.id !== action.payload),
      };

    // Address actions
    case "address/add":
      return { ...state, addresses: [action.payload, ...state.addresses] };
    case "address/update":
      return {
        ...state,
        addresses: state.addresses.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        ),
      };
    case "address/remove":
      return {
        ...state,
        addresses: state.addresses.filter((a) => a.id !== action.payload),
      };
    case "address/set_default":
      return {
        ...state,
        addresses: state.addresses.map((a) =>
          a.userId === action.payload.userId
            ? { ...a, isDefault: a.id === action.payload.addressId }
            : a
        ),
      };

        // Обработчики для корзины
        case "cart/add": {
          const product = action.payload;
          const existingItem = state.cart.find(item => item.productId === product.id);
          
          if (existingItem) {
            // Если товар уже есть в корзине, увеличиваем количество
            return {
              ...state,
              cart: state.cart.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            // Если товара нет в корзине, добавляем его
            return {
              ...state,
              cart: [...state.cart, { productId: product.id, quantity: 1 }]
            };
          }
        }
    
        case "cart/remove":
          return {
            ...state,
            cart: state.cart.filter(item => item.productId !== action.payload)
          };
    
        case "cart/update_quantity":
          return {
            ...state,
            cart: state.cart.map(item =>
              item.productId === action.payload.productId
                ? { ...item, quantity: action.payload.quantity }
                : item
            ).filter(item => item.quantity > 0) // Удаляем если количество стало 0
          };
    
        case "cart/clear":
          return {
            ...state,
            cart: []
          };
    
        default:
          return state;
  }
}

// Helper functions to get user-related data
export function getUserOrders(state: State, userId: string): Order[] {
  return state.orders.filter((order) => order.userId === userId);
}

export function getUserReviews(state: State, userId: string): Review[] {
  return state.reviews.filter((review) => review.userId === userId);
}

export function getUserAddresses(state: State, userId: string): Address[] {
  return state.addresses.filter((address) => address.userId === userId);
}

export function getUserStats(state: State, userId: string) {
  const userOrders = getUserOrders(state, userId);
  const userReviews = getUserReviews(state, userId);
  
  return {
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalReviews: userReviews.length,
    averageRating: userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0,
  };
}

// Enhanced user type with derived data
export type EnhancedUser = User & {
  orders?: Order[];
  reviews?: Review[];
  addresses?: Address[];
  totalOrders: number;
  totalSpent: number;
  totalReviews: number;
  averageRating: number;
};

export function getEnhancedUser(state: State, user: User): EnhancedUser {
  const stats = getUserStats(state, user.id);
  return {
    ...user,
    orders: getUserOrders(state, user.id),
    reviews: getUserReviews(state, user.id),
    addresses: getUserAddresses(state, user.id),
    ...stats,
  };
}

export function getEnhancedUsers(state: State): EnhancedUser[] {
  return state.users.map(user => getEnhancedUser(state, user));
}

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      state,
      // User actions
      addUser: (u: User) => dispatch({ type: "user/add", payload: u }),
      updateUser: (u: User) => dispatch({ type: "user/update", payload: u }),
      removeUser: (id: string) => dispatch({ type: "user/remove", payload: id }),
      // Order actions
      addOrder: (o: Order) => dispatch({ type: "order/add", payload: o }),
      updateOrder: (o: Order) => dispatch({ type: "order/update", payload: o }),
      removeOrder: (id: string) => dispatch({ type: "order/remove", payload: id }),
      // Review actions
      addReview: (r: Review) => dispatch({ type: "review/add", payload: r }),
      updateReview: (r: Review) => dispatch({ type: "review/update", payload: r }),
      removeReview: (id: string) => dispatch({ type: "review/remove", payload: id }),
      // Address actions
      addAddress: (a: Address) => dispatch({ type: "address/add", payload: a }),
      updateAddress: (a: Address) => dispatch({ type: "address/update", payload: a }),
      removeAddress: (id: string) => dispatch({ type: "address/remove", payload: id }),
      setDefaultAddress: (addressId: string, userId: string) => 
        dispatch({ type: "address/set_default", payload: { addressId, userId } }),
      // Helper functions
      getUserOrders: (userId: string) => getUserOrders(state, userId),
      getUserReviews: (userId: string) => getUserReviews(state, userId),
      getUserAddresses: (userId: string) => getUserAddresses(state, userId),
      getUserStats: (userId: string) => getUserStats(state, userId),
      getEnhancedUser: (user: User) => getEnhancedUser(state, user),
      getEnhancedUsers: () => getEnhancedUsers(state),
      // Cart actions
      addToCart: (product: Product) => dispatch({ type: "cart/add", payload: product }),
      removeFromCart: (productId: string) => dispatch({ type: "cart/remove", payload: productId }),
      updateCartQuantity: (productId: string, quantity: number) => 
        dispatch({ type: "cart/update_quantity", payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: "cart/clear" }),
    }),
    [state],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}