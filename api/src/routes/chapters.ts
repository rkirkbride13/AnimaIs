import { Router } from "express";
import ChaptersController from "../controllers/chapters";

const router: Router = Router();

router.post("/", ChaptersController.CreateContent);
router.get("/", ChaptersController.FindByUser);
router.delete("/", ChaptersController.DeleteChapter);
router.patch("/", ChaptersController.UpdateChapter);

export default router;
