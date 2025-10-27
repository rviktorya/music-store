import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { getUserOrders, getUserReviews, getUserAddresses, getUserStats } = useStore();

  if (!currentUser) {
    return null;
  }

  // Получаем реальные данные пользователя
  const orders = getUserOrders(currentUser.id);
  const reviews = getUserReviews(currentUser.id);
  const addresses = getUserAddresses(currentUser.id);
  const stats = getUserStats(currentUser.id);

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <p className="text-muted-foreground mt-2">
            Управление вашей учетной записью и заказами
          </p>
        </div>
        
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Основная информация */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">Имя</div>
              <div>{currentUser.name}</div>
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <div>{currentUser.email}</div>
            </div>
            {currentUser.phone && (
              <div>
                <div className="font-semibold">Телефон</div>
                <div>{currentUser.phone}</div>
              </div>
            )}
            <div>
              <div className="font-semibold">Роль</div>
              <div>{getRoleLabel(currentUser.role)}</div>
            </div>
            <div>
              <div className="font-semibold">Статус</div>
              <Badge variant={currentUser.status === "active" ? "default" : "destructive"}>
                {currentUser.status === "active" ? "Активен" : "Заблокирован"}
              </Badge>
            </div>
            <div>
              <div className="font-semibold">Дата регистрации</div>
              <div>{new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}</div>
            </div>
            {currentUser.lastLogin && (
              <div>
                <div className="font-semibold">Последний вход</div>
                <div>{new Date(currentUser.lastLogin).toLocaleDateString('ru-RU')}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Вкладки с дополнительной информацией */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Мои данные</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Заказы ({orders.length})</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
                <TabsTrigger value="addresses">Адреса ({addresses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    У вас пока нет заказов
                  </div>
                ) : (
                  orders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">Заказ #{order.orderNumber}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-sm mt-1">
                              {order.items.length} товар(ов) • {formatPrice(order.totalAmount)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {getPaymentMethodText(order.paymentMethod)} • {getPaymentStatusText(order.paymentStatus)}
                            </div>
                          </div>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {getOrderStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        {/* Детали заказа */}
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium">Товары:</div>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.productName} × {item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-3 text-sm">
                            <div className="font-medium">Адрес доставки:</div>
                            <div className="text-muted-foreground">
                              {order.shippingAddress.street}, {order.shippingAddress.city}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    У вас пока нет отзывов
                  </div>
                ) : (
                  reviews.map(review => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{review.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 font-semibold">{review.rating}</span>
                            </div>
                            {review.isVerified && (
                              <Badge variant="outline" className="text-xs">Проверен</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="addresses" className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    У вас пока нет сохраненных адресов
                  </div>
                ) : (
                  addresses.map(address => (
                    <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{address.title}</div>
                            <div className="text-sm mt-1">
                              {address.street}, {address.city}, {address.postalCode}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.fullName} • {address.phone}
                            </div>
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary">По умолчанию</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Статистика для покупателей */}
      {currentUser.role === 'customer' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Статистика покупок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                <div className="text-sm text-muted-foreground">Всего заказов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatPrice(stats.totalSpent || 0)}</div>
                <div className="text-sm text-muted-foreground">Общая сумма</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalReviews || 0}</div>
                <div className="text-sm text-muted-foreground">Отзывов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                </div>
                <div className="text-sm text-muted-foreground">Средний рейтинг</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Вспомогательные функции
function getRoleLabel(role: string) {
  switch (role) {
    case "admin":
      return "Администратор";
    case "manager":
      return "Менеджер";
    default:
      return "Покупатель";
  }
}

function getOrderStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Ожидание",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен"
  };
  return statusMap[status] || status;
}

function getPaymentMethodText(method: string) {
  const methodMap: Record<string, string> = {
    card: "Карта",
    cash: "Наличные",
    online: "Онлайн",
    bank_transfer: "Банковский перевод"
  };
  return methodMap[method] || method;
}

function getPaymentStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "Ожидание",
    paid: "Оплачено",
    failed: "Ошибка",
    refunded: "Возврат"
  };
  return statusMap[status] || status;
}