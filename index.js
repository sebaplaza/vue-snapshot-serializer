const prettier = require("prettier");

const stringify = (obj) => JSON.stringify(obj, 0, 2);

// Stringify all vue props, data, computed to display them instead in snapshots
module.exports = {
	test(value) {
		const isVue = value?.vm?._isVue;
		return isVue;
	},
	serialize(value) {
		const { $props, $data } = value.vm;
		const computedKeys = Object.keys(value.vm._computedWatchers || {});
		const $computed = computedKeys.reduce((prev, curr) => {
			prev[curr] = value.vm[curr];
			return prev;
		}, {});

		const html = value.html();
		const props = `<pre id="props-snapshot">${stringify($props)}</pre>`;
		const data = `<pre id="data-snapshot">${stringify($data)}</pre>`;
		const computed = `<pre id="computed-snapshot">${stringify(
			$computed
		)}</pre>`;
		const concatenated = [html, props, data, computed].join("\n");
		const prettyfied = prettier.format(concatenated, { parser: "html" });
		return prettyfied;
	},
};
