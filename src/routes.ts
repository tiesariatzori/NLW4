import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveysController } from "./controllers/SurveysController";
import { SendMailController } from "./controllers/SendMailController";
import { answerController} from "./controllers/answerController";
import { NpsController } from "./controllers/NpsController";

const router = Router();

const npsController = new NpsController();
const AnswerController = new answerController();
const userController = new UserController();
const surveysController = new SurveysController();
const sendEmailController = new SendMailController();

router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);
router.post("/sendMail", sendEmailController.execute);
router.get("/answers/:value", AnswerController.execute);
router.get("/nps/:survey_id",npsController.execute);

export { router };