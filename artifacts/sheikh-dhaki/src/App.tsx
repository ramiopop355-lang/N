import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import { WifiOff, RefreshCw } from "lucide-react";

const NotFound = lazy(() => import("@/pages/not-found"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!isLoggedIn) setLocation("/login"); }, [isLoggedIn, setLocation]);
  if (!isLoggedIn) return null;
  return <Component />;
}

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// ── طبقة "لا يوجد اتصال" — تظهر فوق التطبيق ولا تُلغي تحميله ────────
function OfflineBanner({ onRetry }: { onRetry: () => void }) {
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    setChecking(true);
    try {
      // نختبر الاتصال بطلب خفيف
      await fetch("/api/healthz", { method: "GET", cache: "no-store" })
        .catch(() => {
          throw new Error("offline");
        });
      onRetry();
    } catch {
      // لا يزال بلا إنترنت
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "rgba(15,15,26,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
          border: "2px solid rgba(239,68,68,0.25)",
        }}
      >
        <WifiOff className="w-10 h-10 text-red-400" />
      </div>

      <h1 className="text-2xl font-black text-white mb-2">لا يوجد اتصال بالإنترنت</h1>
      <p className="text-sm text-white/50 max-w-xs mb-8 leading-relaxed">
        تعذّر الاتصال بالشبكة. تحقق من اتصالك ثم حاول مجدداً — سيعود التطبيق تلقائياً عند استعادة الاتصال.
      </p>

      <button
        onClick={handleRetry}
        disabled={checking}
        className="flex items-center gap-2 font-bold text-sm rounded-xl px-6 py-3 transition-all duration-200 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}
      >
        <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
        {checking ? "جارٍ التحقق..." : "إعادة المحاولة"}
      </button>
    </div>
  );
}

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("sigma_splash_done")
  );
  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem("sigma_splash_done", "1");
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>

      {/* طبقة Offline — تُعرض فوق التطبيق دون إلغاء تحميله */}
      {!isOnline && (
        <OfflineBanner onRetry={() => setIsOnline(true)} />
      )}

      {showSplash && <SplashScreen onDone={handleSplashDone} />}
    </QueryClientProvider>
  );
}

export default App;
