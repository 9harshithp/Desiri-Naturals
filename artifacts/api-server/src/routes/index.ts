import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import farmsRouter from "./farms";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import boxesRouter from "./boxes";
import discoverRouter from "./discover";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(farmsRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(boxesRouter);
router.use(discoverRouter);

export default router;
