import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, AlertTriangle, Lightbulb, BookOpen } from "lucide-react";

function useDarkModeToggle() {
  const getInitial = () => {
    const stored = localStorage.getItem("dhaki-dark");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const [isDark] = useState(() => {
    const d = getInitial();
    document.documentElement.classList.toggle("dark", d);
    return d;
  });
  return isDark;
}

interface Mistake {
  mistake: string;
  fix: string;
}

interface Topic {
  id: string;
  icon: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  mistakes: Mistake[];
}

const TOPICS: Topic[] = [
  {
    id: "limits",
    icon: "📉",
    title: "الدوال والحدود",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-300 dark:border-blue-700",
    mistakes: [
      {
        mistake: "نسيان التحقق من مجال الدالة قبل حساب النهاية",
        fix: "دائماً حدد مجال الدالة (D_f) قبل أي حساب — خاصة عند وجود جذر أو كسر"
      },
      {
        mistake: 'الخلط بين الشكل "∞/∞" و"0/0" — معالجتهما مختلفة',
        fix: 'في ∞/∞: اقسم على القوة الأكبر. في 0/0: بسّط أو استخدم قاعدة لوبيتال إن سُمح'
      },
      {
        mistake: "نسيان الحالة المهمة: لim(sin x / x) = 1 عند x→0",
        fix: "هذه القاعدة الذهبية لا تُنسى في كل تمارين الحدود المثلثية"
      },
      {
        mistake: "الخطأ في إشارة النهاية عند ±∞ مع الجذور",
        fix: "√(x²) = |x|، وعند x→-∞ يكون √(x²) = -x (انتبه للإشارة!)"
      },
    ]
  },
  {
    id: "derivatives",
    icon: "📐",
    title: "الاشتقاق والدراسة",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-300 dark:border-violet-700",
    mistakes: [
      {
        mistake: "الخطأ في قاعدة المنتج: (uv)' = u'v + uv' — نسيان أحد الحدين",
        fix: "اكتب الصيغة قبل التطبيق: الأول × مشتق الثاني + مشتق الأول × الثاني"
      },
      {
        mistake: "الخطأ في اشتقاق التركيب: [f(g(x))]' = f'(g(x)) × g'(x)",
        fix: "نسيان ضرب مشتق الدالة الداخلية هو أشيع خطأ في الاشتقاق — لا تنساه"
      },
      {
        mistake: "نقط الانعطاف: التصريح بها بدون التحقق أن f'' تغيّر إشارتها",
        fix: "f''(x₀)=0 شرط ضروري وليس كافياً — تحقق من تغيّر الإشارة حول x₀"
      },
      {
        mistake: "نسيان دراسة حدود الدالة عند أطراف مجالها في جدول التغيرات",
        fix: "جدول التغيرات يبدأ وينتهي بقيم النهايات (أو القيم في نقاط الحافة)"
      },
      {
        mistake: "الخلط بين المنظور المماسي (tangent) وكتابة معادلته بشكل خاطئ",
        fix: "معادلة المماس عند النقطة (a, f(a)): y = f'(a)(x-a) + f(a)"
      },
    ]
  },
  {
    id: "expo",
    icon: "⚡",
    title: "الدوال الأسية واللوغاريتمية",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-300 dark:border-orange-700",
    mistakes: [
      {
        mistake: "نسيان أن ln(x) معرّفة فقط لـ x > 0",
        fix: "قبل استخدام ln دائماً اشترط أن ما بداخله أكبر من صفر — هذا شرط الوجود"
      },
      {
        mistake: "خطأ: ln(a+b) ≠ ln(a) + ln(b)  —  الصحيح: ln(a×b) = ln(a) + ln(b)",
        fix: "خاصيات اللوغاريتم: جمع↔ضرب، طرح↔قسمة، تكرار↔أس: ln(aⁿ) = n·ln(a)"
      },
      {
        mistake: "نسيان أن الدالة الأسية eˣ دائماً موجبة تماماً (> 0 للأبد)",
        fix: "eˣ > 0 لكل x∈ℝ — يُستخدم كثيراً لإثبات إشارة الدالة أو تبسيطها"
      },
      {
        mistake: "الخطأ في حل المعادلات: تطبيق ln على طرف واحد فقط",
        fix: "دائماً طبّق ln على الطرفين معاً: إذا eˣ = 5  فإن  x = ln(5)"
      },
    ]
  },
  {
    id: "integral",
    icon: "∫",
    title: "التكامل وحساب المساحات",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-300 dark:border-green-700",
    mistakes: [
      {
        mistake: "نسيان إضافة ثابت التكامل C في التكامل غير المحدود",
        fix: "∫f(x)dx = F(x) + C — الثابت C إجباري، نسيانه يُفقدك نقطة كاملة"
      },
      {
        mistake: "حساب المساحة بدون القيمة المطلقة عندما تكون الدالة تحت المحور",
        fix: "المساحة = |∫f(x)dx|، إذا الدالة تحت المحور (f<0) الناتج سالب — خذ قيمته المطلقة"
      },
      {
        mistake: "الخطأ في التكامل بالتجزئة: ∫u dv = uv - ∫v du  — نسيان طرح الجزء الثاني",
        fix: "اختر u أبسط لاشتقاقه، واختر dv أبسط لتكامله، ثم طبّق الصيغة بدقة"
      },
      {
        mistake: "حساب المساحة بين منحنيين بدون التحقق أيهما أعلى في كل فترة",
        fix: "المساحة = ∫|f(x)-g(x)|dx — تحقق من إشارة f-g في كل فترة بين النقاط التقاطع"
      },
      {
        mistake: "خطأ في تكامل الدالة المركبة: نسيان القسمة على مشتق الدالة الداخلية",
        fix: "مثال: ∫e^(2x)dx = e^(2x)/2 + C (تقسم على 2 مشتق 2x)"
      },
    ]
  },
  {
    id: "sequences",
    icon: "🔢",
    title: "المتتاليات والتراتب",
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-300 dark:border-indigo-700",
    mistakes: [
      {
        mistake: "الخلط بين صيغة مجموع المتتالية الحسابية والهندسية",
        fix: "حسابية: Sₙ = n(u₁+uₙ)/2  |  هندسية: Sₙ = u₁(1-qⁿ)/(1-q) إذا q≠1"
      },
      {
        mistake: "نسيان التحقق من الشروط: r=q-p في الحسابية، q≠0 و q≠1 في الهندسية",
        fix: "لا تطبّق الصيغ قبل التحقق من نوع المتتالية وشروطها"
      },
      {
        mistake: "خطأ في برهان التراتب: خلط uₙ₊₁ - uₙ مع uₙ₊₁ / uₙ",
        fix: "للحسابية أو أحادية الاتجاه: استخدم الطرح. للهندسية (q>0): استخدم القسمة أو الطرح"
      },
      {
        mistake: "في البرهان بالتراتب: نسيان التحقق من الأساس (n=0 أو n=1) أو خطوة الوراثة",
        fix: "البرهان بالتراتب ثلاث خطوات إلزامية: التحقق → افتراض → استنتاج"
      },
    ]
  },
  {
    id: "complex",
    icon: "🔵",
    title: "الأعداد المركبة",
    color: "text-cyan-700 dark:text-cyan-400",
    bg: "bg-cyan-50/80 dark:bg-cyan-950/30",
    border: "border-cyan-300 dark:border-cyan-700",
    mistakes: [
      {
        mistake: "الخطأ في الضرب: (a+bi)(c+di) — نسيان أن i² = -1",
        fix: "طوّر كاملاً: ac + adi + bci + bdi² = (ac-bd) + (ad+bc)i"
      },
      {
        mistake: "الخلط في حساب المعامل (module): |z|² = a²+b² وليس a²-b²",
        fix: "|a+bi| = √(a²+b²)  ،  |z|² = z × z̄ حيث z̄ = a-bi"
      },
      {
        mistake: "خطأ في إيجاد الحجة (argument): نسيان ربع الدائرة الصحيح",
        fix: "انظر إشارتي a و b: إذا a>0 وb>0 → الربع الأول, إذا a<0 → اطرح π أو أضف π"
      },
      {
        mistake: "الخلط بين الشكل المثلثي والأسي: r(cosθ+i sinθ) = re^(iθ)",
        fix: "صيغة أويلر: e^(iθ) = cosθ + i sinθ — تُستخدم لتبسيط الأسس والجذور"
      },
    ]
  },
  {
    id: "proba",
    icon: "🎲",
    title: "الإحصاء والاحتمالات",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-300 dark:border-amber-700",
    mistakes: [
      {
        mistake: "الخلط بين P(A∪B) وP(A)+P(B) — نسيان طرح P(A∩B)",
        fix: "P(A∪B) = P(A) + P(B) - P(A∩B)  ←  طرح التقاطع إجباري إن لم يكن متنافيَين"
      },
      {
        mistake: "الخلط بين الأحداث المتنافية والأحداث المستقلة",
        fix: "متنافيان: P(A∩B)=0  |  مستقلان: P(A∩B)=P(A)×P(B) — مفهومان مختلفان تماماً"
      },
      {
        mistake: "خطأ في الاحتمال الشرطي P(A|B): قسمة على P(B) وليس على 1",
        fix: "P(A|B) = P(A∩B) / P(B)  ←  لا تنسَ أن المقام P(B) وليس 1"
      },
      {
        mistake: "الخلط بين الترتيب (Arrangements) والتوليف (Combinations)",
        fix: "الترتيب: Aⁿₖ = n!/(n-k)!  |  التوليف: Cⁿₖ = n!/[k!(n-k)!]  —  الترتيب أكبر دائماً"
      },
      {
        mistake: "نسيان قاعدة المتمم في الاحتمال: P(Ā) = 1 - P(A)",
        fix: "عندما يصعب حساب الحدث مباشرة — احسب متممه وأطرحه من 1 (أسهل كثيراً)"
      },
    ]
  },
  {
    id: "geometry",
    icon: "📐",
    title: "الهندسة التحليلية والفضاء",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-300 dark:border-rose-700",
    mistakes: [
      {
        mistake: "نسيان التحقق من التوازي أو التعامد قبل تطبيق النظريات",
        fix: "الناقل الموجه والمستقيم يكونان متوازيين إذا كان الناقل مضاعفاً للناقل الآخر"
      },
      {
        mistake: "خطأ في معادلة المستوى: نسيان أن ax+by+cz+d=0 وليس ax+by+cz=0",
        fix: "المتجه العمودي (n) = (a,b,c)، والثابت d يُحسب بتعويض نقطة من المستوى"
      },
      {
        mistake: "المسافة من نقطة إلى مستوى: استخدام الصيغة الخاطئة",
        fix: "d(M,P) = |ax₀+by₀+cz₀+d| / √(a²+b²+c²) — لا تنسَ القيمة المطلقة والجذر"
      },
    ]
  },
];

function TopicCard({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${topic.border} ${topic.bg}`}
      style={{ boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-right"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{topic.icon}</span>
          <div>
            <p className={`text-sm font-black ${topic.color}`}>{topic.title}</p>
            <p className="text-xs text-muted-foreground">{topic.mistakes.length} أخطاء شائعة</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className={`w-4 h-4 ${topic.color}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 flex flex-col gap-3 border-t border-black/8 dark:border-white/8 pt-3">
              {topic.mistakes.map((m, i) => (
                <div key={i} className="bg-white/70 dark:bg-black/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
                    <p className="text-sm font-semibold text-foreground leading-relaxed">{m.mistake}</p>
                  </div>
                  <div className="flex items-start gap-2 mr-1">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CommonMistakes() {
  useDarkModeToggle();
  const [, setLocation] = useLocation();
  const totalMistakes = TOPICS.reduce((s, t) => s + t.mistakes.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 border-b border-border/60"
        style={{
          background: "linear-gradient(135deg, hsl(var(--card)) 60%, rgba(99,102,241,0.06))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 1px 0 hsl(var(--border)/0.5), 0 4px 12px -4px rgba(99,102,241,0.10)",
        }}
      >
        <button
          onClick={() => setLocation("/")}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 3px 10px rgba(99,102,241,0.4)" }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              أكثر الأخطاء شيوعاً في الباك
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">{totalMistakes} خطأ موثّق · {TOPICS.length} وحدات</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div
        className="mx-4 mt-4 rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
          border: "1.5px solid rgba(99,102,241,0.20)",
          boxShadow: "0 4px 20px -6px rgba(99,102,241,0.18)",
        }}
      >
        <div className="text-3xl leading-none">🎯</div>
        <div>
          <p className="text-sm font-black text-foreground">تعلّم من أخطاء غيرك</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            هذه الأخطاء جُمعت من آلاف تصحيحات الباك — فهمها يرفع علامتك مباشرةً
          </p>
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-col gap-3 p-4 pb-8">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TopicCard topic={topic} />
          </motion.div>
        ))}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-2 px-4 leading-relaxed">
          💡 ارفع تمرينك لسِيغْمَا وهو يشوف أخطاءك تحديداً — أدق من القائمة العامة
        </p>
      </div>
    </div>
  );
}
