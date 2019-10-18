import { createStringValidator, createNumberValidator } from './validatorz'
import { presets } from './presets'
import { IValidatorzRequirements } from './types'

export { createStringValidator, createNumberValidator } from './validatorz'
export { presets } from './presets'



export const createValidator = (requirements: IValidatorzRequirements) => {
  if (typeof requirements === "function") {
    return requirements()
  }
  if (typeof requirements === "string") {
    const preset = presets[requirements]
    if (!preset) {
      throw new Error(`Cannot find preset ${requirements}`)
    }
    return createValidator(preset)
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