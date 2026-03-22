import { useState, useEffect } from "react";
import { Moon, Sun, GraduationCap, UserCircle, ShieldCheck, Rocket, CreditCard, Upload, LogIn } from "lucide-react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme-dark");
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme-dark", String(isDark));
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((p) => !p) };
}

export default function LoginPage() {
  const { isDark, toggle } = useDarkMode();
  const [tab, setTab] = useState<"login" | "activate">("login");
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploaded(true);
      }, 1500);
    }
  };

  return (
    <div
      style={{ direction: "rtl", fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}
      className={isDark ? "dark" : ""}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background-color: var(--bg);
          transition: background-color 0.3s ease, color 0.3s ease;
          position: relative;
        }

        /* ─── Light ─── */
        :root {
          --bg: #f0f7ff;
          --surface: #ffffff;
          --surface-border: rgba(14, 165, 233, 0.18);
          --surface-shadow: 0 20px 60px -8px rgba(14, 165, 233, 0.12), 0 4px 16px -4px rgba(0,0,0,0.06);
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --accent: #0ea5e9;
          --accent-hover: #0284c7;
          --accent-light: rgba(14, 165, 233, 0.08);
          --accent-light-hover: rgba(14, 165, 233, 0.14);
          --tab-bg: #f1f5f9;
          --tab-active-bg: #0ea5e9;
          --tab-active-text: #ffffff;
          --input-bg: #f8fafc;
          --input-border: #e2e8f0;
          --input-border-focus: #0ea5e9;
          --divider: rgba(14, 165, 233, 0.15);
          --rip-bg: #f1f5f9;
          --rip-border: #e2e8f0;
          --toggle-bg: #e0f2fe;
          --toggle-icon: #0ea5e9;
          --badge-bg: linear-gradient(135deg, #0ea5e9, #38bdf8);
          --badge-text: #ffffff;
          --upload-border: rgba(14, 165, 233, 0.3);
          --upload-bg: rgba(14, 165, 233, 0.04);
        }

        /* ─── Dark ─── */
        .dark {
          --bg: #0b1929;
          --surface: #112240;
          --surface-border: rgba(56, 189, 248, 0.15);
          --surface-shadow: 0 20px 60px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.08);
          --text-primary: #f0f9ff;
          --text-secondary: #94a3b8;
          --text-muted: #475569;
          --accent: #38bdf8;
          --accent-hover: #7dd3fc;
          --accent-light: rgba(56, 189, 248, 0.08);
          --accent-light-hover: rgba(56, 189, 248, 0.14);
          --tab-bg: #0d1f38;
          --tab-active-bg: #38bdf8;
          --tab-active-text: #0b1929;
          --input-bg: #0d1f38;
          --input-border: rgba(56, 189, 248, 0.12);
          --input-border-focus: #38bdf8;
          --divider: rgba(56, 189, 248, 0.12);
          --rip-bg: #0d1f38;
          --rip-border: rgba(56, 189, 248, 0.12);
          --toggle-bg: rgba(56, 189, 248, 0.1);
          --toggle-icon: #38bdf8;
          --badge-bg: linear-gradient(135deg, #0ea5e9, #38bdf8);
          --badge-text: #0b1929;
          --upload-border: rgba(56, 189, 248, 0.25);
          --upload-bg: rgba(56, 189, 248, 0.04);
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: var(--surface);
          border: 1px solid var(--surface-border);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: var(--surface-shadow);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .logo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 0 0 8px var(--accent-light);
        }

        .app-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 0.25rem;
          line-height: 1.3;
          transition: color 0.3s ease;
        }

        .app-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 1.5rem;
          transition: color 0.3s ease;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: var(--badge-bg);
          color: var(--badge-text);
          font-size: 0.9rem;
          font-weight: 800;
          padding: 0.4rem 1.25rem;
          border-radius: 100px;
          margin: 0 auto 1.5rem;
          width: fit-content;
        }

        .divider {
          height: 1px;
          background: var(--divider);
          margin-bottom: 1.5rem;
          border-radius: 1px;
        }

        .tab-bar {
          display: flex;
          gap: 0.375rem;
          background: var(--tab-bg);
          padding: 0.3rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
          transition: background 0.3s ease;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          border: none;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          background: transparent;
          color: var(--text-secondary);
        }

        .tab-btn.active {
          background: var(--tab-active-bg);
          color: var(--tab-active-text);
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
        }

        .tab-btn:not(.active):hover {
          color: var(--text-primary);
          background: var(--accent-light);
        }

        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 0.9rem 1.5rem;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          color: white;
          border: none;
          border-radius: 14px;
          font-family: inherit;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
        }

        .dark .login-btn { color: #0b1929; }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.45);
        }

        .login-btn:active { transform: translateY(0); }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.75rem;
        }

        .rip-box {
          background: var(--rip-bg);
          border: 1px solid var(--rip-border);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          text-align: center;
          font-family: monospace;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 1rem;
          user-select: all;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .upload-zone {
          border: 2px dashed var(--upload-border);
          background: var(--upload-bg);
          border-radius: 14px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .upload-zone:hover {
          border-color: var(--accent);
          background: var(--accent-light-hover);
        }

        .upload-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .upload-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          color: var(--accent);
        }

        .upload-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .upload-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .upload-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #22c55e;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid var(--accent-light);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 0.5rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-text {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 1.5rem;
          transition: color 0.3s ease;
        }

        /* Dark mode toggle */
        .toggle-btn {
          position: fixed;
          bottom: 1.5rem;
          left: 1.5rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--toggle-bg);
          border: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--toggle-icon);
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          z-index: 50;
        }

        .toggle-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 18px rgba(14, 165, 233, 0.25);
        }

        .tab-content {
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          {/* Logo */}
          <div className="logo-wrap">
            <GraduationCap size={36} color="white" />
          </div>

          {/* Title */}
          <h1 className="app-title">الأستاذ المصحح (الشيخ ذكي)</h1>
          <p className="app-sub">مختبر تصحيح تمارين البكالوريا بالمنهجية الجزائرية</p>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="badge">اشتراك التفعيل: 1000 دج</div>
          </div>

          <div className="divider" />

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              <UserCircle size={16} />
              دخول الطالب
            </button>
            <button
              className={`tab-btn ${tab === "activate" ? "active" : ""}`}
              onClick={() => setTab("activate")}
            >
              <ShieldCheck size={16} />
              تفعيل الحساب
            </button>
          </div>

          {/* Tab Content */}
          {tab === "login" && (
            <div className="tab-content">
              <button className="login-btn">
                <Rocket size={18} />
                الدخول إلى مختبر التصحيح
              </button>
            </div>
          )}

          {tab === "activate" && (
            <div className="tab-content">
              <div className="section-title">
                <CreditCard size={16} />
                أرسل مبلغ 1000 دج عبر بريدي موب
              </div>

              <div className="rip-box">RIP: 00799999002789880450</div>

              <label className="upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <div className="spinner" />
                    <p className="upload-text">جاري التحقق من الوصل...</p>
                  </>
                ) : uploaded ? (
                  <div className="upload-success">
                    <ShieldCheck size={18} />
                    تم استقبال الوصل بنجاح
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <Upload size={20} />
                    </div>
                    <p className="upload-text">ارفع صورة الوصل هنا</p>
                    <p className="upload-hint">التفعيل فوري · JPG, PNG</p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Footer */}
          <p className="footer-text">
            حقوق الطبع والنشر محفوظة © منصة حل عقدة الباك 2026
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button className="toggle-btn" onClick={toggle} title={isDark ? "الوضع النهاري" : "الوضع الليلي"}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
}
