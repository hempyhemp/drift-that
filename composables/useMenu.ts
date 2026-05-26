import { StorageSerializers, useLocalStorage } from '@vueuse/core'

export interface Menu {
  shareLocation: boolean
  currentPage: string
  trackLocation: boolean
  population: number
  inChat: boolean
  acceptAgreement: boolean
  sawInstructions: boolean
}

export default function () {
  const menu = useLocalStorage<Menu>(
    'menu',
    {
      shareLocation: false,
      currentPage: '/',
      trackLocation: false,
      population: 0,
      inChat: false,
      acceptAgreement: false,
      sawInstructions: false,
    },
    { serializer: StorageSerializers.object },
  )

  onIonViewWillEnter(() => {
    menu.value.inChat = false
  })

  return { menu }
}
