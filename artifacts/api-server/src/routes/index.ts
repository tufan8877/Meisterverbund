import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import blogRouter from "./blog";
import newsRouter from "./news";
import adsRouter from "./ads";
import businessesRouter from "./businesses";
import commentsRouter from "./comments";
import ratingsRouter from "./ratings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(blogRouter);
router.use(newsRouter);
router.use(adsRouter);
router.use(businessesRouter);
router.use(commentsRouter);
router.use(ratingsRouter);
router.use(adminRouter);

export default router;
