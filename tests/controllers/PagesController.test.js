import { jest } from "@jest/globals";
import request from "supertest";

import app from "../../app.js";

describe("PagesController", () => { // describe the object
    describe("GET /", () => { // describe the method, describe(http-verb route/path, () => {...})
        it("should respond with the home view", async () => {
            const response = await request(app).get("/");

            expect(response.statusCode).toBe(200);
        });
    });

    describe("GET /insult", () => {
        it("should respond with the insult view", async () => {
            const response = await request(app).get("/insult");
            
            expect(response.statusCode).toBe(200);

            expect(response.text).toContain("<title>Insult</title>");
            expect(response.text.toLocaleLowerCase()).toContain("insult"); // this is the text inbetween the h1 tags
        })
    })

    describe("GET /:id", () => {
        it("should render the pages/id view", async () => {
            const response = await request(app).get("/123");
            
            expect(response.statusCode).toBe(200);
        });

        it("should respond 400 error code if id is NaN", async () => {
            const response = await request(app).get("/123a");
            
            expect(response.statusCode).toBe(400);
        });
    })
});