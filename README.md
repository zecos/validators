### Validatorz

validatorz is...

* a minimalistic data validation checker
* fairly efficient (for js).

### Usage

pass in a list of requirements to the `createValidator` function:

```js
const passwordValidator = createValidator({
  type: "string",
  mustContain: ["symbols", "uppercase", "lowercase", "digits"],
  validChars: ["symbols", "alphanumeric"],
  min: 8,
  max: 45,
})
```

String requirements can have the following properties:

* `mustContain`: Will return error if any of the required character types are not found.
  * `"symbols"`: `!@#$%^&*()_-+=[{]}\\|><.,?/"';:~\``
  * `"uppercase"`: all uppercase letters
  * `"lowercase"`: all lowercase letters
  * `"letters"`: all letters
  o
  * `"digits"`: all digits `[0-9]`
  * `"alphanumeric"`: all digits and letters
  * `"spaces"`: the ` ` character
  * `*` any other character you want represented with a string
    * `"f29c"` would be valid if it contains the characters `f`, `2`, `9`, and `c`
* `validChars`: Will return error if any characters other than the ones specified are found.
  * The list of characters if the same as the ones for `mustContain`
* `min`: the minimum length of the string
* `max`: the maximum length of the string
* `regexp`: a regular expression to test the value

Number requirements can have the following properties:
* `min`: minimum value
* `max`: maximum value

Note that you have to pass the type, either `"number"` or `"string"` to `createValidator`.

If you prefer, you can import `createStringValidator` or `createNumberValidator` intead, and you won't have to specify the type in the object.

Then, you simply pass a string to validate. It will return an array of errors (empty array if no errors).
```js
const passwordValidator = createValidator({
  type: "string",
  mustContain: ["symbols", "uppercase", "lowercase", "digits"],
  validChars: ["symbols", "alphanumeric"],
  min: 8,
  max: 45,
})

passwordValidator("Password#1805") // => [], empty array, there were no errors

passwordValidator("password#1805") // => [Error: Must contain "uppercase"] one of the requirements was "uppercase"
```

### Presets

There are also several presets available to you. You can just pass the name of the preset as a string for the preset you want.

```ts
const emailValidator = createValidator("email")
emailValidator("zwh0t_chcox@gmail.com", []) // empty array, there were no errors
emailValidator("not_an_email_1805", [new Error('Invalid input.')])
```

Here are the following presets and their settings. Please feel free to submit a PR if you think there should be another one.

```ts
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
  // uses the current time/date to set the maximum for date of birth
  dob: () => {
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
```

### Higher Order Functions

You can also pass in a function to `createValidator` that simply creates a validation function.

For instance, this is a version of the `dob` validator:

```ts
const dobValidatorCreator = () => {
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
    return []
  }
}
```

This is useful for functional programming.

### Installation

Yarn:
`yarn add validatorz`

Npm:
`npm i validators`


### Dependencies

None