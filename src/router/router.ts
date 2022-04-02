import { Router } from "express";
import CacheRouter from "./api/CacheRouter";

const router = Router();
router.use("/v1/cache", CacheRouter);

export default router;
