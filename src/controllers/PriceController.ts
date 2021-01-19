import {Controller, Get} from "@tsed/common";

@Controller("/prices")
export class PriceCtrl {
  @Get()
  findAll(): string {
    return "This action returns all prices";
  }
}