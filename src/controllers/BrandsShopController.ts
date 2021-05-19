import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {ObjectID} from "@tsed/mongoose";
import {Description, Groups, Name, Required, Returns, Summary} from "@tsed/schema";
import {BrandShopModel} from "../models/BrandShopModel";
import {BrandsShopRepository} from "../services/BrandsShopRepository";

@Controller("/brandshops") // class
@Name("Brandshops")
export class BrandsShopController {
  @Inject()
  repository: BrandsShopRepository;
  @Get("/:id") // method
  @(Returns(200, BrandShopModel).Description("C'est un brandshop"))
  async getBrandShop(@PathParams("id") @ObjectID() id: string): Promise<BrandShopModel> {
    const brandShop = await this.repository.getBrandShop(id);

    if (brandShop) {
      return brandShop;
    }

    throw new NotFound("brandShop not found");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Post("/")
  @Summary("Create a new brandShop")
  @(Returns(201, BrandShopModel).Description("Created"))
  @(Returns(400).Description("BrandShop name must be unique"))
  save(
    @Description("BrandShop")
    @BodyParams()
    @Required()
    @Groups("creation")
    brandShop: BrandShopModel
  ) {
    return this.repository.save(brandShop);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Put("/:id")
  @Summary("Update a brandShop")
  @(Returns(200, BrandShopModel).Description("Updated"))
  @(Returns(400).Description("BrandShop name must be unique"))
  update(
    @PathParams("id") @ObjectID() id: string,
    @Description("BrandShop model")
    @BodyParams()
    @Required()
    @Groups("update")
    brandShop: BrandShopModel
  ) {
    brandShop._id = id; // use id on file example
    return this.repository.save(brandShop); // brand = payload donné en entrée dans le body param
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Delete("/:id")
  @Summary("Delete a brandShop")
  @(Returns(204).Description("No content"))
  remove(@PathParams("id") @ObjectID() id: string) {
    return this.repository.delete(id);
  }

  @Get("/") // method
  @(Returns(200, Array).Of(BrandShopModel).Description("C'est une liste de brandsShop"))
  @Summary("the brandShop list")
  async getBrandsShop(): Promise<BrandShopModel[]> {
    const brandsShop = await this.repository.getBrandsShop();
    return brandsShop;
  }
}
