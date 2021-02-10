import { Model as M, ObjectID, Ref, Unique } from "@tsed/mongoose";
import { Groups, MinLength, Required } from "@tsed/schema";
import { BrandModel } from "./BrandModel";
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
export class Model { // decorator with some validators
  @ObjectID("id")
  @Groups("!creation", "!update") // masquer les champs
  _id: string;

  @Unique()
  @Required()
  @MinLength(2)
  name: string;

  @Ref(BrandModel) // relation
  brand: Ref<BrandModel>; // relation between brandModel and carModels TS soit un string soit object <BrandModel>
}
