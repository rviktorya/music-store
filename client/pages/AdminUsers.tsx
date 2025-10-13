import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import type { User, UserRole, Order, Review, Address, AdminPermission } from "@shared/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createUserDraft, ROLE_PERMISSIONS } from "@shared/data"; // Импортируем отсюда
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// Мокируем текущего пользователя (в реальном приложении это будет из контекста аутентификации)
const CURRENT_USER: User = {
  id: "current-user",
  name: "Администратор",
  email: "admin@musemart.ru",
  role: "admin",
  createdAt: new Date().toISOString(),
  status: "active",
  permissions: ROLE_PERMISSIONS.admin
};

export default function AdminUsers() {
  const { state, addUser, updateUser, removeUser, getEnhancedUsers } = useStore();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  // Проверка прав доступа
  const hasPermission = (permission: AdminPermission): boolean => {
    return CURRENT_USER.permissions?.includes(permission) || false;
  };

  // Используем расширенных пользователей из StoreContext
  const usersWithDetails = useMemo(() => {
    return getEnhancedUsers();
  }, [state.users, getEnhancedUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filteredUsers = usersWithDetails;

    // Менеджеры видят только покупателей и других менеджеров
    if (CURRENT_USER.role === 'manager') {
      filteredUsers = filteredUsers.filter(user => 
        user.role === 'customer' || user.role === 'manager'
      );
    }

    if (!q) return filteredUsers;
    
    return filteredUsers.filter((u) =>
      [u.name, u.email, u.role, u.status, u.phone, u.department, u.position].some((f) =>
        f?.toString().toLowerCase().includes(q),
      ),
    );
  }, [query, usersWithDetails]);

  function onSave(user: User) {
    const exists = state.users.some((u) => u.id === user.id);
    
    // Проверка прав для создания/редактирования
    if (user.role === 'admin' && !hasPermission('users:write')) {
      toast({ title: "Ошибка", description: "Недостаточно прав для создания администратора", variant: "destructive" });
      return;
    }

    if (exists) {
      updateUser(user);
      toast({ title: "Пользователь обновлён" });
    } else {
      addUser(user);
      toast({ title: "Пользователь создан" });
    }
    setEditing(null);
  }

  function onDelete(id: string) {
    const user = state.users.find(u => u.id === id);
    
    // Проверка прав для удаления
    if (user?.role === 'admin' && !hasPermission('users:delete')) {
      toast({ title: "Ошибка", description: "Недостаточно прав для удаления администратора", variant: "destructive" });
      return;
    }

    if (user && hasPermission('users:delete')) {
      removeUser(id);
      toast({ title: "Пользователь удалён" });
    } else {
      toast({ title: "Ошибка", description: "Недостаточно прав для удаления пользователей", variant: "destructive" });
    }
  }

  // Если у пользователя нет прав на просмотр админки
  if (!hasPermission('users:read')) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Доступ запрещен</h1>
          <p className="text-muted-foreground mt-2">
            У вас недостаточно прав для доступа к панели администрирования.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Панель администрирования
          </h1>
          <p className="text-muted-foreground">
            {CURRENT_USER.role === 'admin' 
              ? "Полное управление системой" 
              : CURRENT_USER.role === 'manager'
              ? "Управление заказами и товарами"
              : "Просмотр информации"}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Поиск пользователей..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          {hasPermission('users:write') && (
            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditing(createUserDraft())}>
                  Новый пользователь
                </Button>
              </DialogTrigger>
              {editing && (
                <UserEditor
                  user={editing}
                  onCancel={() => setEditing(null)}
                  onSave={onSave}
                  currentUserRole={CURRENT_USER.role}
                />
              )}
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            Пользователи ({filtered.length})
          </TabsTrigger>
          
          {hasPermission('orders:read') && (
            <TabsTrigger value="orders">Заказы</TabsTrigger>
          )}
          
          {hasPermission('reviews:read') && (
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          )}
          
          {hasPermission('analytics:read') && (
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users">
          <UsersTable 
            users={filtered} 
            onEdit={setEditing}
            onDelete={onDelete}
            onViewDetails={setSelectedUser}
            canEdit={hasPermission('users:write')}
            canDelete={hasPermission('users:delete')}
          />
        </TabsContent>

        {hasPermission('orders:read') && (
          <TabsContent value="orders">
            <OrdersTable canEdit={hasPermission('orders:write')} />
          </TabsContent>
        )}

        {hasPermission('reviews:read') && (
          <TabsContent value="reviews">
            <ReviewsTable canEdit={hasPermission('reviews:write')} />
          </TabsContent>
        )}

        {hasPermission('analytics:read') && (
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        )}
      </Tabs>

      {/* Детали пользователя */}
      <UserDetailsDialog 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)}
        currentUserRole={CURRENT_USER.role}
      />
    </div>
  );
}

// Компонент таблицы пользователей с учетом прав
function UsersTable({ users, onEdit, onDelete, onViewDetails, canEdit, canDelete }: {
  users: any[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onViewDetails: (user: User) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Пользователь</TableHead>
          <TableHead>Контакты</TableHead>
          <TableHead>Роль/Должность</TableHead>
          <TableHead>Статистика</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-muted-foreground">
                  {u.department && <span>{u.department} • </span>}
                  {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="text-sm">{u.email}</div>
                {u.phone && <div className="text-sm text-muted-foreground">{u.phone}</div>}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div>{roleLabel(u.role)}</div>
                {u.position && <div className="text-xs text-muted-foreground">{u.position}</div>}
              </div>
            </TableCell>
            <TableCell>
              {u.role === 'customer' ? (
                <div className="space-y-1 text-sm">
                  <div>Заказы: {u.totalOrders || 0}</div>
                  <div>Потратил: {formatPrice(u.totalSpent || 0)}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {u.role === 'admin' ? 'Полный доступ' : 'Ограниченный доступ'}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={u.status === "active" ? "default" : "destructive"}>
                {u.status === "active" ? "Активен" : "Заблокирован"}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                className="hover:bg-gray-200 hover:text-black"
                size="sm"
                onClick={() => onViewDetails(u)}
              >
                Детали
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-200 hover:text-black"
                  onClick={() => onEdit(u)}
                  disabled={u.role === 'admin' && CURRENT_USER.role !== 'admin'}
                >
                  Изменить
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(u.id)}
                  disabled={u.role === 'admin' && CURRENT_USER.role !== 'admin'}
                >
                  Удалить
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>
        Всего пользователей: {users.length}
        {CURRENT_USER.role === 'manager' && ' (только покупатели и менеджеры)'}
      </TableCaption>
    </Table>
  );
}

// Компонент деталей пользователя с разным контентом для разных ролей
function UserDetailsDialog({ user, onClose, currentUserRole }: { 
  user: any; 
  onClose: () => void;
  currentUserRole: UserRole;
}) {
  const { getUserOrders, getUserReviews, getUserAddresses, getUserStats } = useStore();
  
  if (!user) return null;

  // Для покупателей показываем детальную информацию о заказах
  // Для сотрудников - служебную информацию
  const userOrders = getUserOrders(user.id);
  const userReviews = getUserReviews(user.id);
  const userAddresses = getUserAddresses(user.id);
  const userStats = getUserStats(user.id);

  const userWithDetails = {
    ...user,
    orders: userOrders,
    reviews: userReviews,
    addresses: userAddresses,
    ...userStats
  };

  const isCustomer = user.role === 'customer';
  const isStaff = user.role === 'admin' || user.role === 'manager';

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCustomer ? `Покупатель: ${user.name}` : 
             isStaff ? `Сотрудник: ${user.name}` : user.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">
              {isCustomer ? "Профиль" : "Основная информация"}
            </TabsTrigger>
            
            {isCustomer && (
              <>
                <TabsTrigger value="orders">Заказы ({userWithDetails.orders?.length || 0})</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы ({userWithDetails.reviews?.length || 0})</TabsTrigger>
                <TabsTrigger value="addresses">Адреса ({userWithDetails.addresses?.length || 0})</TabsTrigger>
              </>
            )}
            
            {isStaff && currentUserRole === 'admin' && (
              <TabsTrigger value="permissions">Права доступа</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info">
            <UserInfoTab user={userWithDetails} isCustomer={isCustomer} />
          </TabsContent>

          {isCustomer && (
            <>
              <TabsContent value="orders">
                <UserOrdersTab orders={userWithDetails.orders || []} />
              </TabsContent>

              <TabsContent value="reviews">
                <UserReviewsTab reviews={userWithDetails.reviews || []} />
              </TabsContent>

              <TabsContent value="addresses">
                <UserAddressesTab addresses={userWithDetails.addresses || []} />
              </TabsContent>
            </>
          )}

          {isStaff && currentUserRole === 'admin' && (
            <TabsContent value="permissions">
              <UserPermissionsTab user={user} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Вкладка с основной информацией (разная для покупателей и сотрудников)
function UserInfoTab({ user, isCustomer }: { user: any; isCustomer: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Имя:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Телефон:</strong> {user.phone || "Не указан"}</div>
          <div><strong>Роль:</strong> {roleLabel(user.role)}</div>
          {user.department && <div><strong>Отдел:</strong> {user.department}</div>}
          {user.position && <div><strong>Должность:</strong> {user.position}</div>}
          <div><strong>Статус:</strong> 
            <Badge variant={user.status === "active" ? "default" : "destructive"} className="ml-2">
              {user.status === "active" ? "Активен" : "Заблокирован"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isCustomer ? "Статистика покупок" : "Служебная информация"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString('ru-RU')}</div>
          <div><strong>Последний вход:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : "Неизвестно"}</div>
          
          {isCustomer ? (
            <>
              <div><strong>Всего заказов:</strong> {user.totalOrders || 0}</div>
              <div><strong>Общая сумма заказов:</strong> {formatPrice(user.totalSpent || 0)}</div>
              <div><strong>Количество отзывов:</strong> {user.totalReviews || 0}</div>
              <div><strong>Средний рейтинг:</strong> {user.averageRating ? user.averageRating.toFixed(1) : "Нет отзывов"}</div>
            </>
          ) : (
            <>
              <div><strong>Права доступа:</strong> {user.permissions?.length || 0}</div>
              <div><strong>Уровень доступа:</strong> {user.role === 'admin' ? 'Полный' : 'Ограниченный'}</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Вкладка с правами доступа (только для админов)
function UserPermissionsTab({ user }: { user: User }) {
  const { updateUser } = useStore();
  const [permissions, setPermissions] = useState<AdminPermission[]>(user.permissions || []);

  const handlePermissionChange = (permission: AdminPermission, checked: boolean) => {
    if (checked) {
      setPermissions(prev => [...prev, permission]);
    } else {
      setPermissions(prev => prev.filter(p => p !== permission));
    }
  };

  const savePermissions = () => {
    updateUser({ ...user, permissions });
  };

  const permissionGroups = {
    'Пользователи': ['users:read', 'users:write', 'users:delete'],
    'Товары': ['products:read', 'products:write', 'products:delete'],
    'Заказы': ['orders:read', 'orders:write', 'orders:delete'],
    'Отзывы': ['reviews:read', 'reviews:write', 'reviews:delete'],
    'Система': ['analytics:read', 'system:config']
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление правами доступа</CardTitle>
        <CardDescription>
          Настройте права доступа для {user.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
          <div key={group} className="space-y-3">
            <h4 className="font-medium">{group}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {groupPermissions.map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={permissions.includes(permission as AdminPermission)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission as AdminPermission, checked as boolean)
                    }
                  />
                  <label htmlFor={permission} className="text-sm">
                    {getPermissionLabel(permission as AdminPermission)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <Button onClick={savePermissions} className="mt-4">
          Сохранить права доступа
        </Button>
      </CardContent>
    </Card>
  );
}

// Таблица заказов с учетом прав
function OrdersTable({ canEdit }: { canEdit: boolean }) {
  const { state, updateOrder } = useStore();
  
  const updateOrderStatus = (orderId: string, status: string) => {
    if (!canEdit) return;
    
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      updateOrder({
        ...order,
        status: status as any,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Номер заказа</TableHead>
          <TableHead>Покупатель</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Сумма</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Оплата</TableHead>
          {canEdit && <TableHead>Действия</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {state.orders.map((order) => {
          const user = state.users.find(u => u.id === order.userId);
          return (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.orderNumber}</TableCell>
              <TableCell>{user?.name}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                {canEdit ? (
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидание</SelectItem>
                      <SelectItem value="processing">В обработке</SelectItem>
                      <SelectItem value="shipped">Отправлен</SelectItem>
                      <SelectItem value="delivered">Доставлен</SelectItem>
                      <SelectItem value="cancelled">Отменен</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={
                    order.status === 'delivered' ? 'default' :
                    order.status === 'cancelled' ? 'destructive' : 'secondary'
                  }>
                    {getOrderStatusText(order.status)}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">{getPaymentMethodText(order.paymentMethod)}</div>
                <div className="text-xs text-muted-foreground">{getPaymentStatusText(order.paymentStatus)}</div>
              </TableCell>
              {canEdit && (
                <TableCell>
                  <Button variant="outline" size="sm" className="hover:bg-gray-200 hover:text-black">
                    Подробнее
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// Таблица отзывов с учетом прав
function ReviewsTable({ canEdit }: { canEdit: boolean }) {
  const { state, updateReview } = useStore();
  
  const toggleReviewVerification = (reviewId: string) => {
    if (!canEdit) return;
    
    const review = state.reviews.find(r => r.id === reviewId);
    if (review) {
      updateReview({
        ...review,
        isVerified: !review.isVerified
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Пользователь</TableHead>
          <TableHead>Товар</TableHead>
          <TableHead>Оценка</TableHead>
          <TableHead>Комментарий</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Статус</TableHead>
          {canEdit && <TableHead>Действия</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {state.reviews.map((review) => {
          const user = state.users.find(u => u.id === review.userId);
          return (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{user?.name}</TableCell>
              <TableCell>{review.productName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{review.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{review.comment}</div>
              </TableCell>
              <TableCell>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</TableCell>
              <TableCell>
                <Badge variant={review.isVerified ? "default" : "outline"}>
                  {review.isVerified ? "Проверен" : "На проверке"}
                </Badge>
              </TableCell>
              {canEdit && (
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-gray-200 hover:text-black"
                    onClick={() => toggleReviewVerification(review.id)}
                  >
                    {review.isVerified ? "Снять проверку" : "Проверить"}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// Вкладка аналитики (только для админов и менеджеров)
function AnalyticsTab() {
  const { getEnhancedUsers, state } = useStore();
  
  const users = getEnhancedUsers();
  const customers = users.filter(u => u.role === 'customer');
  const totalRevenue = customers.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  const averageOrderValue = state.orders.length > 0 ? totalRevenue / state.orders.length : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            {customers.length} покупателей
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            {state.orders.length} заказов
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
          <p className="text-xs text-muted-foreground">
            за все время
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Компонент редактора пользователя с учетом ролей
function UserEditor({
  user,
  onCancel,
  onSave,
  currentUserRole
}: {
  user: User;
  onCancel: () => void;
  onSave: (u: User) => void;
  currentUserRole: UserRole;
}) {
  const [local, setLocal] = useState<User>({ 
    ...user, 
    permissions: user.permissions || ROLE_PERMISSIONS[user.role] 
  });

  // Автоматически устанавливаем права доступа при смене роли
  const handleRoleChange = (role: UserRole) => {
    setLocal({
      ...local,
      role,
      permissions: ROLE_PERMISSIONS[role],
      department: role === 'customer' ? undefined : local.department,
      position: role === 'customer' ? undefined : local.position
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {user.name ? "Редактировать пользователя" : "Новый пользователь"}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Имя
          </Label>
          <Input
            id="name"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={local.email}
            onChange={(e) => setLocal({ ...local, email: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Телефон
          </Label>
          <Input
            id="phone"
            value={local.phone || ""}
            onChange={(e) => setLocal({ ...local, phone: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Роль</Label>
          <div className="col-span-3">
            <Select
              value={local.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Покупатель</SelectItem>
                <SelectItem value="manager">Менеджер</SelectItem>
                {currentUserRole === 'admin' && (
                  <SelectItem value="admin">Администратор</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Дополнительные поля для сотрудников */}
        {(local.role === 'admin' || local.role === 'manager') && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Отдел
              </Label>
              <Input
                id="department"
                value={local.department || ""}
                onChange={(e) => setLocal({ ...local, department: e.target.value })}
                className="col-span-3"
                placeholder="Например, Отдел продаж"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Должность
              </Label>
              <Input
                id="position"
                value={local.position || ""}
                onChange={(e) => setLocal({ ...local, position: e.target.value })}
                className="col-span-3"
                placeholder="Например, Старший менеджер"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Статус</Label>
          <div className="col-span-3">
            <Select
              value={local.status}
              onValueChange={(v) =>
                setLocal({ ...local, status: v as User["status"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="blocked">Заблокирован</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="hover:bg-gray-200 hover:text-black">
          Отмена
        </Button>
        <Button
          onClick={() => onSave(local)}
          disabled={!local.name || !local.email}
        >
          Сохранить
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Вспомогательные функции
function roleLabel(role: UserRole) {
  switch (role) {
    case "admin":
      return "Администратор";
    case "manager":
      return "Менеджер";
    default:
      return "Покупатель";
  }
}

function formatPrice(value: number, currency: string = "RUB") {
  return new Intl.NumberFormat("ru-RU", { 
    style: "currency", 
    currency,
    minimumFractionDigits: 0 
  }).format(value);
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

function getPermissionLabel(permission: AdminPermission): string {
  const labels: Record<AdminPermission, string> = {
    'users:read': 'Просмотр пользователей',
    'users:write': 'Редактирование пользователей',
    'users:delete': 'Удаление пользователей',
    'products:read': 'Просмотр товаров',
    'products:write': 'Редактирование товаров',
    'products:delete': 'Удаление товаров',
    'orders:read': 'Просмотр заказов',
    'orders:write': 'Редактирование заказов',
    'orders:delete': 'Удаление заказов',
    'reviews:read': 'Просмотр отзывов',
    'reviews:write': 'Редактирование отзывов',
    'reviews:delete': 'Удаление отзывов',
    'analytics:read': 'Просмотр аналитики',
    'system:config': 'Настройка системы'
  };
  return labels[permission];
}

// Вкладка с заказами пользователя
function UserOrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Заказы отсутствуют</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Заказ #{order.orderNumber}</CardTitle>
                <CardDescription>
                  {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={
                  order.status === 'delivered' ? 'default' :
                  order.status === 'cancelled' ? 'destructive' : 'secondary'
                }>
                  {getOrderStatusText(order.status)}
                </Badge>
                <div className="text-sm font-semibold mt-1">{formatPrice(order.totalAmount)}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Способ оплаты:</strong> {getPaymentMethodText(order.paymentMethod)}</div>
                <div><strong>Статус оплаты:</strong> {getPaymentStatusText(order.paymentStatus)}</div>
              </div>
              
              <div>
                <strong>Товары:</strong>
                <div className="mt-2 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <strong>Адрес доставки:</strong>
                <div className="mt-1 text-muted-foreground">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Вкладка с отзывами пользователя
function UserReviewsTab({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Отзывы отсутствуют</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
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
      ))}
    </div>
  );
}

// Вкладка с адресами пользователя
function UserAddressesTab({ addresses }: { addresses: Address[] }) {
  if (addresses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Адреса отсутствуют</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {addresses.map((address) => (
        <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="text-sm flex justify-between items-center">
              {address.title}
              {address.isDefault && <Badge variant="secondary">По умолчанию</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><strong>Получатель:</strong> {address.fullName}</div>
            <div><strong>Адрес:</strong> {address.street}</div>
            <div><strong>Город:</strong> {address.city}, {address.postalCode}</div>
            <div><strong>Страна:</strong> {address.country}</div>
            <div><strong>Телефон:</strong> {address.phone}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}