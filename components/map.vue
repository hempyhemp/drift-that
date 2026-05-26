<template>
  <YandexMap
    v-model="map"
    v-bind="$attrs"
    class="map"
    :settings="{
      location: mapSettings,
    }"
    width="100%"
    height="100%"
  >
    <YandexMapDefaultSchemeLayer :settings="{ theme: 'dark' }" />
    <YandexMapDefaultFeaturesLayer />

    <YandexMapControls :settings="{ position: 'right' }">
      <YandexMapZoomControl />

      <YandexMapControls :settings="{ position: 'right bottom' }">
        <YandexMapScaleControl />

        <YandexMapControl :settings="{ transparent: true }">
          <IonButton
            :color="menu.trackLocation ? 'secondary' : 'light'"
            class="map-track-btn"
            @click="trackLocationHandler"
          >
            <IonIcon
              :icon="navigateCircleOutline"
              class="map-track-btn__icon"
            />
          </IonButton>
        </YandexMapControl>
      </YandexMapControls>

      <template
        v-for="(point, index) in POINTS"
        :key="index"
      >
        <YandexMapMarker
          v-if="'element' in point"
          :settings="point"
          :style="{
            '--color': 'color' in point && point.color,
          }"
        >
          <div
            v-if="point.element === 'circle'"
            class="circle"
            :style="{
              '--radius': 'radius' in point ? point.radius : '20px',
              '--color': 'color' in point ? point.color : undefined,
              '--icon': 'icon' in point ? point.icon : '#fff',
              '--image': 'icon' in point ? point.icon : undefined,
            }"
            :title="'title' in point && point.title"
          >
            <div class="circle_element" />
          </div>
          <div
            v-else-if="point.element === 'icon'"
            class="icon"
            :style="{
              '--size': 'size' in point ? point.size : '20px',
              '--color': 'color' in point ? point.color : undefined,
              '--icon': 'icon' in point ? `url(${point.icon})` : undefined,
            }"
          >
            <div
              v-if="'title' in point"
              class="icon_title"
              v-html="point.title"
            />
          </div>
        </YandexMapMarker>
        <YandexMapDefaultMarker
          v-else
          :settings="point"
        />
      </template>
    </yandexmapcontrols>

    <YandexMapListener
      :settings="{
        onUpdate: createEvent('map', 'update'),
        onResize: createEvent('map', 'resize'),

        onClick: createEvent('dom', 'click'),
        onFastClick: createEvent('dom', 'fastClick'),
        onDblClick: createEvent('dom', 'dblClick'),
        onContextMenu: createEvent('dom', 'contextMenu'),
        onRightDblClick: createEvent('dom', 'rightDblClick'),
        onMouseMove: createEvent('dom', 'mouseMove'),
        onMouseEnter: createEvent('dom', 'mouseEnter'),
        onMouseLeave: createEvent('dom', 'mouseLeave'),
        onMouseDown: createEvent('dom', 'mouseDown'),
        onMouseUp: createEvent('dom', 'mouseUp'),

        onActionStart: createEvent('behavior', true),
        onActionEnd: createEvent('behavior', false),
      }"
    />
  </YandexMap>
  <div class="mapBorder" />
</template>

<script setup lang="ts">
import type { Location } from '@capacitor-community/background-geolocation'
import type { YMap } from '@yandex/ymaps3-types'
import type { PosData } from '~/composables/useLocation'
import { navigateCircleOutline } from 'ionicons/icons'
import {
  YandexMap,
  YandexMapControl,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapListener,
  YandexMapMarker,
  YandexMapScaleControl,
  YandexMapZoomControl,
} from 'vue-yandex-maps'
import { type Point, useYaMap } from '~/composables/useYaMap'

const props = defineProps<{
  location: Location
  locations: PosData[] | undefined | null
}>()

const { menu } = useMenu()
const { mapSettings, trackLocationHandler, getRandomColor, createEvent }
    = useYaMap(computed(() => props.location))

const POINTS: ComputedRef<any[] | Point[]> = computed(() => {
  if (!props?.locations)
    return []

  return props.locations!.map(item =>
    ({
      coordinates: [item.location.y, item.location.x],
      title: item.name,
      color: getRandomColor(),
      draggable: false,
    }),
  )
})

const map = shallowRef<null | YMap>(null)
</script>

<style lang="scss">
.map {
  position: relative;
  z-index: 1;
  //border-bottom: 0px solid red;
  box-shadow: 0 10px 65px #004acd;
}

.map-track-btn {
  --padding-top: 0;
  --padding-start: 0;
  --padding-end: 0;
  --padding-bottom: 0;
  width: 46px;
  height: 46px;

  &__icon {
    width: 34px;
    height: 34px;
  }
}
</style>
