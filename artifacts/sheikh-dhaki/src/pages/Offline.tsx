import { WifiOff, RefreshCw } from "lucide-react";

export default function Offline() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center mb-6">
        <WifiOff className="w-12 h-12 text-destructive/70" />
      </div>

      <h1 className="text-2xl font-black text-foreground mb-2">لا يوجد اتصال بالإنترنت</h1>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        تعذّر الاتصال بالشبكة. تحقق من اتصالك بالإنترنت ثم حاول مجدداً.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <RefreshCw className="w-4 h-4" />
        إعادة المحاولة
      </button>
    </div>
  );
}
