# snakify-ts

[![CI](https://github.com/kbrabrand/snakify-ts/actions/workflows/main.yml/badge.svg)](https://github.com/kbrabrand/snakify-ts/actions/workflows/main.yml)

A typescript typed snake_case function that recursively snake cases a camel cased object structure. It snake cases a simple string too, if you need that.

`snakify-ts` is [`camelize-ts`](https://www.npmjs.com/package/camelize-ts)’ twin 👯.

## Why do this again?

This has obviously been done before, and the "new" thing with this pacakge is not snake casing itself but the fact that it is a generic that, given the form of the input data structure, will provide you with typing for the returned object structure so that it fits with other types.

As an example we've been using it to prepare data for requests to an API that expects snake cased parameter names while at the same time avoiding the snake case stuff from leaking into our React frontend.

## Example

```ts
import snakify from 'snakify-ts'

// Expects snake case
function postIt({
  first_name,
  last_name
}: {
  id: number,
  first_name: string,
  last_name: string,
  roles: string[]
}) { return `${first_name} ${last_name}` }

// snake case stuff before posting to API
const snakifiedUser = snakify({
  id: 1,
  firstName: 'Grim',
  lastName: 'Reaper',
  roles: ['user', 'admin']
})

console.log(JSON.stringify(snakifiedUser, null, 2))
console.log(postIt(snakifiedUser)
```

output:

```sh
{
  "id": 1,
  "first_name": "Grim",
  "last_name": "Reaper",
  "roles": [
    "user",
    "admin"
  ]
}

Grim Reaper
```

### Shallow option
By default snakify will traverse to the bottom of the object/array structure you pass. If you want to perform a shallow snakify, touching only the top level of the value you can pass true for the `shallow` option (second argument).

### Type inference
You don't need to pass a type to `snakify` since it uses argument inference to find the type to convert. But if you need to, you can pass a type like this:

```ts
snakify<
  // type of value to snakify
  { first_name: string },

  // whether or not to perform shallow snakification
  true
>(
  // value to snakify, type must match the specified type
  value,

  // shallow, must match what's set as the second type argument above (after the type)
  true
)
```

#### Type conversion
If you need to convert just a type, you can use the `Snakify` generic type to do this:

```ts
import { Snakify } from 'snakify-ts'

type MyCamelPerson = { firstName: string }
type MySnakePerson = Snakify<MyCamelPerson>
```

## Running tests

```sh
npm run test // one time/CI
npm run test:watch // on each file change
```

## Licence

MIT
