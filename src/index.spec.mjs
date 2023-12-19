import { describe, it, expect } from "vitest";
import * as serializer from ".";

describe("vue-snapshot-serialize", () => {
  describe("test function", () => {
    it("should not serialize when vue is not detected", () => {
      expect(serializer.test({ aProp: "aValue" })).toBe(false);
    });
    it("should not serialize when vue is false (impossible case)", () => {
      expect(serializer.test({ vm: { _isVue: false } })).toBe(false);
    });
    it("should detect vue", () => {
      expect(serializer.test({ vm: { _isVue: true } })).toBe(true);
    });
  });
  describe("serialize function", () => {
    it("should serialize empty vm", async () => {
      const value = {
        vm: {},
        html: () => `<html></html>`,
      };
      const serialized = await serializer.serialize(value);
      expect(serialized.split("\n")).toEqual([
        "<html></html>",
        '<pre id="props-snapshot">',
        "{}",
        "</pre>",
        '<pre id="data-snapshot">',
        "{}",
        "</pre>",
        '<pre id="computed-snapshot">',
        "{}",
        "</pre>",
        "",
      ]);
    });
    it("should serialize vm", async () => {
      const value = {
        vm: {
          $props: {
            aNumberProp: 23,
          },
          $data: {
            aBooleanProp: false,
          },
          _computedWatchers: {
            aComputedProp1: true,
            aComputedProp2: true,
          },
          aComputedProp1: "aComputedValue1",
          aComputedProp2: "aComputedValue2",
        },
        html: () => `<html></html>`,
      };
      const serialized = await serializer.serialize(value);
      // splitted is easier to assert
      expect(serialized.split("\n")).toEqual([
        "<html></html>",
        '<pre id="props-snapshot">',
        '{ "aNumberProp": 23 }',
        "</pre>",
        '<pre id="data-snapshot">',
        '{ "aBooleanProp": false }',
        "</pre>",
        '<pre id="computed-snapshot">',
        '{ "aComputedProp1": "aComputedValue1", "aComputedProp2": "aComputedValue2" }',
        "</pre>",
        "",
      ]);
    });
    it("should manage circular deps", async () => {
      const value = {
        vm: {
          $props: {
            person: {
              name: "myName",
              age: 42,
            },
          },
        },
        html: () => `<html></html>`,
      };

      // force circular dependency
      value.vm.$props.person.myself = value.vm.$props.person;

      const serialized = await serializer.serialize(value);
      // splitted is easier to assert
      expect(serialized.split("\n")).toEqual([
        '<html></html>',
        '<pre id="props-snapshot">',
        '{ "person": { "age": 42, "myself": "[Circular]", "name": "myName" } }',
        '</pre>',
        '<pre id="data-snapshot">',
        '{}',
        '</pre>',
        '<pre id="computed-snapshot">',
        '{}',
        '</pre>',
        ''
      ]);
    });
  });
});
