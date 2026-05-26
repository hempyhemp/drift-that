import type { Location } from '@capacitor-community/background-geolocation'
import type { Ref } from 'vue'
import { useAuth } from '#build/imports'
import { ref } from 'vue'

interface TLocation {
  x: number
  y: number
}

export interface PosData {
  uid: string
  location: TLocation
  name: string
  car?: string
}

export function useLocation(shareLocation: Ref<boolean> = ref(false)) {
  const mobileLocation = useLocate()
  const interval = ref<NodeJS.Timeout | undefined>(undefined)

  const { user } = useAuth()
  const { menu } = useMenu()

  const deviceId = user.value?.uid
  // const locations = ref<PosData[] | undefined>()

  const getBrowserLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              simulated: false, // Simulated property is usually false in a browser environment
              bearing: null, // Browsers typically don't provide bearing, so you can set it to null
              speed: position.coords.speed ?? null,
              time: position.timestamp,
            }
            resolve(location)
          },
          (error) => {
            reject(error)
          },
        )
      }
      else {
        reject(new Error('Geolocation not available'))
      }
    })
  }

  const location = ref()

  watch(mobileLocation, async (ml) => {
    if (!ml) {
      location.value = await getBrowserLocation()
    }
    else {
      location.value = ml
    }
  }, {
    immediate: true,
  })

  const sendLocation = async () => {
    try {
      if (!shareLocation.value || !location.value || !deviceId) {
        console.warn(`Не делимся позицией`)
        return
      }

      await $api(`/location`, {
        method: 'POST',
        body: {
          uid: deviceId,
          location: { x: location.value!.latitude, y: location.value!.longitude },
        },
      })
    }
    catch (error) {
      console.error('Ошибка запроса:', error)
    }
  }

  const { data: locations, refresh: refreshLocations } = useAsyncData(
    'locations',
    async () => {
      if (deviceId) {
        const result: PosData[] = await $api('/locations')
        menu.value.population = result.length
        return result
      }
      else {
        return Promise.resolve(undefined)
      }
    },
  )

  onMounted(() => {
    sendLocation()

    interval.value = setInterval(async () => {
      await sendLocation()
      await refreshLocations()
    }, 5000)
  })

  onUnmounted(() => {
    if (interval.value) {
      clearInterval(interval.value)
    }
  })

  return { location, locations }
}
