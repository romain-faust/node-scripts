# @romain-faust/node-scripts

Set of scripts for [Node.js](https://nodejs.org).

## Installation

_With NPM:_

```bash
npm install --save-dev @romain-faust/node-scripts
```

_With Yarn:_

```bash
yarn add --dev @romain-faust/node-scripts
```

## Usage

In the `scripts` section of your `package.json`:

```json
{
	"scripts": {
		"build": "node-scripts build sources",
		"format": "node-scripts format sources",
		"start": "node-scripts start sources/index.ts",
		"test": "node-scripts test"
	}
}
```

To have the complete list of available scripts with their options:

```bash
node-scripts --help
node-scripts build --help
```

## License

[MIT](./license.md)
