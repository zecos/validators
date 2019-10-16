### Validatorz

validatorz is...

* a project created by me to solve the simple problem of validation.
* extremely efficient (for js).
* extremely simple to use:

  ```js
  const passwordValidator = createValidator({
    mustContain: ["symbols", "uppercase", "lowercase", "digits"],
    validChars: ["symbols", "alphanumeric"],
    min: 8,
    max: 45,
  })

  // valid password
  passwordValidator("Password#1805")

  // throws error
  passwordValidator("password#1805")
  ```

### Installation

Yarn:
`yarn add validatorz`

Npm:
`npm i validators`


### Dependencies

None