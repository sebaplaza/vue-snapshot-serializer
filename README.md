# vue-snapshot-serializer

vuejs snapshot serializer. with props, data and computed support

## How to

```sh
# prettier is a requirement
npm add -D vue-snapshot-serializer prettier
```

In your jest/vitest config

```js
"snapshotSerializers": [
  "<rootDir>/node_modules/vue-snapshot-serializer"
]
```

## How it looks like ?

A snapshot is **just a string**. We use to make snapshots of DOM (html string), but we could print whatever we want

I decided that is better to show the html, props, data and computed properties in differents sections of html.

- At first we always have the html Snapshot
- Then, the following sections
  - `<pre id="props-snapshot">`
  - `<pre id="data-snapshot">`
  - `<pre id="computed-snapshot">`

Everything is formatted by [prettier](https://prettier.io/), to avoid wrong diff results.

So, a typical snapshot with this library will be something like

```html
// Jest Snapshot v1, https://goo.gl/fbAQLP `; exports[`path/to/my/component/file
This is the description of my test`] = `
<div class="my-div">
	<div class="my-inner-div">
		<span>This is my message</span>
		<my-component
			first-prop="value-of-first-prop"
			second-prop="[Object object]"
		></my-component>
	</div>
</div>
<pre id="props-snapshot">
{
  "fooProp": "abcd123",
  "barProp": false
}
</pre>
<pre id="data-snapshot">
{
  "fooData": {
    "fooInnerDataNumber: 23,
    "fooInnerDataString: "i am a string"
  }
}
</pre>
<pre id="computed-snapshot">
{
  "fooComputed" : {
    fooValue: 444
  }
}
}
</pre>
```
