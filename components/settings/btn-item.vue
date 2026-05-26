<template>
  <ion-item>
    <div class="d-flex align-items-center justify-content-between w-100">
      <div class="d-flex align-items-center">
        <IonIcon :icon="icon" class="mr6" />
        <span class="mr4">{{ title }}: </span><strong v-if="value" style="color: #0163aa; font-size: 20px;">{{ value }}</strong>
      </div>

      <IonButton fill="outline" class="ion-no-pad" color="light" @click="callback?.()">
        <IonIcon :icon="ioniconsPencilOutline" />
      </IonButton>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value?: string
  icon: string
  callback?: () => void
}>()
</script>

<style lang="scss">

</style>
