
export interface IValidatorzNumberRequirements {
  min?: number
  max?: number
}

export interface IValidatorzStringRequirements {
  mustContain?: string[] | string
  validChars?: string[] | string
  min?: number | Number
  max?: number
  regexp?: RegExp | string
  number?: IValidatorzNumberRequirements
}

export type IValidatorzPresets = {
  dob: IValidatorzRequirements,
  name: IValidatorzRequirements,
  ein: IValidatorzRequirements,
  password: IValidatorzRequirements,
  age: IValidatorzRequirements,
  email: IValidatorzRequirements,
  username: IValidatorzRequirements,
  phone: IValidatorzRequirements,
}
export type IValidatorzRequirements = IValidatorzNumberRequirements  |
  IValidatorzStringRequirements

export type IValidatorzValidateOptions = {
  maxErrors?: number
}

export type StringValidatorFn = (str: string) => Error[]
export type NumberValidatorFn = (num: number) => Error[]
export type ValidatorFnCreator = () => (val: any) => Error[]