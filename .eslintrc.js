module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended', 'plugin:jsdoc/recommended', 'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        'jsdoc', '@typescript-eslint'
    ],
    'rules': {
        'camelcase': [
            'warn', {
                'properties': 'always'
            }
        ],

        'comma-dangle': [
            'error', {
                'arrays': 'never',
                'objects': 'never',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never'
            }
        ],

        'indent': [
            'error', 4, {
                'SwitchCase': 1
            }
        ],

        'operator-linebreak': [
            'error', 'before'
        ],

        'quotes': [
            'error', 'single'
        ],

        'semi': [
            'error', 'never'
        ],

        'object-curly-spacing': [
            'error', 'always', {
                'arraysInObjects': false,
                'objectsInObjects': false
            }
        ],

        'array-bracket-spacing': [
            'error', 'never', {
                'arraysInArrays': false,
                'objectsInArrays': false,
                'singleValue': false
            }
        ],

        'space-infix-ops': [
            'error', {
                'int32Hint': false
            }
        ],

        'keyword-spacing': ['error'],

        'no-multi-spaces': [
            'error', {
                exceptions: {
                    'ImportDeclaration': true
                }
            }
        ],

        'space-before-blocks': [
            'error', {
                'functions': 'always',
                'keywords': 'always',
                'classes': 'always'
            }
        ],

        'jsdoc/newline-after-description': [
            'error' | 'warn',
            'never'
        ],

        'brace-style': 'error',

        'curly': 'error',

        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return'
            },
            {
                blankLine: 'always',
                prev: [
                    'const', 'let', 'var'
                ],
                next: '*'
            },
            {
                blankLine: 'any',
                prev: [
                    'const', 'let', 'var'
                ],
                next: ['const', 'let', 'var']
            }, {
                blankLine: 'always',
                prev: 'directive',
                next: '*'
            }, {
                blankLine: 'any',
                prev: 'directive',
                next: 'directive'
            }, {
                blankLine: 'always',
                prev: [
                    'case', 'default'
                ],
                next: '*'
            }, {
                blankLine: 'always',
                prev: '*',
                next: ['break', 'continue']
            }, {
                blankLine: 'always',
                prev: [
                    'function',
                    'if',
                    'while',
                    'for',
                    'block-like',
                    'multiline-block-like',
                    'block'
                ],
                next: '*'
            }, {
                blankLine: 'always',
                prev: '*',
                next: [
                    'function',
                    'if',
                    'while',
                    'for',
                    'block-like',
                    'multiline-block-like',
                    'block'
                ]
            }
        ],

        'no-fallthrough': [
            'error', {
                'commentPattern': 'break[\\s\\w]*omitted'
            }
        ]
    }
}
