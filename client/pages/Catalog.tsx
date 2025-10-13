import { products, categories } from "@shared/data";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <main className="container py-8">
      {/* Заголовок и фильтры */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
        
        {/* Фильтр по категориям */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedCategory === "all" 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background hover:bg-muted"
            }`}
          >
            Все товары
          </button>
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedCategory === category.key 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background hover:bg-muted"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Счетчик товаров */}
        <p className="text-muted-foreground">
          Показано {filteredProducts.length} из {products.length} товаров
        </p>
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Сообщение если нет товаров */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Товары в этой категории пока отсутствуют</p>
        </div>
      )}
    </main>
  );
}