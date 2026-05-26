<template>
  <ion-content ref="contentRef" class="chat-message-content">
    <div
      v-for="(msg, index) in messages" :key="index"
      class="chat-message"
      :class="{
        'chat-message--own-message': msg.name === user!.name,
        'chat-message--new-group': index === 0 || messages[index - 1].name !== msg.name,
      }"
    >
      <div v-if="index === 0 || messages[index - 1].name !== msg.name">
        <strong
          :style="{ color: getSenderColor(msg.name) }"
          class="mr8"
        >
          {{ msg.name }}
        </strong>

        <span class="chat-message__time">{{ msg.time }}</span>
      </div>

      <div class="chat-message-card" :style="{ backgroundColor: getBackgroundColor(msg.name) }">
        <span>{{ msg.message }}</span>

        <img
          v-if="msg.image"
          :src="msg.image"
          alt="Отправленное изображение"
          @click.stop="openImage = msg.image"
        >
      </div>
    </div>

    <ion-modal
      :is-open="!!openImage"
      :enter-animation="enterAnimation"
      :leave-animation="leaveAnimation"
      class="chat-message-items-modal"
      @click="openImage = undefined"
    >
      <div class="chat-message-items-modal__content">
        <img
          :src="openImage"
          alt=""
        >
      </div>
    </ion-modal>
  </ion-content>
</template>

<script setup lang="ts">
import type { IonContent } from '@ionic/vue'
import type { Message } from '~/types/chat'
import { ref } from 'vue'

const props = defineProps<{
  messages: Array<Message>
}>()

const { user } = useAuth()
// const { isConnected } = useChat()

const openImage = ref()

const contentRef = ref<InstanceType<typeof IonContent> | null>(null)

function scrollToBottom() {
  if (contentRef.value) {
    contentRef.value.$el.scrollToBottom(500)
  }
}

function getSenderColor(username: string) {
  switch (username) {
    case 'Server':
      return '#d5951e'
    case user.value!.name:
      return '#21af14'

    default:
      return '#007bff'
  }
}

function getBackgroundColor(username: string) {
  switch (username) {
    case 'Server':
      return '#a6761a'
    case user.value!.name:
      return '#1a7a11'
    default:
      return '#0158b5'
  }
}

watch(() => props.messages, scrollToBottom, { deep: true })

function enterAnimation(baseEl: HTMLElement) {
  const root = baseEl.shadowRoot

  const backdropAnimation = createAnimation()
    .addElement(root.querySelector('ion-backdrop'))
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)')

  const wrapperAnimation = createAnimation()
    .addElement(root.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '0.99', transform: 'scale(1)' },
    ])

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(100)
    .addAnimation([backdropAnimation, wrapperAnimation])
}

function leaveAnimation(baseEl) {
  return enterAnimation(baseEl).direction('reverse')
}
</script>

<style lang="scss">
.chat-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;

  &--own-message {
    align-items: flex-end;
  }

  &--new-group {
    margin-top: 12px;
  }

  &__time {
    color: gray;
    font-size: 10px;
  }

  strong {
    color: #007bff;
  }
}

.chat-message-card {
  margin-top: 2px;
  border-radius: 6px;
  padding: 6px;
  display: inline-block;
  max-width: 60%;
  word-wrap: break-word;
}

.chat-message-content {
  --ion-background-color: #{$darker};
}

.chat-message-items-modal {
  --ion-background-color: rgba(0, 0, 0, 0);

  &__content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
