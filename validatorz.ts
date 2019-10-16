import { presets } from './validator-presets'

export type ICharValidatorOptions = {
  mustContain?: string[] | string,
  validChars?: string[] | string,
  min?: number,
  max?: number,
  regexp?: RegExp | string,
}

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

const checkValidChar = (validChars, char) => {
}


export const createBinaryHash = (acc, cur, idx) => {
  const binaryRepresentation = (1 << idx)
  for (const char in cur) {
    acc[char] = (acc[char] || 0) | binaryRepresentation
  }
  return acc
}

export const surroundQuotes = str => `"${str}"`

export const createMustContainChecker = mustContain => {
  const binaryHash = [].concat(mustContain)
    .map(getHash)
    .reduce(createBinaryHash, {})
  const checkVal = parseInt("1".repeat(mustContain.length), 2)
  return str => {
    let curVal = 0
    for (const char of str) {
      if ((curVal |= binaryHash[char]) === checkVal) {
        return true
      }
    }
    // reached the end without finding all "must contain" characters
    throw new Error(`Must contain ${getHumanList(mustContain.map(surroundQuotes))}`)
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
        throw new Error(char + errorMessageTail)
      }
    }
  }
}

export const createValidateMin = min => str => {
  if (str.length < min) {
    throw new Error(`Must be at least ${min} characters long.`)
  }
}

export const createValidateMax = max => str => {
  if (str.length > max) {
    throw new Error(`Must be no longer than ${max} characters long.`)
  }
}

export const createValidateRegexp = regexp => str => {
  if (!regexp.test(str)) {
    throw new Error(`Invalid input.`)
  }
}

export const createValidator = (options: ICharValidatorOptions) => {
  const validatorFns = []

  if (options.mustContain) {
    validatorFns.push(createMustContainChecker(options.mustContain))
  }

  if (options.validChars) {
    validatorFns.push(createValidCharsChecker(options.validChars))
  }

  if (options.min) {
    validatorFns.push(createValidateMin(options.min))
  }

  if (options.max) {
    validatorFns.push(createValidateMax(options.max))
  }

  if (options.regexp) {
    const regexp = options.regexp instanceof RegExp ? options.regexp : new RegExp(options.regexp)
    validatorFns.push(createValidateRegexp(regexp))
  }

  return str => {
    for (const validatorFn of validatorFns) {
      validatorFn(str)
    }
  }
}

function camelToTitle (camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
}