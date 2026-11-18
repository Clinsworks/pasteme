export function validate(schema, property = "body") {
  return function validateRequest(request, _response, next) {
    try {
      request[property] = schema.parse(request[property]);
      next();
    } catch (error) {
      next(error);
    }
  };
}
