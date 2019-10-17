import { IValidatorzPresets } from './types'
import { createStringValidator, createNumberValidator } from './validatorz';

export const presets = {
  name: createStringValidator({
    min: 1,
    max: 40,
    validChars: ["letters", "., "],
  }),
  age: createNumberValidator({
    min: 0,
    max: 120,
  }),
  username: createStringValidator({
    min: 3,
    max: 40,
    validChars: ["letters", "digits", "_-"]
  }),
  phone: createStringValidator({
    min: 10,
    max: 10,
    validChars: ["digits"],
  }),
  password: createStringValidator({
    mustContain: ["digits", "lowercase", "uppercase", "symbols"],
    min: 8,
    max: 100,
  }),
  email: createStringValidator({
    regexp: "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
  }),
  ein: createStringValidator({
    regexp: "^[1-9]\\d?-\\d{7}$",
  }),
  birthDate: () => {
    const min = new Date(1900, 1, 0)
    return date => {
      if (!(date instanceof Date)) {
        try {
          date = new Date(date)
        } catch (e) {
          return [new Error(`Could not convert ${date} into a date`)]
        }
      }
      if (date < min) {
        return [new Error("Date of birth cannot be before January 1, 1900")]
      }
      if (date > new Date) {
        return [new Error("Date of birth cannot be in the future.")]
      }
    }
  },
}
