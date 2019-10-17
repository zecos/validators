export type IValidatorzPresets = {
  [key: string]: IValidatorzInputRequirements
}

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

export type IValidatorzInputRequirements = IValidatorzInputNumberReq  | IValidatorzInputStringReq

export type IValidatorzValidateOptions = {
  maxErrors?: number
}

export type StringValidatorFn = (str: string) => Error[]