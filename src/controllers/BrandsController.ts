import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {ObjectID} from "@tsed/mongoose";
import {Description, Groups, Name, Required, Returns, Summary} from "@tsed/schema";
import {BrandModel} from "../models/BrandModel";
import {BrandsRepository} from "../services/BrandsRepository";

@Controller("/brands") // class
@Name("Brands")
export class BrandsController {
  @Inject()
  repository: BrandsRepository;
  @Get("/:id") // method
  @(Returns(200, BrandModel).Description("C'est un car model"))
  async getBrand(@PathParams("id") @ObjectID() id: string): Promise<BrandModel> {
    const brand = await this.repository.getBrand(id);

    if (brand) {
      return brand;
    }

    throw new NotFound("brand not found");
  }

  @Post("/")
  @Summary("Create a new brand")
  @(Returns(201, BrandModel).Description("Created"))
  @(Returns(400).Description("Brand name must be unique"))
  save(
    @Description("Brand model")
    @BodyParams()
    @Required()
    @Groups("creation")
    brand: BrandModel
  ) {
    return this.repository.save(brand);
  }

  @Put("/:id")
  @Summary("Update a brand")
  @(Returns(200, BrandModel).Description("Updated"))
  @(Returns(400).Description("Brand name must be unique"))
  update(
    @PathParams("id") @ObjectID() id: string,
    @Description("Brand model")
    @BodyParams()
    @Required()
    @Groups("update")
    brand: BrandModel
  ) {
    brand._id = id; // use id on file example
    return this.repository.save(brand); // brand = payload donné en entrée dans le body param
  }

  @Delete("/:id")
  @Summary("Delete a brand")
  @(Returns(204).Description("No content"))
  remove(@PathParams("id") @ObjectID() id: string) {
    return this.repository.delete(id);
  }

  @Get("/") // method
  @(Returns(200, Array).Of(BrandModel).Description("C'est une liste de brands"))
  @Summary("the brand list")
  async getBrands(): Promise<BrandModel[]> {
    const brands = await this.repository.getBrands();
    return brands;
  }
}
