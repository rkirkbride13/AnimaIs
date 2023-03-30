import { Router } from "express";
import ChaptersController from "../controllers/chapters";

const router: Router = Router();

router.post("/", ChaptersController.CreateContent);

export default router;
