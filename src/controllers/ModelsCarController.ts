import {BodyParams, Context, Controller, Delete, Get, Inject, PathParams, Post, Put, QueryParams} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {ObjectID} from "@tsed/mongoose";
import {Description, Groups, Name, Required, Returns, Summary} from "@tsed/schema";
import {ModelCar} from "../models/ModelCar";
import {ModelsRepository} from "../services/ModelsCarRepository";

@Controller("/models") // class
@Name("Models car")
export class ModelsController {
  @Inject()
  repository: ModelsRepository;
  @Get("/:id") // method
  @(Returns(200, ModelCar).Description("C'est un model"))
  async get(@PathParams("id") @ObjectID() id: string): Promise<ModelCar> {
    const model = await this.repository.getById(id);

    if (model) {
      return model;
    }

    throw new NotFound("model not found");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Post("/")
  @Summary("Create a new model")
  @(Returns(201, ModelCar).Description("Created"))
  @(Returns(400).Description("model name must be unique"))
  save(
    @Description("model model")
    @BodyParams()
    @Required()
    @Groups("creation")
    model: ModelCar
  ) {
    return this.repository.save(model);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Put("/:id")
  @Summary("Update a model")
  @(Returns(200, ModelCar).Description("Updated"))
  @(Returns(400).Description("model name must be unique"))
  update(
    @PathParams("id") @ObjectID() id: string,
    @Description("model model")
    @BodyParams()
    @Required()
    @Groups("update")
    model: ModelCar
  ) {
    model._id = id; // use id on file example
    return this.repository.save(model); // model = payload donné en entrée dans le body param
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Delete("/:id")
  @Summary("Delete a model")
  @(Returns(204).Description("No content"))
  remove(@PathParams("id") @ObjectID() id: string) {
    return this.repository.delete(id);
  }

  @Get("/") // method
  @(Returns(200, Array).Of(ModelCar).Description("C'est une liste de models"))
  @Summary("the model list")
  async find(
    @QueryParams("brandId") brandId: string,
    @QueryParams("withDetails") withDetails: boolean,
    @Context() ctx: Context
  ): Promise<ModelCar[]> {
    // @Context() ctx: Context info de la request , mais aussi logger passer en parametre du find
    return this.repository.find({brandId, withDetails}, ctx); // search ressource by brand id
  }
}
