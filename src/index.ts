import snakeCase from "lodash.snakecase";

/**
 * @see https://newbedev.com/typescript-convert-generic-object-from-snake-to-camel-case
 */
type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${SnakeCase<U>}`
  : S;

export type Snakify<T> = {
  [K in keyof T as SnakeCase<string & K>]: T[K] extends Array<infer U>
    ? U extends ({} | undefined)
      ? Array<Snakify<U>>
      : T[K]
    : T[K] extends ({} | undefined)
    ? Snakify<T[K]>
    : T[K];
};

function walk(obj): any {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj)) return obj.map(walk);

  return Object.keys(obj).reduce((res, key) => {
    const camel = snakeCase(key);
    res[camel] = walk(obj[key]);
    return res;
  }, {});
}

export default function snakify<T>(
  obj: T
): T extends String ? string : Snakify<T> {
  return typeof obj === "string" ? snakeCase(obj) : walk(obj);
}