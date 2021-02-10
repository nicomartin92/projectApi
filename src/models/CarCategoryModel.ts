import {Model, ObjectID, Unique} from "@tsed/mongoose";
import {Groups, MinLength, Required} from "@tsed/schema";
/**
 * ## How to inject model?
 *
 * ```typescript
 * import { MongooseModel } from "@tsed/mongoose";
 * import { Injectable, Inject } from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(carCategories)
 *   model: MongooseModel<carCategories>;
 * }
 * ```
 */
@Model({
  name: "carCategories"
})
export class CarCategoryModel {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Unique()
  @Required()
  @MinLength(3)
  name: string;
}
