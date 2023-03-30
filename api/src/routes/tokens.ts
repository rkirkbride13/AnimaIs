import { Router } from "express";
import TokensController from "../controllers/tokens";

const router: Router = Router();

router.post("/", TokensController.Create);

export default router;
