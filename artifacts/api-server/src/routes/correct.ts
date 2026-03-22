import { Router, type IRouter } from "express";
import multer from "multer";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const SYSTEM_PROMPT = `أنت أستاذ متخصص في تصحيح تمارين البكالوريا الجزائرية. مهمتك تصحيح التمارين وفق المنهاج الجزائري الرسمي بطريقة واضحة ومفصلة.

قواعد التصحيح:
- اكتب التصحيح النموذجي كاملاً خطوة بخطوة
- استخدم المنهجية المعتمدة رسمياً في الجزائر
- اشرح كل خطوة بوضوح باللغة العربية الفصحى مع مصطلحات دارجة للتوضيح عند الحاجة
- إذا كان التمرين يحتوي على معادلات رياضية، اكتبها بشكل واضح
- في النهاية، أضف ملاحظات مهمة للطالب
- استخدم Markdown لتنسيق الإجابة (عناوين، قوائم، تغليظ نص مهم)

تذكر: أنت تساعد طلاب البكالوريا الجزائرية على الفهم والتحضير للامتحان.`;

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

    const userMessage = `الشعبة: ${shoba}
${notes ? `ملاحظة الطالب: ${notes}` : ""}

قدم التصحيح النموذجي الكامل لهذا التمرين وفق منهاج البكالوريا الجزائرية.`;

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
