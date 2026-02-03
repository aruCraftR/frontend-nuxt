// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierConfig from 'eslint-config-prettier';

export default withNuxt(
  rules: {
    'indent': ['error', 4, { "SwitchCase": 1 }],
    'vue/html-indent': ['error', 4],
    'vue/script-indent': ['error', 4, { "baseIndent": 1 }]
  },
  prettierConfig
)
