import {BodyParams, Controller, 
        Get,
        Inject, 
        PathParams,
        Post } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { ObjectID } from "@tsed/mongoose";
import { Description, 
  Groups, 
         Required, 
         Returns, 
         Summary } from "@tsed/schema";
import { CarModel } from "../models/CarModel";
import { CarsRepository } from "../services/CarsRepository";

@Controller("/cars") // class
export class CarsController {
  @Inject()
  repository: CarsRepository;
  @Get("/:id") // method
  @Returns(200, CarModel).Description("C'est un car model")
  async getCar(@PathParams("id") @ObjectID() id: string): Promise<CarModel> {
    //return this.repository.getCar(id);
    const Cars = await this.repository.getCar(id);

    console.log('cars ------------------------------------------- ', Cars)
    console.log('id ------------------------------------------- ', id)

    if (Cars) {
      return Cars;
    }

    throw new NotFound("Cars not found");
  }

  @Post("/")
  @Summary("Create a new Car")
  @(Returns(201, CarModel).Description("Created"))
  save(
    @Description("Car model")
    @BodyParams()
    @Required()
    @Groups("creation")
    car: CarModel
  ) {
    return this.repository.save(car);
  }

  @Get("/") // method
  @Returns(200, Array).Of(CarModel).Description("C'est une liste de cars")
  @Summary("the cars list")
  async getCars(): Promise<CarModel[]> {
    const cars = await this.repository.getCars();
    return cars;
  }
}
