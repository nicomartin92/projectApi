import {Inject, Injectable} from "@tsed/di";
import { deserialize } from "@tsed/json-mapper";
import {MongooseModel} from "@tsed/mongoose";
import BrandsShop from "../../ressources/brandsShop.json";
import {BrandShopModel} from "../models/BrandShopModel";

@Injectable()
export class BrandsShopRepository {
  @Inject(BrandShopModel)
  model: MongooseModel<BrandShopModel>;

  async $onInit() {
    const count = await this.model.countDocuments();

    if (!count) {
      const promises = BrandsShop.map((item: any) => {
        return this.save(deserialize(item, {type: BrandShopModel, useAlias: false}));
      });

      return Promise.all(promises);
    }
  }

  async getBrandShop(id: string): Promise<BrandShopModel | null> {
    //$log.info("Search a car from ID", id);
    const brandShop = await this.model.findById(id);

    return brandShop;
  }

  async save(brandShop: BrandShopModel): Promise<BrandShopModel> {
    // $log.info({message: "Validate a brand", brand});

    const model = new this.model(brandShop);
    await model.updateOne(brandShop, {upsert: true});

    return model;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      _id: id
    });
  }

  async getBrandsShop(): Promise<BrandShopModel[]> {
    return this.model.find();
  }
}
