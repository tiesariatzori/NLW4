import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/Surveys_UsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Request, Response } from "express";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";
import { AppError } from "../errors/AppError";


class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;
        const usersRepository = getCustomRepository(UserRepository);
        const surveysReposityory = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const user = await usersRepository.findOne({ email });
        if (!user) {
            throw new AppError("Survey User does not exists!");

        }
        const survey = await surveysReposityory.findOne({ id: survey_id });
        if (!survey) {
            throw new AppError("Survey User does not exists!");
        }
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]

        });
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        };
        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);

        }
        // salvar as informaçoes na tabela survey user
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);
        // enviar email para o usario
        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUser);
    }



}

export { SendMailController };