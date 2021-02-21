import {PlatformTest} from "@tsed/common";
import {CarModel} from "../models/CarModel";
import {CarsRepository} from "./CarsRepository";

async function getServiceFixture() {
  const carModel: any = class {
    constructor(public model: any) {} // stocker ce qui est passé au constructor de notre mock on va stocker brand ref ligne 95
    updateOne() {}
    static deleteOne(carId: string) {} // methode static
    static find(): any {}
    static populate(): any {}
  };

  jest.spyOn(carModel.prototype, "updateOne"); // mock le prototype de brandmodel qui est updateOne observer l'appel

  const service = await PlatformTest.invoke<CarsRepository>(CarsRepository, [
    {
      token: CarModel, // service moker
      use: carModel
    }
  ]);

  return {service, carModel};
}

describe("CarsRepository", () => {
  beforeEach(PlatformTest.create); // initialiser son conteneur en mode sandbox
  afterEach(PlatformTest.reset); // remis à 0

  /* describe("getCars", () => {
    it("should return a car list", async () => {
      const cars = [
        {
          id: "5ff1dbd6de5cb82d800c1a00",
          description: "4l"
        },
        {
          id: "5ff1ddbc41bfb50fecacab44",
          description: "string"
        }
      ];

      const {service, carModel} = await getServiceFixture();

      jest.spyOn(carModel, "find");
      jest.spyOn(carModel, "populate");

      const result = await service.getCars();

      expect(result).toEqual(cars);
      expect(carModel.find).toHaveBeenCalledWith();
    });
  }); */

  describe("delete", () => {
    it("should add and delete a car", async () => {
      const carId = "5ff1dbd6de5cb82d800c1a00";
      const {service, carModel} = await getServiceFixture();

      jest.spyOn(carModel, "deleteOne");

      const result = await service.delete(carId);

      expect(result).toEqual(undefined);
      expect(carModel.deleteOne).toHaveBeenCalledWith({_id: carId});
    });
  });

  describe("save", () => {
    it("Should save a car", async () => {
      const car = {
        _id: "5ce7ad3028890bd71749d477",
        name: "string",
        brand: "5ce7ad3028890bd71749d477",
        category: "5ce7ad3028890bd71749d477",
        description: "string"
      };

      const {service, carModel} = await getServiceFixture();

      const result: any = await service.save(car);

      expect(result).toBeInstanceOf(carModel);
      expect(result.model).toEqual(car);
      expect(carModel.prototype.updateOne).toHaveBeenCalledWith(car, {upsert: true});
    });
  });
});
