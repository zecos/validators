import { IValidatorzPresets } from './types'

export const presets = {
  name: {
    min: 1,
    max: 40,
    validChars: ["letters", "., "],
  },
  age: {
    number: {
      min: 0,
      max: 120,
    }
  },
  username: {
    min: 3,
    max: 40,
    validChars: ["letters", "digits", "_-"]
  },
  phone: {
    min: 10,
    max: 10,
    validChars: ["digits"],
  },
  password: {
    mustContain: ["digits", "lowercase", "uppercase", "symbols"],
    min: 8,
    max: 100,
  },
  email: {
    regexp: "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
  },
  ein: {
    regexp: "^[1-9]\\d?-\\d{7}$",
  }
}
