import { Device } from '@capacitor/device'
import useMenu from '~/composables/useMenu'

export default defineNuxtRouteMiddleware(async (to) => {
  const router = useIonRouter()
  const { user } = useAuth()
  const { menu } = useMenu()

  menu.value.currentPage = to.path

  if (!user.value) {
    const info = await Device.getId()
    const uid = info.identifier

    try {
      user.value = await $api(`/login?uid=${uid}`)
      console.log('auth', user.value)
    }
    catch {
    }
  }

  if (to.path === '/register' && !!user.value) {
    router.push('/')
  }

  if (!user.value && to.path !== '/register') {
    router.push('/register')
  }
})
