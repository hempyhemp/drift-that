import antfu from '@antfu/eslint-config'

export default antfu({
  overrides: [
    {
      files: ['*.vue'],
    },
  ],

  rules: {
    'no-console': 0,
    'vue/no-deprecated-slot-attribute': 0, // Отключаем это правило
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
  },
})
