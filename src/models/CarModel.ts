import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {Groups, Property, Required} from "@tsed/schema";
import {BrandModel} from "./BrandModel";
import {CarCategoryModel} from "./CarCategoryModel";
/**
 * ## How to inject model?
 *
 * ```typescript
 * import { MongooseModel } from "@tsed/mongoose";
 * import { Injectable, Inject } from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(cars)
 *   model: MongooseModel<cars>;
 * }
 * ```
 */
@Model({
  name: "cars"
})
export class CarModel {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Required()
  name: string;

  @Ref(BrandModel)
  brand: Ref<BrandModel>;

  @Ref(CarCategoryModel)
  category: Ref<CarCategoryModel>;

  @Property()
  description: string;
}
