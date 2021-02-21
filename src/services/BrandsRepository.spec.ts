import {PlatformTest} from "@tsed/common";
import {BrandModel} from "../models/BrandModel";
import {BrandsRepository} from "./BrandsRepository";

async function getServiceFixture() {
  const brandModel: any = class {
    constructor(public model: any) {} // stocker ce qui est passé au constructor de notre mock on va stocker brand ref ligne 95
    updateOne() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static deleteOne(brandId: string) {} // methode static
    static find(): any {}
  };

  jest.spyOn(brandModel.prototype, "updateOne"); // mock le prototype de brandmodel qui est updateOne observer l'appel

  const service = await PlatformTest.invoke<BrandsRepository>(BrandsRepository, [
    {
      token: BrandModel, // service moker
      use: brandModel
    }
  ]);

  return {service, brandModel};
}

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

  describe("getBrands", () => {
    it("should return a brand list", async () => {
      const brands = [
        {name: "Peugeot", _id: "id"},
        {name: "Renault", _id: "id"}
      ];

      const {service, brandModel} = await getServiceFixture();

      jest.spyOn(brandModel, "find").mockResolvedValue(brands);

      const result = await service.getBrands();

      expect(result).toEqual(brands);
      expect(brandModel.find).toHaveBeenCalledWith();
    });
  });

  describe("delete", () => {
    it("should add and delete a brand", async () => {
      const brandId = "5ce7ad3028890bd71749d477";
      const {service, brandModel} = await getServiceFixture();

      jest.spyOn(brandModel, "deleteOne");

      const result = await service.delete(brandId);

      expect(result).toEqual(undefined);
      expect(brandModel.deleteOne).toHaveBeenCalledWith({_id: brandId});
    });
  });

  describe("save", () => {
    it("Should save a brand", async () => {
      const brand = {name: "Renault", _id: "id"};

      const {service, brandModel} = await getServiceFixture();

      const result: any = await service.save(brand);

      expect(result).toBeInstanceOf(brandModel);
      expect(result.model).toEqual(brand);
      expect(brandModel.prototype.updateOne).toHaveBeenCalledWith(brand, {upsert: true});
    });
  });
});
