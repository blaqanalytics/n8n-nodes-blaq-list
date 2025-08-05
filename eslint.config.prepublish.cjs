const baseConfig = require('./eslint.config.cjs');
const n8nNodesBase = require('eslint-plugin-n8n-nodes-base');
const jsonParser = require('jsonc-eslint-parser');

module.exports = [
	...baseConfig,
	{
		files: ['package.json'],
		languageOptions: {
			parser: jsonParser,
		},
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.community.rules,
			'n8n-nodes-base/community-package-json-name-still-default': 'error',
		},
	},
];