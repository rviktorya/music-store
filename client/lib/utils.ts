import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, currency: string = "RUB") {
  return new Intl.NumberFormat("ru-RU", { 
    style: "currency", 
    currency,
    minimumFractionDigits: 0 
  }).format(value);
}

export function getOrderStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Ожидание",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен"
  };
  return statusMap[status] || status;
}

export function getPaymentMethodText(method: string) {
  const methodMap: Record<string, string> = {
    card: "Карта",
    cash: "Наличные",
    online: "Онлайн",
    bank_transfer: "Банковский перевод"
  };
  return methodMap[method] || method;
}

export function getPaymentStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Ожидание",
    paid: "Оплачено",
    failed: "Ошибка",
    refunded: "Возврат"
  };
  return statusMap[status] || status;
}

export function getRoleLabel(role: string) {
  switch (role) {
    case "admin":
      return "Администратор";
    case "manager":
      return "Менеджер";
    default:
      return "Покупатель";
  }
}