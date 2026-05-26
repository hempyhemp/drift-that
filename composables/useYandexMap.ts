export async function useYandexMap() {
  const { data, error } = await useAsyncData('yandex-map-script', () =>
    $fetch('https://api-maps.yandex.ru/2.1/?apikey=f03fd6b4-ce87-4b10-b897-8c3b593eab8b&lang=ru_RU', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/javascript',
      },
    }))

  const isLoaded = ref(false)

  if (data.value) {
    isLoaded.value = true
  }

  console.log(data.value)

  return { data, isLoaded, error }
}
