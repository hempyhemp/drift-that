<template>
  <DefaultLayout>
    <template #actions>
      <span>{{ menu.population }}</span>
      <IonIcon :icon="ioniconsPeople" class="mr8 ml4" />
      <IonIcon v-show="menu.shareLocation" :icon="locateOutline" class="share-location" />
      <IonToggle
        :id="menu.sawInstructions ? 'saw' : 'toggle-trigger'" v-model="menu.shareLocation" class="mr8"
        @click="menu.sawInstructions = true"
      />
      <ion-popover
        class="population-popover" :is-open="!menu.sawInstructions" trigger="toggle-trigger"
      >
        <div class="population-popover__content">
          <span v-if="!menu.sawInstructions">Чтобы делиться позицией <span class="ml10">↑</span> нажмите на тогл</span>
          <span v-else>Отключая ваша геопозиция ещё будет отображаться на карте некоторое время</span>
        </div>
      </ion-popover>
    </template>

    <Map v-if="location" :location="location" :locations="locations" />
    <div v-else class="map-spinner-container">
      <ion-spinner name="circles" class="map-spinner" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { locateOutline } from 'ionicons/icons'
import useMenu from '~/composables/useMenu'
import DefaultLayout from '~/layouts/default-layout.vue'

const { menu } = useMenu()

const { locations, location } = useLocation(computed(() => menu.value.shareLocation))
</script>

<style lang="scss">
.share-location {
  margin-right: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    color: white;
  }
  50% {
    transform: scale(1.2);
    color: #2e6edf;
  }
  100% {
    transform: scale(1);
    color: white;
  }
}

.map-spinner {
  height: 40px;
  width: 40px;
}

.map-spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.population-popover {
  --offset-y: 10px;

  &__content {
    padding: 4px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
