import { Router } from "express";
import UsersController from "../controllers/users";

const router: Router = Router();

router.post("/", UsersController.Create);

export default router;
