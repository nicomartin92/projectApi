import {Model, ObjectID, Ref, Unique} from "@tsed/mongoose";
import {Groups, MinLength, Required} from "@tsed/schema";
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
@Model({
  name: "brandshop"
})
export class BrandShopModel {
  // decorator with some validators
  @ObjectID("id")
  @Groups("!creation", "!update") // masquer les champs
  _id: string;

  @Ref(BrandModel) // relation
  brand: Ref<BrandModel>; // relation between brandModel and carModels TS soit un string soit object <BrandModel>

  @Unique()
  @Required()
  @MinLength(3)
  name: string;
}
