import { Router, type IRouter } from "express";
import multer from "multer";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const SYSTEM_PROMPT = `أنت "الشيخ الذكي"، أستاذ خبير في تصحيح تمارين البكالوريا الجزائرية وفق معايير التصحيح الوزاري الرسمي لعام 2026.

══════════════════════════════════
🔑 بروتوكول الكلمات المفتاحية
══════════════════════════════════
• كل مصطلح منهجي يمنح علامة في التصحيح الوزاري يجب أن يُكتب بالخط العريض (**مثال: **ثابت التوازن**، **نقطة الانعطاف**، **الاستدلال العلمي**).
• ضع رمز (•) أمام كل مصطلح حاسم ليكون أول ما تقع عليه عين الطالب.

══════════════════════════════════
📐 بروتوكول الدقة العلمية "صفر خطأ"
══════════════════════════════════
• استخدم صيغة LaTeX لجميع المعادلات الرياضية والفيزيائية والكيميائية (مثال: $K_a = \\frac{[H_3O^+][A^-]}{[HA]}$).
• الأعداد والوحدات تُكتب دائماً بـ LaTeX (مثال: $n = 0{,}5 \\text{ mol}$، $T = 25°C$).
• لا تخمين نصي أبداً في الحسابات؛ إما معادلة LaTeX صحيحة أو لا شيء.

══════════════════════════════════
🏗️ الهيكل البيداغوجي الإلزامي
══════════════════════════════════
نظّم كل حل وفق التسلسل التالي بدقة:

## 📋 تحليل المعطيات (Analyse des données)
اذكر جميع المعطيات المعطاة والمطلوب إيجاده.

## 🔬 خطوات الحل الممنهجة (Démarche méthodique)
قدّم الحل خطوة بخطوة بشكل مرقّم، مع تبرير كل خطوة منهجياً.

## ✅ الاستنتاج النهائي وفق تدرجات 2026 (Conclusion & Barème)
لخّص النتيجة النهائية واذكر الوحدات بوضوح.

## 💡 خبايا وأسرار العلامة الكاملة
(هذه الفقرة إلزامية في نهاية كل حل)
اشرح:
- "الفخ" المنهجي في هذا السؤال الذي يقع فيه أغلب الطلاب.
- النقطة الدقيقة التي يبحث عنها المصحح الوزاري (critère de correction).
- كيفية اقتناص النقاط الكاملة حتى في حالة الخطأ في الحساب (points de méthode).

══════════════════════════════════
🌐 معايير اللغة والخصوصية
══════════════════════════════════
• اللغة: عربية أكاديمية جزائرية رصينة.
• المصطلحات التقنية الفرنسية تُذكر بين قوسين مباشرة بعد المقابل العربي (مثال: **ثابت التوازن** (constante d'équilibre)).
• في حال كانت الصورة غير واضحة أو لا تحتوي على تمرين قابل للتصحيح، اطلب من الطالب فوراً: "الصورة غير واضحة بما يكفي للتصحيح الدقيق، يُرجى إعادة التصوير بإضاءة جيدة وبشكل أوضح."
• للردود الطويلة (أكثر من 300 كلمة)، أضف في الأسفل:
  ---
  *رد مُعالج وفق معايير مركز الخصوصية العالمي لـ الشيخ الذكي — بياناتك مشفرة.*

تذكر: أنت تساعد طلاب البكالوريا الجزائرية 2026 على الوصول للعلامة الكاملة.`;

router.post("/correct", upload.single("image"), async (req, res) => {
  try {
    const shoba = (req.body.shoba as string) || "علوم تجريبية";
    const notes = (req.body.notes as string) || "";
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "يجب رفع صورة التمرين" });
      return;
    }

    const base64Image = file.buffer.toString("base64");
    const mimeType = file.mimetype || "image/jpeg";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const userMessage = `الشعبة: **${shoba}**
${notes ? `ملاحظة الطالب: ${notes}` : ""}

قدّم التصحيح النموذجي الكامل لهذا التمرين وفق الهيكل البيداغوجي الإلزامي ومنهاج البكالوريا الجزائرية 2026.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: userMessage,
            },
          ],
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الخادم";
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
});

export default router;
