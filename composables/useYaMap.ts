import type { Location } from '@capacitor-community/background-geolocation'
import type { BehaviorMapEventHandler, BehaviorType, DomEvent } from '@yandex/ymaps3-types'

export interface Point {
  coordinates: number[]
  title: string
  color: string
  draggable: boolean
}

export function useYaMap(location: Ref<Location>) {
  const { menu } = useMenu()

  const mapSettings = ref({
    center: [location.value.longitude, location.value.latitude],
    zoom: 11,
  })

  watch(location, (location: Location) => {
    if (menu.value.trackLocation && !!location?.latitude) {
      mapSettings.value = {
        center: [location.longitude, location.latitude],
        zoom: 16,
      }
    }
  })

  const BEHAVIOR: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt']

  const events = reactive({
    map: {
      update: false,
      resize: false,
    },
    dom: {
      click: false,
      fastClick: false,
      dblClick: false,
      contextMenu: false,
      rightDblClick: false,
      mouseMove: false,
      mouseEnter: false,
      mouseLeave: false,
      mouseUp: false,
      mouseDown: false,
    },
    behavior: {
      scrollZoom: false,
      drag: false,
      mouseRotate: false,
      mouseTilt: false,
    },
  })

  // eslint-disable-next-line ts/no-unsafe-function-type
  function debounce<T extends Function>(func: T, delay: number): (...args: any[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>

    return function _(this: any, ...args: any[]): void {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  function createEvent<T extends keyof typeof events, E = keyof typeof events[T]>(category: T, type: E | boolean): any {
    const eventState = events[category] as any

    if (typeof type !== 'boolean') {
      const endEvent = debounce(() => {
        eventState[type] = false
      }, 250)

      // eslint-disable-next-line unused-imports/no-unused-vars
      return (object: Record<string, any>, event?: DomEvent) => {
        // console.log(`${type} Object: `, object, `\n`, `${type} Event: `, event)

        eventState[type] = true
        endEvent()
      }
    }
    return (object: Parameters<BehaviorMapEventHandler>[0]) => {
      // console.log(`${type ? 'actionStart' : 'actionEnd'} Object:`, object)
      if (!(object.type in events.behavior))
        return

      eventState[object.type] = type
    }
  }

  function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 0xFFFFFF).toString(16)
    return `#${randomColor.padStart(6, '0')}`
  }

  function trackLocationHandler() {
    menu.value.trackLocation = true

    mapSettings.value = {
      center: [location.value.longitude, location.value.latitude],
      zoom: 16,
    }
  }

  watch(events, (events) => {
    if (events.behavior.drag) {
      menu.value.trackLocation = false
    }
  })

  return { mapSettings, events, BEHAVIOR, trackLocationHandler, getRandomColor, createEvent }
}
