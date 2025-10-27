import { categories, popularProducts } from "@shared/data";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
        />
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                Интернет-магазин музыкальных инструментов
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Найдите свой звук с MuseMart
              </h1>
              <p className="text-muted-foreground text-lg">
                Гитары, клавиши, ударные, студийное оборудование и всё, что
                нужно музыканту. Доставка по всей России.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-primary-foreground shadow hover:opacity-90"
                >
                  Перейти в каталог
                </Link>
              </div>
            </div>
            <div className="relative flex flex-col justify-start items-start self-center w-full">
              <div className="relative w-full">
                <img
                  src="/images/hero-music.avif"
                  alt="Музыкальные инструменты"
                  className="block rounded-xl shadow-lg w-full"
                />
                <div className="absolute bottom-4 left-4 rounded-xl bg-background/80 p-4 shadow backdrop-blur">
                  <div className="text-xs text-muted-foreground">
                    Рейтинг магазина
                  </div>
                  <div className="text-2xl font-bold">4.9★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10" id="catalog">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Категории</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              to="/catalog"
              className="group relative overflow-hidden rounded-xl border p-5 hover:bg-muted/50 block"
            >
              <div className="font-semibold">{c.title}</div>
              <div className="text-xs text-muted-foreground">
                Откройте лучшие {c.title.toLowerCase()}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-2xl transition duration-300 group-hover:scale-125"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Популярное</h2>
          <Link to="/catalog" className="text-sm text-primary hover:underline">
            Смотреть всё
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}