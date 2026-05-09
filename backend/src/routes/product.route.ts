import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { productSchema } from "@/validators/product.validator";

const router = Router();

router.use(authenticate);

router.get("/", productController.getPaginatedProducts);
router.get("/:productId", productController.getProductDetails);
router.patch("/:productId", authorize(Role.SELLER), validate(productSchema.partial()), productController.updateProduct);
router.delete("/:productId", authorize(Role.SELLER), productController.deleteProduct);

export default router;
