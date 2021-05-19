import {PlatformTest} from "@tsed/common";
import {Model} from "../models/Model";
import {ModelsRepository} from "./ModelsCarRepository";

async function getServiceFixture() {
  const modelModel: any = class {
    constructor(public model: any) {} // stocker ce qui est passé au constructor de notre mock on va stocker brand ref ligne 95
    updateOne() {}
    static deleteOne(carId: string) {} // methode static
    static find(): any {}
    static populate(): any {}
  };

  jest.spyOn(modelModel.prototype, "updateOne"); // mock le prototype de brandmodel qui est updateOne observer l'appel

  const service = await PlatformTest.invoke<ModelsRepository>(ModelsRepository, [
    {
      token: Model, // service moker
      use: modelModel
    }
  ]);

  return {service, modelModel};
}

describe("CarsRepository", () => {
  beforeEach(PlatformTest.create); // initialiser son conteneur en mode sandbox
  afterEach(PlatformTest.reset); // remis à 0

  describe("delete", () => {
    it("should add and delete a model", async () => {
      const carId = "5ff1dbd6de5cb82d800c1a00";
      const {service, modelModel} = await getServiceFixture();

      jest.spyOn(modelModel, "deleteOne");

      const result = await service.delete(carId);

      expect(result).toEqual(undefined);
      expect(modelModel.deleteOne).toHaveBeenCalledWith({_id: carId});
    });
  });

  describe("save", () => {
    it("Should save a model", async () => {
      const car = {
        _id: "5ce7ad3028890bd71749d477",
        name: "string",
        brand: "5ce7ad3028890bd71749d477",
        category: "5ce7ad3028890bd71749d477",
        description: "string"
      };

      const {service, modelModel} = await getServiceFixture();

      const result: any = await service.save(car);

      expect(result).toBeInstanceOf(modelModel);
      expect(result.model).toEqual(car);
      expect(modelModel.prototype.updateOne).toHaveBeenCalledWith(car, {upsert: true});
    });
  });
});
