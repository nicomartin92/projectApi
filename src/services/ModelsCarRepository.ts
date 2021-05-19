import {$log, Context} from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {ModelCar} from "../models/ModelCar";
import Models from "../../ressources/models.json";
import {deserialize} from "@tsed/json-mapper";

export interface ModelSearchOptions {
  brandId: string;
  withDetails: boolean;
}

@Injectable()
export class ModelsRepository {
  @Inject(ModelCar)
  model: MongooseModel<ModelCar>;

  async $onInit() {
    const count = await this.model.countDocuments();

    if (!count) {
      const promises = Models.map((item: any) => {
        return this.save(deserialize(item, {type: ModelCar, useAlias: false}));
      });

      return Promise.all(promises);
    }
  }

  async getById(id: string): Promise<ModelCar | null> {
    //$log.info("Search a car from ID", id);
    const model = await this.model.findById(id);

    return model;
  }

  async save(model: ModelCar): Promise<ModelCar> {
    $log.info({message: "Validate model", model});

    const data = new this.model(model);
    $log.info({message: "Save model", model});
    await data.updateOne(model, {upsert: true});

    $log.info({message: "model saved", data});

    return data;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      _id: id
    });
  }

  async find(options: Partial<ModelSearchOptions> = {}, ctx?: Context): Promise<ModelCar[]> {
    // partial rend optionnel tous les champs du model search option
    const queryOptions: any = {};
    if (options.brandId) {
      queryOptions.brand = {
        $eq: options.brandId // eq = equal
      };
    }
    // ctx?.logger.debug({event: "find models", queryOptions: queryOptions}); // log debug

    const query = this.model.find(queryOptions);

    if (options.withDetails) {
      return query.populate("brand");
    }

    return query;
  }
}
