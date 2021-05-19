import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import SuperTest from "supertest";
import {Server} from "../Server";

describe("Brand controller", () => {
  // bootstrap your Server to load all endpoints All run your test
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(TestMongooseContext.bootstrap(Server)); // Create a server with mocked database
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(TestMongooseContext.reset); // reset database and injector

  describe("POST /rest/brands", () => {
    it("should create a new brand", async () => {
      const response = await request
        .post("/rest/brands")
        .send({
          name: "Renault"
        })
        .expect(201);

      expect(typeof response.body.id).toBe("string");
      expect(response.body.name).toEqual("Renault");
    });

    it("should throw an exception error when the brand already exists", async () => {
      const response = await request
        .post("/rest/brands")
        .send({
          name: "Citroen"
        })
        .expect(201);

      const response2 = await request
        .post("/rest/brands")
        .send({
          name: "Citroen"
        })
        .expect(400);

      expect(response2.body).toEqual({});
      expect(response.body.name).toEqual("Citroen");
    });
  });

  describe("GET /rest/brands", () => {
    it("should get a brand", async () => {
      const {body: brand} = await request
        .post("/rest/brands")
        .send({
          name: "Peugeot"
        })
        .expect(201);

      const response = await request.get("/rest/brands/" + brand.id).expect(200);

      expect(response.body.id).toEqual(brand.id);
      expect(response.body.name).toEqual("Peugeot");
    });
  });

  describe("PUT /rest/brands/:id", () => {
    it("should  throw a bad request when payload is empty", async () => {
      const {body: brand} = await request.get("/rest/brands").expect(200);

      const response = await request.put(`/rest/brands/${brand.id}`).expect(400);

      expect(response.body).toEqual({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.body".\n' + `BrandModel should have required property 'name'. Given value: "undefined"`,
        status: 400,
        errors: [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: {
              missingProperty: "name"
            },
            message: "should have required property 'name'",
            modelName: "BrandModel"
          }
        ]
      });
    });

    /* it("should update the brand", async () => {
      const {body: brand} = await request.get("/rest/brands").expect(200);

      console.log(brand);

      const response2 = await request
        .put(`/rest/brands`)
        .send({
          name: "Ford"
        })
        .expect(200);

      expect(response2.body).toEqual({
        name: "Alfa Romeo"
      });
    }); */

    describe("DELETE /rest/brands", () => {
      it("should  remove a brand", async () => {
        const {body: brand} = await request
          .post(`/rest/brands`)
          .send({
            name: "Ford"
          })
          .expect(201);

        const response = await request.delete("/rest/brands/" + brand.id).expect(204);

        expect(response.body).toEqual({});
      });
    });
  });
});
