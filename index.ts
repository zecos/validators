export { createStringValidator, createNumberValidator } from './validatorz'
import { createStringValidator, createNumberValidator } from './validatorz'
import {presets} from './presets'
import { IValidatorzInputRequirements } from './types'

export const createValidator = (requirements: IValidatorzInputRequirements | string) => {
  if (typeof requirements === "string") {
    const preset = presets[requirements]
    if (!preset) {
      throw new Error(`Cannot find preset ${requirements}`)
    }
    return preset
  }
  switch (requirements.type) {
    case "number":
      return createNumberValidator(requirements)
    case "string":
      return createStringValidator(requirements)
    default:
      throw new Error('`type` must be either "string" or "number".')
  }
}