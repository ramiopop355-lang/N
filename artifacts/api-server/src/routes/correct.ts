import { Router, type IRouter } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router: IRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("يجب رفع ملف صورة فقط"));
  },
});

const SYSTEM_PROMPT = `أنت أستاذ رياضيات متخصص في تصحيح بكالوريا الجزائر. ردودك **قصيرة ومركزة** — لا مقدمات، لا تكرار، لا حشو.

إذا كان التمرين لا علاقة له بالرياضيات، أخبر الطالب بجملة واحدة.

---

**قراءة الصور:**
اقرأ صورة التمرين وصورة محاولة الطالب بعناية مهما كانت الجودة. إذا كان جزء غير واضح، افترض السياق المنطقي.

---

**قواعد التصحيح:**
- استخدم LaTeX لكل عبارة رياضية: $f(x)$، $\\lim_{x \\to +\\infty}$، $\\sum_{k=1}^{n} u_k$.
- اتبع المنهجية الجزائرية (جداول الإشارة والتغيرات، T.A.F، البرهان بالتراجع).
- عدّل المستوى حسب شعبة الطالب (رياضيات / علوم / تسيير / آداب).
- لا تعدّ الخطوات الناقصة خطأ إذا كان يمكن استنتاجها.
- ميّز بين: **نقص في الشرح** (ملاحظة فقط) و **خطأ حقيقي** (يؤثر على النتيجة).
- الحكم النهائي: ✅ صحيح / ⚠️ صحيح مع نقص / ❌ خطأ + تصحيح مختصر.

---

**هيكل الرد (موجز فقط):**

**🔍 تحليل الحل:**
لكل سؤال: ما أصاب فيه ← الخطأ أو النقص (جملة واحدة) ← التصحيح المباشر.

**✅ الحل الصحيح:**
الخطوات الضرورية فقط — بدون شرح زائد.

**💡 ملاحظة واحدة** (فقط إذا كانت مهمة للامتحان).

---

*تمت المعالجة وفق معايير سِيغْمَا Σ — بياناتك مشفرة ومحمية.*`;

router.post(
  "/correct",
  upload.fields([
    { name: "exercise", maxCount: 1 },
    { name: "attempt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const apiKey = process.env["GEMINI_API_KEY"];
      if (!apiKey) {
        res.status(500).json({ error: "مفتاح Gemini API غير مضبوط" });
        return;
      }

      const shoba = (req.body.shoba as string) || "رياضيات";
      const notes = (req.body.notes as string) || "";
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const exerciseFile = files?.["exercise"]?.[0];
      const attemptFile = files?.["attempt"]?.[0];

      if (!exerciseFile) {
        res.status(400).json({ error: "يجب رفع صورة التمرين" });
        return;
      }
      if (!attemptFile) {
        res.status(400).json({ error: "يجب رفع صورة محاولتك" });
        return;
      }

      const exerciseBase64 = exerciseFile.buffer.toString("base64");
      const exerciseMime = exerciseFile.mimetype || "image/jpeg";
      const attemptBase64 = attemptFile.buffer.toString("base64");
      const attemptMime = attemptFile.mimetype || "image/jpeg";

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const userMessage = `الشعبة: **${shoba}**
${notes ? `ملاحظة الطالب: ${notes}` : ""}

الصورة الأولى: نص التمرين.
الصورة الثانية: محاولة الطالب في حل التمرين.

قيّم محاولة الطالب وفق الهيكل البيداغوجي الإلزامي ومنهاج البكالوريا الجزائرية 2026.`;

      const genai = new GoogleGenerativeAI(apiKey);
      const model = genai.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          // @ts-ignore — thinkingConfig is valid but not yet in type defs
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      const result = await model.generateContentStream([
        {
          inlineData: {
            data: exerciseBase64,
            mimeType: exerciseMime,
          },
        },
        {
          inlineData: {
            data: attemptBase64,
            mimeType: attemptMime,
          },
        },
        userMessage,
      ]);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطأ في الخادم";
      console.error("Correct error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: message });
      } else {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      }
    }
  }
);

export default router;
