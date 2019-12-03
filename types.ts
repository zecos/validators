
export interface IValidatorsNumberRequirements {
  min?: number
  max?: number
}

export interface IValidatorsStringRequirements {
  mustContain?: string[] | string
  validChars?: string[] | string
  min?: number | Number
  max?: number
  regexp?: RegExp | string
  number?: IValidatorsNumberRequirements
}

export type IValidatorsPresets = {
  dob: IValidatorsRequirements,
  name: IValidatorsRequirements,
  ein: IValidatorsRequirements,
  password: IValidatorsRequirements,
  age: IValidatorsRequirements,
  email: IValidatorsRequirements,
  username: IValidatorsRequirements,
  phone: IValidatorsRequirements,
}
export type IValidatorsRequirements = IValidatorsNumberRequirements  |
  IValidatorsStringRequirements | ValidatorFnCreator

export type IValidatorsValidateOptions = {
  maxErrors?: number
}

export type StringValidatorFn = (str: string) => Error[]
export type NumberValidatorFn = (num: number) => Error[]
export type ValidatorFnCreator = () => (val: any) => Error[]