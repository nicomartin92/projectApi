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
 *   @Inject(brands)
 *   model: MongooseModel<brands>;
 * }
 * ```
 */
@Model({
  name: "brands"
})
export class BrandModel {
  // decorator with some validators
  @ObjectID("id")
  @Groups("!creation", "!update") // masquer les champs
  _id: string;

  @Unique()
  @Required()
  @MinLength(3)
  name: string;
}
