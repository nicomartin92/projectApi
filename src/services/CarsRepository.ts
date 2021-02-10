import {Inject, Injectable} from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { CarModel } from "../models/CarModel";
import {$log} from "@tsed/logger";

@Injectable()
export class CarsRepository {
    @Inject(CarModel)
    model: MongooseModel<CarModel>;
    async getCar(id: string): Promise<CarModel | null> {
        // return this.model.findById(id);
        $log.info("Search a car from ID", id);
        const car = await this.model.findById(id).populate("brand");

        $log.info("Found", car);

        return  car;
    }

    async save(car: CarModel): Promise<CarModel> {
        $log.info({message: "Validate car", car});

        const model = new this.model(car);
        $log.info({message: "Save car", car});
        await model.updateOne(car, {upsert: true});

        $log.info({message: "Car saved", model});

        return model;
    }

    async delete(id: string): Promise<CarModel> {
        return await this.model.deleteOne({
            _id: id
          });
    }

    async getCars(): Promise<CarModel[]> {
        return this.model.find().populate("brand");
    }
}
