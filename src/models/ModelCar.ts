import {Model as M, ObjectID, Ref, Unique} from "@tsed/mongoose";
import {CollectionOf, Groups, MinLength, Required, string} from "@tsed/schema";
import {BrandModel} from "./BrandModel";
/**
 * ## How to inject model?
 *
 * ```typescript
 * import { MongooseModel } from "@tsed/mongoose";
 * import { Injectable, Inject } from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(brands)
 *   model: MongooseModel<brands>;
 * }
 * ```
 */
@M({
  name: "models"
})
export class ModelCar {
  // decorator with some validators
  @ObjectID("id")
  @Groups("!creation", "!update") // masquer les champs
  _id: string;

  @Unique()
  @Required()
  @MinLength(2)
  name: string;

  @Ref(BrandModel) // relation
  brand: Ref<BrandModel>; // relation between brandModel and carModels TS soit un string soit object <BrandModel>

  @CollectionOf(String)
  versions: string[] = [];

  @CollectionOf(Number)
  years: number[] = [];

  @CollectionOf(String)
  ref: string[] = [];

  @CollectionOf(String)
  country: string[] = [];

  @CollectionOf(String)
  colorName: string[] = [];

  @CollectionOf(String)
  description: string[] = [];

  @CollectionOf(String)
  status: string[] = [];

  @CollectionOf(String)
  price: string[] = [];

  @CollectionOf(String)
  soldMonth: string[] = [];

  @CollectionOf(String)
  soldYear: number[] = [];

  @CollectionOf(String)
  stock: number[] = [];
}
