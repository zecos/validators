import { IValidatorzInputRequirements, IValidatorzValidateOptions, IValidatorzNumberRequirements } from './types'
import { presets } from './presets'


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

export const createMustContainChecker = mustContain => {
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
        return
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
    return new Error(`Must contain ${humanList}`)
  }
}

export const createValidCharsChecker = validChars => {
  const validCharsArr = [].concat(validChars)
  const humanList = getHumanList(validCharsArr.map(surroundQuotes))
  const errorMessageTail = ` is not allowed. Only ${humanList} are allowed.`
  const validCharsCombined = combineHashes(...validCharsArr)
  return str => {
    for (const char of str) {
      if (!validCharsCombined[char]) {
        return new Error(char + errorMessageTail)
      }
    }
  }
}

export const createValidateMin = min => str => {
  if (str.length < min) {
    return new Error(`Must be at least ${min} characters long.`)
  }
}

export const createValidateMax = max => str => {
  if (str.length > max) {
    return new Error(`Must be no longer than ${max} characters long.`)
  }
}

export const createValidateNumberMax = max => num => {
  if (Number(num) > max) {
    return new Error(`Must be less than or equal to ${max}.`)
  }
}

export const createNumValidator = ({min, max}: IValidatorzNumberRequirements) => num => {
  num = Number(num)
  if (min && num < min) {
    return [new Error(`Must be greater than or equal to ${min}.`)]
  }
  if (max && num > max) {
    return [new Error(`Must be less than or equal to ${max}.`)]
  }
  return []
}

export const createValidateRegexp = regexp => str => {
  if (!regexp.test(str)) {
    return new Error(`Invalid input.`)
  }
}

const defaultValidateOptions = {
  maxErrors: Infinity,
}

export const createValidator = (requirements: IValidatorzInputRequirements | string) => {
  if (typeof requirements === "string") {
    requirements = presets[requirements]
  }
  requirements = (requirements as IValidatorzInputRequirements)

  const validatorFns = []

  if (requirements.number) {
    return createNumValidator(requirements.number)
  }

  if (requirements.mustContain) {
    validatorFns.push(createMustContainChecker(requirements.mustContain))
  }

  if (requirements.validChars) {
    validatorFns.push(createValidCharsChecker(requirements.validChars))
  }

  if (requirements.min) {
    validatorFns.push(createValidateMin(requirements.min))
  }

  if (requirements.max) {
    validatorFns.push(createValidateMax(requirements.max))
  }

  if (requirements.regexp) {
    const regexp = requirements.regexp instanceof RegExp ? requirements.regexp : new RegExp(requirements.regexp)
    validatorFns.push(createValidateRegexp(regexp))
  }

  return (str: string, options: IValidatorzValidateOptions = defaultValidateOptions): Error[] => {
    const errors = []
    for (const validatorFn of validatorFns) {
      const newError = validatorFn(str)
      if (newError) {
        errors.push(newError)
        if (errors.length > options.maxErrors) {
          break
        }
      }
    }
    return errors
  }
}

function camelToTitle (camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
}

function camelToLower (camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/ ./g, (match) => match.toLowerCase())
    .trim()
}