import { has } from 'lodash';
import { presets } from './validator-presets'
import _ from 'lodash'

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
const alphabetUpper = alphabetLower.toUpperCase()
const alphabetAll = alphabetLower + alphabetUpper
const digits = '0123456789'
const symbols = `!@#$%^&*()_-+=[{]}\\|><.,?/"';:~\``

const charsToHash = chars => chars
  .split('')
  .reduce((prev, cur) => {
    prev[cur] = true
    return prev
  }, {})

const getHash = str => charHashes[str] ? charHashes[str] : charsToHash(str)

export const combineHashes = (...hashes) => hashes.reduce((prev, cur) => ({...prev, ...getHash(cur)}), {})

// function _ch([prev, cur]) {
//   return {...prev, ...getHash(cur)}
// }

export const charHashes = {
  letters: charsToHash(alphabetAll),
  lowercase: charsToHash(alphabetLower),
  uppercase: charsToHash(alphabetUpper),
  digits: charsToHash(digits),
  symbols: charsToHash(symbols),
  spaces: charsToHash(" ")
}

const getConjunctionList = (arr, conjunction = "and") => [arr.slice(0, -1).join(', '), arr.slice(-1)[0]]
  .join(arr.length < 2 ? '' : arr.length < 3 ? ` ${conjunction} ` : `, ${conjunction} `)

const checkValidChar = (validChars, char) => {
  if (!validChars[char]) {
    throw new Error(`${char} is not allowed. Only ` +
      `${getConjunctionList(Object.keys(validChars), "or")}`)
  }
}

type ICharValidatorOptions = {
  mustContain?: string[],
  validChars?: string[] | string,
}

// package and sell (distribute in its own npm package)
 export function createCharValidator(options: ICharValidatorOptions) {
  const {mustContain, validChars} = options
  if (!(mustContain || validChars)) {
    throw new Error("Your validator must be an object that contains `mustContain` or `validChars.")
  }
  let validCharsCombined;
  if (validChars) {
    const validCharsArr = [].concat(validChars)
    validCharsCombined = combineHashes(...validCharsArr)
  }
  let contained;
  let checkMustContain;
  let containedFound = 0
  let mustContainDone;
  if (mustContain) {
    contained = _.cloneDeep(mustContain)
    const totalMustContain = Object.keys(mustContain).length
    const reverseMustContainHash = getReverseMustContainHash(contained)
    checkMustContain = char => {
      if (mustContainDone) return
      if (reverseMustContainHash[char]) {
        reverseMustContainHash[char].forEach(hashName => {
          if (!contained[hashName]) {
            contained[hashName] = true
            containedFound++
            if (containedFound >= totalMustContain) {
              mustContainDone = true
            }
          }
        })
      }
    }
  }

  if (validCharsCombined && mustContain) {
    return str => {
      for (const x of str) {
        checkValidChar(validCharsCombined, x)
        checkMustContain(x)
      }
      if (!mustContainDone) {
        throw new Error(`Must contain ${getConjunctionList(Object.keys(mustContain))}`)
      }
      return true
    }
  } else if (validCharsCombined) {
    return str => {
      for (const char of str) {
        checkValidChar(validCharsCombined, char)
      }
      return true
    }
  }
  return str => {
    for (const x of str) {
      checkMustContain(x)
      if (mustContainDone) {
        return true
      }
    }
    throw new Error(`Must contain ${getConjunctionList(Object.keys(mustContain))}`)
  }
}

function getReverseMustContainHash(mustContain) {
  const reverseMustContainHash = {}
  for (const str of mustContain) {
    const strHash = getHash(str)
    for (const char in strHash) {
      if (Array.isArray(reverseMustContainHash[char])) {
        reverseMustContainHash[char].push(str)
      } else {
        reverseMustContainHash[char] =[str]
      }
    }
  }
  return reverseMustContainHash
}

// export const moderatorPrivileges = {
//   EDIT_MODERATORS: 'Edit Moderators',
// }

// // export const validators = (() => {
// //   const validators = {}
// //   for (const sdlType in properties) {
// //     validators[sdlType] = createValidators(properties[sdlType])
// //   }
// //   return validators
// // })()

// export interface ITypeValidators {
//   [key: string]: ITypeValidator
// }

// export interface ITypeValidator {
//   [key: string]: PropertyValidator
// }

// export type PropertyValidator = (input: any, isUpdate: boolean) => boolean

// export function createValidators(typeMap: ITypeProperties): ITypeValidators {
//   return Object.entries(typeMap).reduce((result, [typeName, obj]: [string, IObjResult]): any => {
//     result[typeName] = createValidatorsForType(obj)
//     return result
//   }, {})
// }


// export function createValidatorsForType(obj: IObjResult): ITypeValidator {
//   return Object.entries(obj.fields)
//     .reduce((fieldsResult, [fieldName, field]: [string, IFieldResult]): any => {
//       if (field.validation) {
//         fieldsResult[fieldName] = createValidatorForField(field, fieldName)
//       }
//       return fieldsResult
//     }, {})
// }

// export function createValidatorForField(field, fieldName): PropertyValidator {
//   if (presets[field.validation.preset]) {
//     return createValidatorForField({
//       ...presets[field.validation.preset],
//       ...({
//         ...field,
//         validation: _.omit(field.validation, 'preset')
//       })
//     }, fieldName)
//   }
//   const requirements = JSON.parse(JSON.stringify(field))
//   if (requirements.validChars) {
//     requirements.validChars = createCharValidator(requirements.validChars)
//   }
//   if (!requirements.label) {
//     requirements.label = camelToTitle(fieldName)
//   }
//   if (requirements.regexp) {
//     const regexp = new RegExp(requirements.regexp)
//     return (input): boolean => {
//       if (!regexp.test(input)) {
//         throw new Error(`${input} is not valid input for ${fieldName}.`)
//       }
//       return true
//     }
//   }
//   return (input) => validateInput(fieldName, requirements, input)
// }

// function validateInput(fieldName: string, requirements, input) {
//   if (requirements.min) {
//     if (input.length < requirements.min)
//       throw new Error(`${fieldName} must be at least ${requirements.min} characters.`)
//   }
//   if (requirements.max) {
//     if (input.length > requirements.max)
//       throw new Error(`${requirements.label || fieldName} must be a maximum of ${requirements.max} characters.`)
//   }
//   if (requirements.regexp) {
//     if (!requirements.regexp.test(input))
//       throw new Error(`Sorry, ${input} is not valid for ${fieldName}`)
//   }

//   if (requirements.mustContain) {
//     const mustContain = Object.assign({}, requirements.mustContain)
//     for (const char of input) {
//       for (const mustContainKey in mustContain) {
//         // if (char in charTypes[mustContainKey])
//         //   delete mustContain[mustContainKey]
//       }
//       if (has(requirements, "validChars.validChars") && !(char in requirements.validChars.validChars))  {
//         throw new Error(`${char} is not a valid character. ${fieldName} ${requirements.errorDescription}`)
//       }
//     }
//     const mustContainKeys = Object.keys(mustContain)
//     if (mustContainKeys.length) {
//       throw new Error(`${fieldName} must contain ${mustContainKeys.join(', ')}`)
//     }
//   } else if (has(requirements, "validChars.validChars"))  {
//     for (const char of input) {
//       if (!(char in requirements.validChars.validChars))  {
//         throw new Error(`${char} is not a valid character. ${fieldName} ${requirements.validChars.errorDescription}`)
//       }
//     }
//   }
//   return true
// }

// function arrayToList(array){
//   return array
//     .join(", ")
//     .replace(/, ((?:.(?!, ))+)$/, ' and $1');
// }

function camelToTitle (camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
}