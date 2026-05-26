// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/ionic', 'vue-yandex-maps/nuxt'],
  css: ['~/assets/main.scss'],

  ionic: {
    integrations: {
      icons: true,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/_variables.scss" as *;
        `,
        },
      },
    },
  },
  yandexMaps: {
    apikey: 'f03fd6b4-ce87-4b10-b897-8c3b593eab8b',
    domain: 'https://api.drift-that.ru/map',
    version: 'v3',
    // initializeOn: 'onPluginInit',
  },
})
