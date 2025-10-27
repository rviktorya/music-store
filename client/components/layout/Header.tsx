import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sun, Moon, ShoppingCart, Heart, User, Search, Settings, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { createUserDraft } from "@shared/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { useAuth } from "@/context/AuthContext";

function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, setDark } as const;
}

// Компонент подсказки
const Tooltip = ({ children, text }: { children: React.ReactElement; text: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      {React.cloneElement(children, {
        onMouseEnter: () => setShow(true),
        onMouseLeave: () => setShow(false),
      })}
      {show && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg z-50 whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

// Компонент модального окна авторизации
function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addUser } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "register") {
      // Проверка паролей
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Ошибка",
          description: "Пароли не совпадают",
          variant: "destructive",
        });
        return;
      }

      // Создание нового пользователя
      const newUser = createUserDraft();
      newUser.name = formData.name;
      newUser.email = formData.email;
      newUser.role = "customer";
      newUser.status = "active";

      addUser(newUser);
      
      toast({
        title: "Успешная регистрация!",
        description: `Пользователь ${formData.name} создан`,
      });

      // Закрытие модального окна и сброс формы
      onClose();
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } else {
      // Логика входа (заглушка)
      toast({
        title: "Вход выполнен",
        description: `Добро пожаловать!`,
      });
      onClose();
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "login" ? "Вход в аккаунт" : "Регистрация"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "login" 
              ? "Введите свои данные для входа в систему." 
              : "Создайте новый аккаунт для совершения покупок."}
          </DialogDescription>
        </DialogHeader>

        {/* Переключение между входом и регистрацией */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "login" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "register" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {activeTab === "login" ? "Пароль" : "Создайте пароль"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>

          {activeTab === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full">
              {activeTab === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </DialogFooter>
        </form>

        {activeTab === "login" && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setActiveTab("register")}
            >
              Нет аккаунта? Зарегистрируйтесь
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { dark, setDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { state } = useStore();
  const { currentUser, logout } = useAuth();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black">
                M
              </div>
              <span className="font-extrabold tracking-tight text-xl">
                MuseMart
              </span>
            </Link>
            
            {/* Основная навигация - показывается только в магазине */}
            {!isAdminPage && (
              <nav className="hidden md:flex items-center gap-1">
                <NavLink to="/" active={pathname === "/"}>
                  Главная
                </NavLink>
                <NavLink to="/catalog" active={pathname === "/catalog"}>
                  Каталог
                </NavLink>
              
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Поиск - показывается только в магазине */}
            {!isAdminPage && (
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск инструментов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Кнопки действий пользователя - показываются только в магазине */}
            {!isAdminPage && (
              <>
                
                <Tooltip text="Корзина">
                  <Link
                    to="/cart"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted relative"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {/* Динамический счетчик корзины */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {state.cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </Link>
                </Tooltip>

                
              </>
            )}

            {/* Кнопка входа/профиля */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Tooltip text="Личный кабинет">
                  <Link
                    to="/profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                  </Link>
                </Tooltip>
                
                {/* Кнопка выхода в виде иконки */}
                <Tooltip text="Выйти">
                  <button
                    onClick={logout}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <Tooltip text="Войти в аккаунт">
                <Link
                  to="/auth"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                >
                  <LogIn className="h-4 w-4" />
                </Link>
              </Tooltip>
            )}

            {/* Кнопка перехода в админку/магазин */}
            {isAdminPage ? (
              <Link
                to="/"
                className="hidden sm:flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>В магазин</span>
              </Link>
            ) : (
              currentUser?.role === 'admin' && (
                <Link
                  to="/admin/users"
                  className="hidden sm:flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  <span>Администрирование</span>
                </Link>
              )
            )}

            {/* Переключение темы */}
            <Tooltip text={dark ? "Светлая тема" : "Темная тема"}>
              <button
                aria-label="Переключить тему"
                onClick={() => setDark(!dark)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Мобильная навигация */}
        {!isAdminPage && (
          <div className="container md:hidden border-t">
            <nav className="flex items-center justify-around py-2">
              <MobileNavLink to="/" active={pathname === "/"}>
                Главная
              </MobileNavLink>
              <MobileNavLink to="/catalog" active={pathname === "/catalog"}>
                Каталог
              </MobileNavLink>
              <MobileNavLink to="/about" active={pathname === "/about"}>
                О нас
              </MobileNavLink>
              <MobileNavLink to="/contacts" active={pathname === "/contacts"}>
                Контакты
              </MobileNavLink>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors",
        active && "text-foreground bg-muted",
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex-1 text-center py-2 text-xs font-medium text-foreground/80 hover:text-foreground transition-colors",
        active && "text-foreground bg-muted rounded",
      )}
    >
      {children}
    </Link>
  );
}