import { createSharedComposable, StorageSerializers, useLocalStorage } from '@vueuse/core'

export interface User {
  id: number
  name: string
  uid: string
  car?: string
}

const useAuth = createSharedComposable(() => {
  const user = useLocalStorage<User | undefined>('user', undefined, { serializer: StorageSerializers.object })

  return {
    user,
  }
})

export default useAuth
