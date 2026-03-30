import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import pinoHttp from "pino-http";
import multer from "multer";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(compression());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// ── معالج الأخطاء الشامل — يُرجع JSON دائماً ──────────────────────────
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (res.headersSent) return;

  // أخطاء Multer (حجم الملف، نوع الملف...)
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE:   "حجم الملف كبير جداً (الحد الأقصى 15 ميغابايت)",
      LIMIT_FILE_COUNT:  "عدد الملفات تجاوز الحد المسموح",
      LIMIT_FIELD_COUNT: "عدد الحقول تجاوز الحد المسموح",
      LIMIT_UNEXPECTED_FILE: "حقل ملف غير متوقع",
    };
    const msg = messages[err.code] ?? `خطأ في رفع الملف: ${err.message}`;
    logger.warn({ code: err.code }, `[MULTER] ${msg}`);
    return void res.status(400).json({ error: msg });
  }

  // أخطاء مخصصة (fileFilter cb(new Error(...)))
  if (err instanceof Error) {
    logger.error({ message: err.message, stack: err.stack }, "[APP-ERROR]");
    const status = (err as Error & { status?: number }).status ?? 500;
    return void res.status(status).json({ error: err.message || "خطأ في الخادم" });
  }

  // أي خطأ آخر
  logger.error({ err }, "[APP-ERROR-UNKNOWN]");
  return void res.status(500).json({ error: "خطأ غير متوقع في الخادم" });
});

export default app;
