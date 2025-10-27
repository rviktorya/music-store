import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/api";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/components/ui/use-toast";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Передаем весь объект продукта для добавления в корзину
    addToCart(product);
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} успешно добавлен в корзину`,
    });
  };

  return (
    <Card className="overflow-hidden group flex flex-col h-full">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex-grow mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="font-bold text-sm">
                {formatPrice(product.price, product.currency)}
              </div>
              <div className="text-xs text-muted-foreground">
                ★ {product.rating.toFixed(1)} ({product.reviews})
              </div>
            </div>
          </div>
        </div>
        <Button 
          className="w-full mt-auto" 
          size="sm"
          onClick={handleAddToCart}
          disabled={product.inStock === 0}
        >
          {product.inStock === 0 ? "Нет в наличии" : "В корзину"}
        </Button>
      </CardContent>
    </Card>
  );
}

function formatPrice(value: number, currency: Product["currency"]) {
  return new Intl.NumberFormat("ru-RU", { 
    style: "currency", 
    currency,
    minimumFractionDigits: 0 
  }).format(value);
}