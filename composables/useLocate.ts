import type { Location } from '@capacitor-community/background-geolocation'
import { createSharedComposable } from '@vueuse/core'

const useLocate = createSharedComposable(() => {
  return useState<Location | undefined>('location')
})

export default useLocate
