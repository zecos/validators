import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import { createBinaryHash, getHash, createMustContainChecker, createValidCharsChecker, createValidator } from './validatorz';
import expect from 'expect'

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
  expect(() => createValidCharsChecker("lowercase")("iurbvqoeiruqe")).not.toThrow()
  expect(() => createValidCharsChecker("uppercase")("IURBVQOEIRUQE")).not.toThrow()
  expect(() => createValidCharsChecker("lowercase")("iURBVqoeiruqe")).toThrow()
  expect(() => createValidCharsChecker("uppercase")("iURBVqoeiruqe")).toThrow()
})

test('it detects must contain', () => {
  const mustContain = ["letters", "symbols", "#! "]
  expect(() => {
    createMustContainChecker(mustContain)("a!we #")
  }).not.toThrow()
  expect(() => {
    createMustContainChecker(mustContain)("aweasdqweq$")
  }).toThrow()
})

test('integration all checkers', () => {
  const passwordValidator = createValidator({
    mustContain: ["symbols", "uppercase", "lowercase", "digits"],
    validChars: ["symbols", "alphanumeric"],
    min: 8,
    max: 45,
  })
  expect(() => {
    passwordValidator("Password#1805")
  }).not.toThrow()
  expect(() => {
    passwordValidator("password#1805")
  }).toThrow()
})