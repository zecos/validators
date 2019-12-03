import { IValidatorsValidateOptions, IValidatorsNumberRequirements, IValidatorsStringRequirements, StringValidatorFn } from './types'
import { orList } from 'human-list'

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
const alphabetUpper = alphabetLower.toUpperCase()
const alphabetAll = alphabetLower + alphabetUpper
const digits = '0123456789'
const alphanumeric = alphabetAll + digits
const symbols = `!@#$%^&*()_-+=[{]}\\|><.,?/"';:~\``

const charsToHash = chars => chars
  .split('')
  .reduce((prev, cur) => {
    prev[cur] = true
    return prev
  }, {})

export const charHashes = {
  letters: charsToHash(alphabetAll),
  lowercase: charsToHash(alphabetLower),
  uppercase: charsToHash(alphabetUpper),
  digits: charsToHash(digits),
  symbols: charsToHash(symbols),
  alphanumeric: charsToHash(alphanumeric),
  spaces: charsToHash(" ")
}

export const getHash = str => charHashes[str] ? charHashes[str] : charsToHash(str)

export const combineHashes = (...hashes) => hashes.reduce((prev, cur) => ({...prev, ...getHash(cur)}), {})

const getHumanList = (arr, conjunction = "and") => [arr.slice(0, -1).join(', '), arr.slice(-1)[0]]
  .join(arr.length < 2 ? '' : arr.length < 3 ? ` ${conjunction} ` : `, ${conjunction} `)

export const createBinaryHash = (acc, cur, idx) => {
  const binaryRepresentation = (1 << idx)
  for (const char in cur) {
    acc[char] = (acc[char] || 0) | binaryRepresentation
  }
  return acc
}

export const surroundQuotes = str => `"${str}"`

export const createMustContainValidator = (mustContain): StringValidatorFn => {
  const mustContainNames = [].concat(mustContain)
    .map(name => charHashes[name] ? camelToLower(name) : name)

  const binaryHash = mustContainNames
    .reverse()
    .map(getHash)
    .reduce(createBinaryHash, {})
  const checkVal = parseInt("1".repeat(mustContain.length), 2)

  return str => {
    let curVal = 0
    for (const char of str) {
      if ((curVal |= binaryHash[char]) === checkVal) {
        return []
      }
    }
    // not found, so retrieve names of missing values
    const notContained = []
    for (const idx in mustContainNames) {
      if (!(curVal & 1)) {
          notContained.push(mustContainNames[idx])
      }
      curVal >>= 1
    }

    const humanList = getHumanList(notContained.map(surroundQuotes))
    return [new Error(`Must contain ${humanList}`)]
  }
}

export const createStringMinValidator = (min): StringValidatorFn => str => {
  if (str.length < min) {
    return [new Error(`Must be at least ${min} characters long.`)]
  }
}

export const createStringMaxValidator = (max): StringValidatorFn=> str => {
  if (str.length > max) {
    return [new Error(`Must be no longer than ${max} characters long.`)]
  }
}

export const createValidCharsValidator = (validChars): StringValidatorFn =>  {
  const validCharsArr = [].concat(validChars)
  const humanList = getHumanList(validCharsArr.map(surroundQuotes))
  const errorMessageTail = ` is not allowed. Only ${humanList} are allowed.`
  const validCharsCombined = combineHashes(...validCharsArr)
  return str => {
    for (const char of str) {
      if (!validCharsCombined[char]) {
        return [new Error(char + errorMessageTail)]
      }
    }
    return []
  }
}

export const createRegexpValidator = (regexp): StringValidatorFn => str => {
  if (!regexp.test(str)) {
    return [new Error(`Invalid input.`)]
  }
}

const defaultValidateOptions = {
  maxErrors: Infinity,
}

export const createStringValidator = (requirements: IValidatorsStringRequirements): StringValidatorFn => {
  const validatorFns = []

  if (requirements.mustContain) {
    validatorFns.push(createMustContainValidator(requirements.mustContain))
  }

  if (requirements.validChars) {
    validatorFns.push(createValidCharsValidator(requirements.validChars))
  }

  if (requirements.min) {
    validatorFns.push(createStringMinValidator(requirements.min))
  }

  if (requirements.max) {
    validatorFns.push(createStringMaxValidator(requirements.max))
  }

  if (requirements.regexp) {
    const regexp = requirements.regexp instanceof RegExp ? requirements.regexp : new RegExp(requirements.regexp)
    validatorFns.push(createRegexpValidator(regexp))
  }

  return (str: string, options: IValidatorsValidateOptions = defaultValidateOptions): Error[] => {
    let errors = []
    for (const validatorFn of validatorFns) {
      const newError = validatorFn(str)
      if (newError) {
        errors = errors.concat(newError)
        if (errors.length > options.maxErrors) {
          break
        }
      }
    }
    return errors
  }
}

export const createNumberValidator = ({min, max}: IValidatorsNumberRequirements) => {
  max = max || Infinity
  min = min || -Infinity
  return (num: number | string): Error[] => {
    if (typeof num !== "number") {
      const originalNumber = num
      num = Number(num)
      if (Number.isNaN(num)) {
        return [new Error(`Could not convert ${originalNumber} to a number.`)]
      }
    }
    if (num < min) {
      return [new Error(`Must be greater than or equal to ${min}.`)]
    }
    if (num > max) {
      return [new Error(`Must be less than or equal to ${max}.`)]
    }
    return []
  }
}

export const createOneOfValidator = ({options}: {options: any[]}) => {
  const err = [new Error(`Must be ${orList(options)}.`)]
  return input => {
    if (!options.includes(input)) {
      return err
    }
    return []
  }
}


function camelToLower (camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/ ./g, (match) => match.toLowerCase())
    .trim()
}