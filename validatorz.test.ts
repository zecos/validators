import { test, describe, before, after, afterEach, beforeEach } from 'tezt'
import { charHashes, createCharValidator, combineHashes } from './validatorz';
import expect from 'expect'

import * as wasm from './rust/pkg'
wasm.greet()


const testValidator = ({options, input, pass}) => {
  const validator = createCharValidator(options)
  if (pass) {
    expect(validator(input)).toBe(true)
  } else {
    expect(() => {
      validator(input)
    }).toThrow()
  }
}

test('it detects valid chars', () => {
  testValidator({
      options: {
        validChars: "lowercase",
      },
      input: "iurbvqoeiruqe",
      pass: true,
  })
  testValidator({
    options: {
      validChars: "lowercase",
    },
    input: "iuRBVQoeiruqe",
    pass: false,
  })
  testValidator({
    options: {
      validChars: "uppercase",
    },
    input: "IURBVQOEIRUQE",
    pass: true,
  })
  testValidator({
    options: {
      validChars: "uppercase",
    },
    input: "IURBvqoEIRUQE",
    pass: false,
  })
})

test('it detects must contain', () => {
  testValidator({
      options: {
        validChars: ["letters", "symbols", "#! "],
        mustContain: ["#! "]
      },
      input: "a!we #",
      pass: true,
  })
  testValidator({
    options: {
      validChars: ["letters", "symbols", "#! "],
      mustContain: ["#! "]
    },
    input: "awe #",
    pass: false,
  })
})