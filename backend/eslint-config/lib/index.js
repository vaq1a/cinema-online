const rules = require('./rules')
const overrides = require('./overrides')

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2021,
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	env: {
		es2021: true,
		node: true,
	},
	plugins: [
        'simple-import-sort',
		'import',
		'promise',
		'react',
		'@typescript-eslint',
	],
	settings: {
		react: {
			version: '17',
		},
		linkComponents: [
			'Link',
		],
	},
	globals: {
		document: 'readonly',
		navigator: 'readonly',
		window: 'readonly',
	},
	rules,
	overrides,
}
