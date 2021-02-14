import {PlatformTest} from "@tsed/common";
import {BrandModel} from "../models/BrandModel";
import {BrandsRepository} from "./BrandsRepository";

describe("BrandsRepository", () => {
  beforeEach(PlatformTest.create); // initialiser son conteneur en mode sandbox
  afterEach(PlatformTest.reset); // remis à 0

  describe("getBrand", () => {
    it("should return a brand", async () => {
      const brand = {name: "Peugeot", _id: "id"};

      const brandModel = {
        findById: jest.fn().mockResolvedValue(brand) // passe à la suite
      };

      const instance = await PlatformTest.invoke<BrandsRepository>(BrandsRepository, [
        {
          token: BrandModel, // service moker
          use: brandModel // moker le service injecter avec @Inject
        }
      ]); // get fresh instance

      const result = await instance.getBrand("id");

      expect(result).toEqual(brand);

      expect(brandModel.findById).toHaveBeenCalledWith("id");
    });
  });

  describe("save", () => {
    it("Should save a brand", async () => {
      const brand = {name: "Renault", _id: "id"};

      const brandModel = {
        updateOne: jest.fn().mockResolvedValue(brand) // passe à la suite
      };

      const instance = await PlatformTest.invoke<BrandsRepository>(BrandsRepository, [
        {
          token: BrandModel, // service moker
          use: brandModel
        }
      ]);

      const result = await instance.save(brand);

      expect(result).toEqual(brand);
    });
  });
});
