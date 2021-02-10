import {Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";

@Catch("MongoError")
export class MongoErrorFilter implements ExceptionFilterMethods {
  catch(error: any, ctx: PlatformContext): void {
    // console.log(Object.keys(error));
    // console.log(error.code, error.keyPattern, error.keyValue)
    ctx.response
      .status(400)
      .contentType("application/json")
      .body({
        name: "Bad Request",
        status: 400,
        errors: [],
        stack: ctx.env === "development" && error.stack,
        ...this.mapError(error)
      });
  }

  mapError(error: any) {
    switch (error.code) {
      case 11000:
        const [key] = Object.keys(error.keyPattern);
        return {message: `'${key}' must be unique. Given value: ${JSON.stringify(error.keyValue)}`};
      default:
        return {
          code: error.code,
          status: 500,
          message: error.message
        };
    }
  }
}
