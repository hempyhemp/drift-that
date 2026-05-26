<template>
  <DefaultLayout>
    <template #actions>
      <span>{{ menu.population }}</span>
      <IonIcon :icon="ioniconsPeople" class="mr8 ml4" />
    </template>

    <div class="chat">
      <div class="chat__messages">
        <MessageItems :messages="messages" />
      </div>

      <div class="chat__input-container">
        <IonItem class="chat__input-item">
          <IonInput
            v-if="!imgBuffer"
            ref="inputField"
            v-model="inputMessage"
            placeholder="Введите сообщение"
            class="chat__input"
            autofocus
          />

          <div v-else class="chat-image-input-content">
            <img
              :src="imgBuffer"
              alt=""
              class="chat-image"
            >

            <IonButton class="chat-image-input-content__btn" color="light" fill="clear" @click="clearImage()">
              <IonIcon :icon="ioniconsClose" />
            </IonButton>
          </div>
        </IonItem>

        <IonButton fill="clear" color="light" class="chat__attach-button" @click="attachModal = true">
          <svg
            id="Capa_1"
            class="chat__attach-button-icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="#FFFFFF"
            version="1.1"
            width="800px"
            height="800px"
            viewBox="0 0 605.942 605.942"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M435.099,0c-45.632,0-88.544,17.777-120.822,50.055L50.036,314.276c-66.603,66.622-66.603,175.018,0,241.64    c32.269,32.259,75.171,50.026,120.808,50.026s88.544-17.768,120.812-50.026l19.757-19.751l-12.321,0.588    c-0.062,0.005-0.728,0.033-1.889,0.033c-5.709,0-25.776-0.746-44.309-10.312l-2.815-1.454l-2.43,2.027    c-21.425,17.915-48.706,27.779-76.806,27.779c-32.034,0-62.118-12.432-84.714-35.009c-22.592-22.591-35.037-52.68-35.037-84.724    s12.445-62.127,35.037-84.724L350.37,86.149c22.592-22.591,52.685-35.037,84.729-35.037c32.04,0,62.128,12.446,84.724,35.037    c46.666,46.703,46.666,122.696,0.005,169.399L354.798,420.19c-8.291,8.306-19.771,12.881-32.331,12.881    c-13.641,0-26.847-5.394-36.242-14.808c-9.018-9.008-14.181-21.563-14.176-34.463c0-12.604,4.776-24.304,13.431-32.938    L432.541,204.36l-36.099-36.094L249.366,314.75c-18.479,18.479-28.539,43.284-28.334,69.84    c0.206,26.444,10.538,51.222,29.09,69.772c18.871,18.867,45.226,29.687,72.321,29.687c26.244,0,50.566-9.863,68.486-27.765    l164.986-164.628c66.589-66.631,66.589-175.018,0-241.601C523.643,17.777,480.731,0,435.099,0z"
                />
              </g>
            </g>
          </svg>
        </IonButton>

        <IonButton color="secondary" class="chat__send-button" @click="sendHandler()">
          <IonIcon :icon="sendOutline" />
        </IonButton>
      </div>
    </div>

    <ion-modal
      class="chat-modal" :initial-breakpoint="0.5"
      :breakpoints="[0, 0.25, 0.5, 0.75]"
      handle-behavior="cycle"
      :is-open="attachModal"
      backdrop-dismiss
      @did-dismiss="attachModal = false"
    >
      <div class="chat-modal__content">
        <IonButton color="light" @click="pickImageFromGallery(); attachModal = false">
          <IonIcon :icon="ioniconsImages" />
          <span class="ml4">Выбрать из галлереи</span>
        </IonButton>

        <IonButton color="light" @click="captureImage(); attachModal = false">
          <IonIcon :icon="ioniconsCamera" />
          <span class="ml4">Сделать фото</span>
        </IonButton>
      </div>
    </ion-modal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { IonButton, IonInput, IonItem } from '@ionic/vue'
import { sendOutline } from 'ionicons/icons'
import { ref } from 'vue'
import useChat from '~/composables/useChat'
import DefaultLayout from '~/layouts/default-layout.vue'

const { menu } = useMenu()

const {
  messages,
  sendMessage,
  leaveChat,
  getChatHistory,
  hasNewMessages,
  pickImageFromGallery,
  captureImage,
  imgBuffer,
  clearImage,
} = useChat()

const inputMessage = ref<string>('')
const inputField = ref()
const attachModal = ref(false)

function setFocus() {
  inputField.value.$el.setFocus()
}

function sendHandler() {
  sendMessage(inputMessage, setFocus)
}

onIonViewDidEnter(() => {
  menu.value.inChat = true
  getChatHistory()
  setFocus()
  hasNewMessages.value = false
})

onUnmounted(() => {
  leaveChat(user.value!.name)
})
</script>

<style lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  border-radius: 10px;

  &__input-item {
    width: 100%;
  }

  &__messages {
    flex: 1;
    //overflow-y: auto;
    background-color: $darker;
    border-radius: 8px;
    padding: 10px;
  }

  &__input {
    --background: #373737;
    --color: #fff;
    --placeholder-color: #ddd;
  }

  &__input-container {
    display: flex;
    align-items: center;
    border-radius: 10px;
    gap: 12px;
    padding-inline: 0;
  }

  &__send-button {
    //height: 50px;
    //width: 50px;

  }

  &__attach-button {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-end: 2px;
    --padding-start: 2px;
  }

  &__attach-button-icon {
    color: white;
    width: 24px;
    height: 24px
  }
}

.chat-modal {
  --ion-background-color: #{ $background };
  --height: auto;

  &__content {
    margin-top: 32px;
    height: 500px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.chat-image {
  position: relative;
}

.chat-image-input-content {
  padding: 10px;

  &__btn {
    z-index: 2000;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
