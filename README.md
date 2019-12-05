### Validators

`validators` is...

* a minimalistic data validation checker
* fairly efficient (for js).

### Usage

Pass in a list of requirements to the `createStringValidator` or `createNumberValidator` function:

```ts
const passwordValidator = createStringValidator({
  mustContain: ["symbols", "uppercase", "lowercase", "digits"],
  validChars: ["symbols", "alphanumeric"],
  min: 8,
  max: 45,
})
```

`createStringValidator` requirements can have the following properties:

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

`createNumberValidator` requirements can have the following properties:
* `min`: minimum value
* `max`: maximum value

`createOneOfValidator` requirements can have the following properties:
* `options`: array of valid values


Then, you simply pass a string to validate. It will return an array of errors (empty array if no errors).
```js
const passwordValidator = createStringValidator({
  mustContain: ["symbols", "uppercase", "lowercase", "digits"],
  validChars: ["symbols", "alphanumeric"],
  min: 8,
  max: 45,
})

passwordValidator("Password#1805") // => [], empty array, there were no errors

passwordValidator("password#1805") // => [Error: Must contain "uppercase"] one of the requirements was "uppercase"
```

`createNumberValidator` works the same way:


```ts
const ageValidator = createNumberValidator({
  min: 18,
  max: 80,
})

// Number validators also except strings which can be converted to numbers
passwordValidator("19") // => [], empty array, there were no errors.

passwordValidator(3) // => [Error: Must be greater than or equal to 3.]
```

`createOneOfValidator` verifies the value is in the list given in `options`:

```ts
const fruitValidator = createOneOfValidator({options: ["apples", "oranges", "bananas"]})

fruitValidator("oranges") // => [], empty array, there were no errors.
fruitValidator("peanuts") // => [Error: "Must be apples, oranges, or bananas."]
```

### Preset Validators

`validators` also comes with some preset validators. Please open an issue/pr if there are more that you need.

```ts
export const nameValidator = createStringValidator({
  min: 1,
  max: 40,
  validChars: ["letters", "., "],
})
export const ageValidator = createNumberValidator({
  min: 0,
  max: 120,
})
export const usernameValidator = createStringValidator({
  min: 3,
  max: 40,
  validChars: ["letters", "digits", "_-"]
})
export const phoneValidator = createStringValidator({
  min: 10,
  max: 10,
  validChars: ["digits"],
})
export const passwordValidator = createStringValidator({
  mustContain: ["digits", "lowercase", "uppercase", "symbols"],
  min: 8,
  max: 100,
})
export const emailValidator = createStringValidator({
  regexp: "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
})
export const einValidator = createStringValidator({
  regexp: "^[1-9]\\d?-\\d{7}$",
})

// sets the maximum dob as the current time, in case the subject were just born.
export const dobValidator = () => {
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

### Installation

Yarn:
`yarn add validators`

Npm:
`npm i validators`


### Dependencies

None
