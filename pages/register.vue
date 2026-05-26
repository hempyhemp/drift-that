<template>
  <IonPage>
    <form class="login-page" @submit.prevent="onSubmit">
      <div class="d-flex align-items-center">
        <Logo :size="75" />
        <h1 class="ml16">
          DRIFT//THAT
        </h1>
      </div>

      <ion-item class="w-75">
        <ion-input id="name" v-model="name" label="Имя" label-placement="stacked" placeholder="Введите имя" />
      </ion-item>

      <IonButton class="w-75" type="submit">
        Войти
      </IonButton>
    </form>

    <ion-modal :is-open="agreement === false">
      <UserAgreement />
    </ion-modal>
  </IonPage>
</template>

<script setup lang="ts">
import { Device } from '@capacitor/device'
import UserAgreement from '~/components/user-agreement.vue'

const { menu } = useMenu()
const router = useIonRouter()
const name = ref('')
const agreement = computed(() => menu.value.acceptAgreement)

async function onSubmit() {
  try {
    await createUser()
    await router.push('/')
  }
  catch (error) {
    console.error(error)
  }
}

async function createUser() {
  const info = await Device.getId()
  const deviceId = info.identifier

  return await $api(`/create`, {
    method: 'post',
    body: {
      name: name.value,
      uid: deviceId,
    },
  })
}
</script>

<style lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  gap: 16px;
}
</style>
