import { $log } from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { BrandModel } from "../models/BrandModel";
import Brands from "../../ressources/brands.json";
import { deserialize } from "@tsed/json-mapper";

@Injectable()
export class BrandsRepository {
    @Inject(BrandModel)
    model: MongooseModel<BrandModel>;

    async $onInit() {
        const count = await this.model.countDocuments()

        if(!count) {
            const promises = Brands.map((item) => {
                return this.save(deserialize(item, {type: BrandModel, useAlias: false}))
            })

            return Promise.all(promises);
        }
    }

    async getBrand(id: string): Promise<BrandModel | null> {
        //$log.info("Search a car from ID", id);
        const brand = await this.model.findById(id);

        //$log.info("Found", brand);

        return  brand;
    }

    async save(brand: BrandModel): Promise<BrandModel> {
        $log.info({message: "Validate a brand", brand});

        const model = new this.model(brand);
        $log.info({message: "Save brand", brand});
        await model.updateOne(brand, {upsert: true});

        $log.info({message: "brand saved", model});

        return model;
    }

    async delete(id: string): Promise<BrandModel> {
        return await this.model.deleteOne({
            _id: id
          });
    }

    async getBrands(): Promise<BrandModel[]> {
        return this.model.find();
    }
}
