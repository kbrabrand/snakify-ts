/* eslint-disable @typescript-eslint/camelcase */

import snakify from "../src";

describe("snakify", () => {
  it("strings", () => {
    expect(snakify("datString")).toBe("dat_string");
  });

  it("does not touch string values in arrays", () => {
    expect(snakify(["datString", "otherString"])).toEqual([
      "datString",
      "otherString",
    ]);
  });

  it('leaves dates and regexp', () => {
    const regExp = new RegExp(/.*/)
    const date = new Date(0)

    expect(snakify({ 
      aKey: 1, 
      b: {
        numbErty: 123,
        datErty: date,
        regexpErty: regExp
      } 
    })).toEqual({ 
      a_key: 1, 
      b: { 
        numb_erty: 123, 
        dat_erty: date,
        regexp_erty: regExp 
      } 
    })
  })

  it("object", () => {
    expect(snakify({ aKey: 1, bKey: 2 })).toEqual({ a_key: 1, b_key: 2 });
  });

  it("nested object", () => {
    expect(snakify({ aKey: { bKey: 2 } })).toEqual({ a_key: { b_key: 2 } });
  });

  it("complex object with arrays and nested values", () => {
    expect(
      snakify({
        aKey: {
          stringsInAList: ["dat_string", "other_string"],
          b: { aKey: 123 },
        },
      })
    ).toEqual({
      a_key: {
        strings_in_a_list: ["dat_string", "other_string"],
        b: { a_key: 123 },
      },
    });
  });

  it("objects nested in array properties", () => {
    const snakified = snakify({
      aKey: {
        aList: [
          {
            aNestedValue: 123,
            aDeeplyNestedObject: {
              aDeeeeeplyNestedValue: "foo",
              aDeeplyNestedObject: {
                aDeeeeeplyNestedValue: "foo",
                aDeeplyNestedObject: {
                  aDeeeeeplyNestedValue: "foo",
                },
              },
            },
          },
        ],
      },
    });

    expect(
      snakified.a_key.a_list[0].a_deeply_nested_object.a_deeply_nested_object
        .a_deeeeeply_nested_value
    ).toEqual("foo");
  });
});
