<template>
  <IonFooter>
    <div class="menu-toolbar">
      <IonButton
        v-for="tab in tabs"
        :key="tab.icon"
        :color="menu.currentPage === tab.to ? 'secondary' : 'light'"
        fill="clear"
        :router-link="tab.to"
        class="menu-button"
      >
        <div class="d-flex flex-column align-items-center" style="width: 64px">
          <IonIcon :icon="tab.icon" class="mb4" />
          <ion-label>{{ tab.name }}</ion-label>
        </div>

        <div :class="{ 'menu-event': tab?.hasEvent }" />
      </IonButton>
    </div>
  </IonFooter>
</template>

<script setup lang="ts">
import { buildOutline, chatboxEllipsesOutline, mapOutline } from 'ionicons/icons'
import useMenu from '~/composables/useMenu'

const { menu } = useMenu()

const { hasNewMessages } = useChat()

const tabs = computed(() => [
  {
    to: '/',
    name: 'Map',
    icon: mapOutline,
  },
  {
    to: '/chat',
    name: 'Chat',
    hasEvent: hasNewMessages.value,
    icon: chatboxEllipsesOutline,
  },
  {
    to: '/settings',
    name: 'Settings',
    icon: buildOutline,
  },
])
</script>

<style lang="scss">
.menu-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: $background;
  height: 60px;
}

.menu-event {
  position: absolute;
  top: 0;
  right: 14px;
  width: 8px;
  height: 8px;
  background-color: #ff0073;
  border-radius: 50%;
  z-index: 10;

  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5)
  }
  100% {
    transform: scale(1);
  }
}

.menu-button {
  position: relative;
}
</style>
