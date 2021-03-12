import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {
    async create(request: Request, response: Response) {

        const { name, email } = request.body;
        const schema = yup.object().shape({
            name: yup.string().required("nome e obrigatorio"),
            email: yup.string().email().required("email incorreto"),
        });

        try {
            await schema.validate(request.body,{abortEarly:false});
        }catch (err) {
            throw new AppError(err);
        }
    
    
        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExist = await usersRepository.findOne({
            email
        });
        if (userAlreadyExist) {
            throw new AppError("Survey User does not exists!");
        }

        const user = usersRepository.create({ name, email });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
