export type IValidatorzPresets = {
  [key: string]: IValidatorzInputRequirements
}
export type IValidatorzNumberRequirements = {
  min?: number,
  max?: number,
}
export type IValidatorzInputRequirements = {
  mustContain?: string[] | string,
  validChars?: string[] | string,
  min?: number,
  max?: number,
  regexp?: RegExp | string,
  number?: IValidatorzNumberRequirements
}

export type IValidatorzValidateOptions = {
  maxErrors?: number
}