
import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from "../database";

describe("Surveys", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });
    afterAll(async()=>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })


    it("should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: "title exemple",
            description: "descripition exemple",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

    });
    it("sould be able to get all surveys",async ()=>{
     await request(app).post("/surveys").send({
        title: "title exemple2",
        description: "descripition exemple2",
    });
    const response = await request(app).get("/surveys");
    expect(response.body.length).toBe(2);



    });

});
