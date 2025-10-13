import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { state, updateCartQuantity, removeFromCart, clearCart } = useStore();

  const cartItems = state.cart.map(item => {
    const product = state.products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product); // Фильтруем товары, которые могли быть удалены

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-muted-foreground mb-6">
            Добавьте товары из каталога, чтобы сделать заказ
          </p>
          <Link to="/catalog">
            <Button size="lg">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Корзина</h1>
        <Button 
          variant="outline" 
          onClick={clearCart}
          className="text-destructive, hover:bg-gray-200 hover:text-black"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Очистить корзину
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.productId} className="flex items-center gap-4 border rounded-lg p-4">
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{item.product.brand}</p>
                <p className="font-bold text-primary">{formatPrice(item.product.price)}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Управление количеством */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8, hover:bg-gray-200 hover:text-black"
                  >
                    <Minus className="h-3 w-3, hover:bg-gray-200 hover:text-black" />
                  </Button>
                  
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min="1"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="h-8 w-8, hover:bg-gray-200 hover:text-black"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Сумма за товар */}
                <div className="text-right min-w-[100px]">
                  <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                </div>

                {/* Удалить */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.productId)}
                  className="text-destructive hover:text-destructive, hover:bg-gray-200 hover:text-black"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая информация */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Итоги заказа</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка</span>
                <span className="text-green-600">Бесплатно</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Оформить заказ
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(value: number, currency: string = "RUB") {
  return new Intl.NumberFormat("ru-RU", { 
    style: "currency", 
    currency,
    minimumFractionDigits: 0 
  }).format(value);
}