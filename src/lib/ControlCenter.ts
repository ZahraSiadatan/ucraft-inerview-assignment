import ajv from 'ajv'
import { NextFunction, Request, Response } from 'express'

export const validateSchema = async (body: object, schema: object) => {
  const validator = new ajv({ allErrors: true }).compile(schema)
  const validationResult = await validator(body)

  if (!validationResult) {
    console.log(validator.errors)
    throw new Error('Validation Error!')
  }
}

export const checkRequest = async (request: Request, response: Response, schema: object, authenticationNeeded: boolean, next: NextFunction): Promise<void | Response> => {
  try {
    await validateSchema(request.body, schema)

    if (authenticationNeeded) {
      let token: string = ''

      try {
        token =
          request.headers.authorization !== undefined
            ? request.headers.authorization.split(' ')[1]
            : request.originalUrl.split('?')[1].split('%20')[1]
      } catch (err) {
        throw new Error('unauthorized!')
      }

      return await next()
    }

    return await next()
  } catch (exception) {
    console.log(`exception: ${exception}`)
    return response
      .status(400)
      .json({ success: false, message: exception.message })
  }
}
