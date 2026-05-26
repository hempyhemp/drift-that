<template>
  <DefaultLayout>
    <template #actions>
      <IonButton v-if="needToSave">
        Сохранить
      </IonButton>
    </template>

    <ion-list lines="full" class="px24 mt60">
      <ion-item>
        <ion-toggle v-model="menu.shareLocation">
          Делиться местоположением
        </ion-toggle>
      </ion-item>

      <SettingsBtnItem
        :icon="ioniconsPerson"
        title="Имя"
        :value="user!.name"

        :callback="() => notify('Soon')"
      />

      <ion-item>
        <div class="d-flex align-items-center justify-content-between w-100">
          <div class="d-flex align-items-center">
            <IonIcon :icon="ioniconsReader" class="mr6" />
            <span class="mr4">Пользовательское соглашение </span>
          </div>

          <IonButton fill="outline" class="ion-no-pad" color="light" @click="agreementModal = true">
            <IonIcon :icon="ioniconsOpen" />
          </IonButton>
        </div>
      </ion-item>
    </ion-list>

    <ion-modal :is-open="agreementModal">
      <UserAgreement @close="agreementModal = false" />
    </ion-modal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import UserAgreement from '~/components/user-agreement.vue'
import useMenu from '~/composables/useMenu'
import { notify } from '~/composables/useNotify'
import DefaultLayout from '~/layouts/default-layout.vue'

const { menu } = useMenu()
const { user } = useAuth()
const needToSave = ref(false)
const agreementModal = ref(false)

// const setUserNameModal = ref(false)
</script>

<style lang="scss">
.settings-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  //
  //max-width: 350px;
}
</style>
