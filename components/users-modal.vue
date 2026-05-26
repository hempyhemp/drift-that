<template>
  <IonModal :is-open="modelValue" class="users-modal">
    <IonHeader>
      <IonToolbar>
        <IonTitle class="users-modal-title">
          Пользователи
        </IonTitle>

        <IonButtons class="flex-row-reverse">
          <IonButton icon="close" size="large" @click="$emit('update:modelValue', false)">
            <IonIcon :icon="closeOutline" color="light" size="large" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  </IonModal>
</template>

<script setup lang="ts">
import { closeOutline } from 'ionicons/icons'

defineProps<{
  modelValue: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.users-modal-title {
  color: white;
  background-color: $background;
}

.users-modal {
  //background-color: $dark;
}
</style>
