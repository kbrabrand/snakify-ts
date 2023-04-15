import snakeCase from "lodash.snakecase";

/**
 * @see https://newbedev.com/typescript-convert-generic-object-from-snake-to-camel-case
 */
type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${SnakeCase<U>}`
  : S;

type SnakifyObject<T, S = false> = {
  [K in keyof T as SnakeCase<string & K>]: T[K] extends Array<infer U>
    ? U extends ({} | undefined)
      ? Array<SnakifyObject<U>>
      : T[K]
    : T[K] extends ({} | undefined)
    ? S extends true
      ? T[K]
      : SnakifyObject<T[K]>
    : T[K];
};

export type Snakify<T, S = false> =
  T extends Array<(infer U)>
    ? Array<SnakifyObject<U, S>>
    : SnakifyObject<T, S>;

function walk(obj, shallow = false): any {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj)) return obj.map(v => {
    if (!shallow) { return walk(v) }
    if (typeof v === 'object') return walk(v, shallow)
    return v
  })

  return Object.keys(obj).reduce((res, key) => {
    const camel = snakeCase(key);
    res[camel] = shallow ? obj[key] : walk(obj[key]);
    return res;
  }, {});
}

export default function snakify<T, S extends boolean = false>(
  /**
   * Value to be snakified
   */
  obj: T,

  /**
   * If true, only the top level keys of the obj will be camel cased
   */
  shallow?: S
): T extends String ? string : Snakify<T, S> {
  return typeof obj === "string" ? snakeCase(obj) : walk(obj, shallow);
}