import {Inject, Injectable} from "@tsed/di";
import { deserialize } from "@tsed/json-mapper";
import {MongooseModel} from "@tsed/mongoose";
import Brands from "../../ressources/brands.json";
import {BrandModel} from "../models/BrandModel";

@Injectable()
export class BrandsRepository {
  @Inject(BrandModel)
  model: MongooseModel<BrandModel>;

  async $onInit() {
    const count = await this.model.countDocuments();

    if (!count) {
      const promises = Brands.map((item: any) => {
        return this.save(deserialize(item, {type: BrandModel, useAlias: false}));
      });

      return Promise.all(promises);
    }
  }

  async getBrand(id: string): Promise<BrandModel | null> {
    //$log.info("Search a car from ID", id);
    const brand = await this.model.findById(id);

    return brand;
  }

  async save(brand: BrandModel): Promise<BrandModel> {
    // $log.info({message: "Validate a brand", brand});

    const model = new this.model(brand);
    await model.updateOne(brand, {upsert: true});

    return model;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      _id: id
    });
  }

  async getBrands(): Promise<BrandModel[]> {
    return this.model.find();
  }
}
