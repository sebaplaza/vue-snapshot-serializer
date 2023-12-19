const prettier = require("prettier");
const { default: safeStringify } = require("fast-safe-stringify");

/**
 * Stringify an object, manages circular deps
 * @param {object} obj any object
 * @returns
 */
const stringify = (obj) => safeStringify.stableStringify(obj);

/**
 * Stringify and prettify an object
 * @param {object} obj any object
 * @returns {Promise<string>} prettified string
 */
const prettyJsonString = async (obj = {}) => {
  return prettier.format(stringify(obj), { parser: "json" });
};

// Stringify all vue props, data, computed to display them instead in snapshots
module.exports = {
  test(value) {
    // we must check if we are dealing with a vue content
    const isVue = value?.vm?._isVue;
    return !!isVue;
  },
  async serialize(value) {
    const { $props, $data } = value.vm;
    const computedKeys = Object.keys(value.vm._computedWatchers || {});
    const $computed = computedKeys.reduce((prev, curr) => {
      prev[curr] = value.vm[curr];
      return prev;
    }, {});

    const html = value.html();

    const [props, data, computed] = await Promise.all([
      prettyJsonString($props),
      prettyJsonString($data),
      prettyJsonString($computed),
    ]);

    const content = [
      `<pre id="props-snapshot">${props}</pre>`,
      `<pre id="data-snapshot">${data}</pre>`,
      `<pre id="computed-snapshot">${computed}</pre>`,
    ];

    const concatenated = [html, content.join("\n")].join("\n");
    const prettyfied = prettier.format(concatenated, { parser: "html" });
    return prettyfied;
  },
};
