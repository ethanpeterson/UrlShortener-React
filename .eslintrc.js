module.exports = {
	"extends": ["eslint:recommended", "plugin:react/recommended"],
    "parser": "babel-eslint",
	"parserOptions": {
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		},
		"sourceType": "module"
	},
	"plugins": [
		"react"	
	],
    "env": {
        "amd": true,
        "browser": true,
		"commonjs": true,
        "es6": true,
        "node": true,
        "jquery": true
    },
    "rules": {
        "eqeqeq": 2,
		"comma-dangle": 1,
        "no-console": 0,
		"no-debugger": 1,
		"no-extra-semi": 1,
		"no-extra-parens": 1,
		"no-unused-vars": 1,
		
        "quotes": [2, "single"],
        "eol-last": 0,
        "no-use-before-define": [2, { "functions": true, "classes": true }],
        "indent": ["error", "tab"],
        "one-var": ["error", "always"],
        "semi": ["error", "always"],
		
		"react/display-name": 2
    }
};