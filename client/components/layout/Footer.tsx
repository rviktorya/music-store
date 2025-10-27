export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground font-black flex items-center justify-center">
            M
          </div>
          <span className="font-semibold">MuseMart</span>
          <span className="opacity-60">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">
            Политика конфиденциальности
          </a>
          <a href="#" className="hover:text-foreground">
            Условия использования
          </a>
        </div>
      </div>
    </footer>
  );
}
