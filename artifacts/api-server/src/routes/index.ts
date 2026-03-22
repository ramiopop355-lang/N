import { Router, type IRouter } from "express";
import healthRouter from "./health";
import correctRouter from "./correct";

const router: IRouter = Router();

router.use(healthRouter);
router.use(correctRouter);

export default router;
