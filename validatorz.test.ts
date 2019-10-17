import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import {
    createBinaryHash,
    getHash,
    createMustContainChecker,
    createValidCharsChecker,
    createValidator,
} from './validatorz';
import expect from 'expect'

const testValidator = (fn, val, expectedVal, debug?) => {
  expect(
    fn(val)
  ).toEqual(expectedVal)
}

test('create binary hash', () => {
  const mustContain = ["letters", "digits", "uppercase"]
  const binaryHash = mustContain
    .reverse()
    .map(getHash)
    .reduce(createBinaryHash, {})
  expect(binaryHash["Z"]).toBe(0b101)
  expect(binaryHash["1"]).toBe(0b010)
  expect(binaryHash["z"]).toBe(0b100)
  const checkVal = parseInt("1".repeat(mustContain.length), 2)
  expect(binaryHash["Z"] | binaryHash["1"]).toBe(checkVal)
})

test('it detects valid chars', () => {
  const lowercaseChecker = createValidCharsChecker("lowercase")
  const uppercaseChecker = createValidCharsChecker("uppercase")
  testValidator(lowercaseChecker, "ubqoeribuqnerf", undefined)
  testValidator(lowercaseChecker, "ubqoeRIBUQNErf", new Error(`R is not allowed. Only "lowercase" are allowed.`))
  testValidator(uppercaseChecker, "ASDLFJALEKJFQWEK", undefined)
  testValidator(uppercaseChecker, "ubqoeRIBUQNErf", new Error(`u is not allowed. Only "uppercase" are allowed.`))
})

test('it detects must contain', () => {
  const mustContain = ["letters", "symbols", "#! "]
  const mustContainChecker = createMustContainChecker(mustContain)
  testValidator(mustContainChecker, "a!we #", undefined)
  testValidator(mustContainChecker, "aweasdqweq$", new Error(`Must contain "#! "`), true)
})

test('integration all checkers', () => {
  const passwordValidator = createValidator({
    mustContain: ["symbols", "uppercase", "lowercase", "digits"],
    validChars: ["symbols", "alphanumeric"],
    min: 8,
    max: 45,
  })
  testValidator(passwordValidator, "Password#1805", [])
  testValidator(passwordValidator, "passd05", [
    new Error(`Must contain "uppercase" and "symbols"`),
    new Error(`Must be at least 8 characters long.`),
  ])
})

test('use presets', () => {
  const emailValidator = createValidator("email")
  testValidator(emailValidator, "zwhit_chcox@gmail.com", [])
  testValidator(emailValidator, "password#1805", [new Error('Invalid input.')])
})

test('digits', () => {
  const numberValidator = createValidator({
    number: {
      min: 3,
      max: 9,
    }
  })

  testValidator(numberValidator, 3, [])
  testValidator(numberValidator, 1, [new Error("Must be greater than or equal to 3.")])
  testValidator(numberValidator, 10, [new Error("Must be less than or equal to 9.")])
})