import {
    BodyParams, Controller,
    Get,
    Inject,
    PathParams,
    Post
} from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { ObjectID } from "@tsed/mongoose";
import {
    Description,
    Groups,
    Name,
    Required,
    Returns,
    Summary
} from "@tsed/schema";
import { BrandModel } from "../models/BrandModel";
import { BrandsRepository } from "../services/BrandsRepository";

@Controller("/brands") // class
@Name("Brands")
export class BrandsController {
    @Inject()
    repository: BrandsRepository;
    @Get("/:id") // method
    @Returns(200, BrandModel).Description("C'est un car model")
    async getBrand(@PathParams("id") @ObjectID() id: string): Promise<BrandModel> {
        const brand = await this.repository.getBrand(id);

        if (brand) {
            return brand;
        }

        throw new NotFound("brand not found");
    }

    @Post("/")
    @Summary("Create a new Car")
    @(Returns(201, BrandModel).Description("Created"))
    @Returns(400).Description("Brand name must be unique")
    save(
        @Description("Brand model")
        @BodyParams()
        @Required()
        @Groups("creation")
        car: BrandModel
    ) {
        return this.repository.save(car);
    }
}
