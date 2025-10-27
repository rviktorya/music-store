import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminUsers from "@/pages/AdminUsers";
<<<<<<< HEAD
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";

const queryClient = new QueryClient();

// Компонент для защищенных маршрутов
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/auth" />;
}

// Компонент для админских маршрутов
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return currentUser?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

// Основной компонент приложения с провайдерами
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/users" element={ <ProtectedRoute><AdminRoute><AdminUsers /></AdminRoute></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

=======
import { StoreProvider } from "@/context/StoreContext";

const queryClient = new QueryClient();

>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StoreProvider>
<<<<<<< HEAD
          <AuthProvider>
            <AppContent />
          </AuthProvider>
=======
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog  />} />
                <Route path="/admin/users" element={<AdminUsers />} /><Route path="/cart" element={<Cart />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const existingRoot = (globalThis as any).__app_root as
  | ReturnType<typeof createRoot>
  | undefined;
const root = existingRoot ?? createRoot(container);
(globalThis as any).__app_root = root;
<<<<<<< HEAD
root.render(<App />);
=======
root.render(<App />);
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
