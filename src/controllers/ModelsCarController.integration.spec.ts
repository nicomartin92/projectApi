import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import SuperTest from "supertest";
import {Server} from "../Server";

describe("Model controller", () => {
  // bootstrap your Server to load all endpoints All run your test
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(TestMongooseContext.bootstrap(Server)); // Create a server with mocked database
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(TestMongooseContext.reset); // reset database and injector

  describe("POST /rest/models", () => {
    it("should create a new model", async () => {
      const response = await request
        .post("/rest/models")
        .send({
          name: "306"
        })
        .expect(201);

      expect(typeof response.body.id).toBe("string");
      expect(response.body.name).toEqual("306");
    });
  });

  describe("DELETE /rest/models", () => {
    it("should  remove a model", async () => {
      const {body: model} = await request
        .post(`/rest/models`)
        .send({
          name: "golf"
        })
        .expect(201);

      const response = await request.delete("/rest/models/" + model.id).expect(204);

      expect(response.body).toEqual({});
    });
  });
});
