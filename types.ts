
export interface IValidatorzNumberRequirements {
  type?: "number"
  min?: number
  max?: number
}

export interface IValidatorzStringRequirements {
  type?: "string"
  mustContain?: string[] | string
  validChars?: string[] | string
  min?: number | Number
  max?: number
  regexp?: RegExp | string
  number?: IValidatorzNumberRequirements
}

export interface IValidatorzInputStringReq extends IValidatorzStringRequirements {
  type: "string"
}

export interface IValidatorzInputNumberReq extends IValidatorzNumberRequirements {
  type: "number"
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
export type PresetName = "dob" | "name" | "ein" | "password" | "phone" | "username" | "age" | "email"
export type IValidatorzRequirements = IValidatorzNumberRequirements  | IValidatorzStringRequirements | ValidatorFnCreator | PresetName

export type IValidatorzValidateOptions = {
  maxErrors?: number
}

export type StringValidatorFn = (str: string) => Error[]
export type NumberValidatorFn = (num: number) => Error[]
export type ValidatorFn = StringValidatorFn | NumberValidatorFn
export type ValidatorFnCreator = () => ValidatorFn