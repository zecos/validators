### Validatorz

validatorz is...

* a minimalistic data validation checker
* fairly efficient (for js).

### Usage

pass in a list of requirements to the `createValidator` function:

```js
const passwordValidator = createValidator({
  mustContain: ["symbols", "uppercase", "lowercase", "digits"],
  validChars: ["symbols", "alphanumeric"],
  min: 8,
  max: 45,
})
```

Requirements can have the properties

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
* `number`: an object with minimum and maximum values of a number
  * can't be used in conjunction with the string values (obviously)
  * `min`: minimum value
  * `max`: maximum value
* `regexp`: a regular expression to test the value

Then, you simply pass a string to validate. It will return an array of errors (empty array if no errors).
```js
const passwordValidator = createValidator({
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

Here are the following presets and their settings. Please feel free to submit a PR if you think there should be another one.

```ts
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
```

### Installation

Yarn:
`yarn add validatorz`

Npm:
`npm i validators`


### Dependencies

None