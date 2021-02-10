import {$log, Context} from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {Model} from "../models/Model";
import Models from "../../ressources/models.json";
import {deserialize} from "@tsed/json-mapper";

export interface ModelSearchOptions {
  brandId: string;
  withDetails: boolean;
}

@Injectable()
export class ModelsRepository {
  @Inject(Model)
  model: MongooseModel<Model>;

  async $onInit() {
    const count = await this.model.countDocuments();

    if (!count) {
      const promises = Models.map((item: any) => {
        return this.save(deserialize(item, {type: Model, useAlias: false}));
      });

      return Promise.all(promises);
    }
  }

  async getById(id: string): Promise<Model | null> {
    //$log.info("Search a car from ID", id);
    const model = await this.model.findById(id);

    return model;
  }

  async save(model: Model): Promise<Model> {
    $log.info({message: "Validate model", model});

    const data = new this.model(model);
    $log.info({message: "Save model", model});
    await data.updateOne(model, {upsert: true});

    $log.info({message: "model saved", data});

    return data;
  }

  async delete(id: string): Promise<Model> {
    return await this.model.deleteOne({
      _id: id
    });
  }

  async find(options: Partial<ModelSearchOptions> = {}, ctx?: Context): Promise<Model[]> {
    // partial rend optionnel tous les champs du model search option
    const queryOptions: any = {};
    if (options.brandId) {
      queryOptions.brand = {
        $eq: options.brandId // eq = equal
      };
    }
    ctx?.logger.debug({event: "find models", queryOptions: queryOptions}); // log debug

    const query = this.model.find(queryOptions);

    if (options.withDetails) {
      return query.populate("brand");
    }

    return query;
  }
}
