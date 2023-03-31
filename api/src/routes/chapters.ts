import { Router } from "express";
import ChaptersController from "../controllers/chapters";

const router: Router = Router();

router.post("/", ChaptersController.CreateContent);
router.get("/", ChaptersController.FindByUser);

export default router;
