import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@shared/api";
import { useStore } from "./StoreContext";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { state, addUser, updateUser } = useStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Проверяем, существует ли пользователь в системе
        const existingUser = state.users.find(u => u.id === user.id);
        if (existingUser) {
          setCurrentUser(existingUser);
        } else {
          // Если пользователя нет в системе, но есть в localStorage - добавляем его
          addUser(user);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, [state.users, addUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Ищем пользователя по email и паролю
      const user = state.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password // В реальном приложении должно быть хеширование
      );

      if (user) {
        // Обновляем последний вход
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString()
        };
        updateUser(updatedUser);
        
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Проверяем, нет ли пользователя с таким email
      const existingUser = state.users.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        setIsLoading(false);
        return false;
      }

      // Создаем нового пользователя
      const newUser: User = {
        id: generateUUID(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // В реальном приложении должно быть хеширование
        role: 'customer',
        createdAt: new Date().toISOString(),
        status: 'active',
        phone: userData.phone,
        permissions: ['orders:read', 'reviews:read'], // Базовые права для покупателей
        lastLogin: new Date().toISOString() // Сразу устанавливаем вход
      };

      // Добавляем пользователя в систему
      addUser(newUser);
      
      // Устанавливаем как текущего пользователя
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Вспомогательная функция для генерации UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}