import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {ObjectID} from "@tsed/mongoose";
import {Description, Groups, Name, Required, Returns, Summary} from "@tsed/schema";
import {CarModel} from "../models/CarModel";
import {CarsRepository} from "../services/CarsRepository";

@Controller("/cars") // class
@Name("Cars Details") // Name pour la doc swagger
export class CarsController {
  @Inject()
  repository: CarsRepository;
  @Get("/:id") // method
  @(Returns(200, CarModel).Description("C'est un car model"))
  async getCar(@PathParams("id") @ObjectID() id: string): Promise<CarModel> {
    const Cars = await this.repository.getCar(id);

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

  @Put("/id")
  @Summary("Update a car model")
  @(Returns(200, CarModel).Description("Updated"))
  @(Returns(400).Description("Model name must be unique"))
  update(
    @PathParams("id") @ObjectID() id: string,
    @Description("Brand model")
    @BodyParams()
    @Required()
    @Groups("update")
    car: CarModel
  ) {
    // car._id = id // use id on file example
    return this.repository.save(car); // brand = payload donné en entrée dans le body param
  }

  @Delete("/:id")
  @Summary("Delete a model")
  @(Returns(204).Description("No content"))
  remove(@PathParams("id") @ObjectID() id: string) {
    return this.repository.delete(id);
  }

  @Get("/") // method
  @(Returns(200, Array).Of(CarModel).Description("C'est une liste de cars"))
  @Summary("the cars list")
  async getCars(): Promise<CarModel[]> {
    const cars = await this.repository.getCars();
    return cars;
  }
}
