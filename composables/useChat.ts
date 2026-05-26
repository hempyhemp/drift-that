import type { Message } from '~/types/chat'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { ref, watch } from 'vue'
import { notify } from '~/composables/useNotify'

let socket: WebSocket | null = null
const messages = ref<Message[]>([])
const isConnected = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const hasNewMessages = ref(false)

export default function useChat() {
  const { menu } = useMenu()
  const { user } = useAuth()

  function createWebSocket() {
    if (!socket) {
      socket = new WebSocket('wss://api.drift-that.ru/chat')

      socket.addEventListener('open', () => {
        console.log('Подключено к серверу')
        isConnected.value = true
        errorMessage.value = null
      })

      socket.addEventListener('message', (event) => {
        const message: Message = JSON.parse(event.data)
        if (message.message !== 'Подключен к чату' && !menu.value.inChat) {
          hasNewMessages.value = true
          notify(`${message.name}: ${message?.image ? '[Изображение]' : message.message}`, 700)
        }

        if (message.message !== 'Подключен к чату') {
          messages.value.push(message)
        }

        if (menu.value.inChat) {
          hasNewMessages.value = false
        }
      })

      socket.addEventListener('close', () => {
        console.log('Соединение закрыто')
        isConnected.value = false
        errorMessage.value = 'Соединение потеряно. Пытаемся переподключиться...'
        reconnectWebSocket()
      })

      socket.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error)
        errorMessage.value = 'Ошибка соединения. Пожалуйста, попробуйте позже.'
      })
    }
  }

  createWebSocket()

  async function getChatHistory() {
    try {
      messages.value = (await $api('history'))
    }
    catch (error) {
      console.error('Ошибка при получении истории чата', error)
    }
  }

  function reconnectWebSocket() {
    setTimeout(() => {
      socket = null
      console.log('Попытка переподключения...')
      createWebSocket()
    }, 3000)
  }

  const imageBase64 = ref<string | null>(null)

  function clearImage() {
    imageBase64.value = null
  }

  function sendMessage(input: Ref<string>, callback?: () => void) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (input.value.trim() || imageBase64.value) {
        const message: Message = {
          name: user.value!.name,
          uid: user.value!.uid,
          message: input.value,
          image: imageBase64.value || undefined,
        }
        socket.send(JSON.stringify(message))
        input.value = ''
        clearImage()

        if (callback) {
          callback()
        }
      }
    }
    else {
      console.error('Не удается отправить сообщение. WebSocket не подключен.')
      errorMessage.value = 'Соединение потеряно. Сообщение не отправлено.'
    }
  }

  async function captureImage() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      })

      imageBase64.value = await compressImage(`data:image/${photo.format};base64,${photo.base64String}`)
    }
    catch (error) {
      console.error('Ошибка при съёмке фото:', error)
    }
  }

  async function pickImageFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      })

      imageBase64.value = await compressImage(`data:image/${photo.format};base64,${photo.base64String}`)
    }
    catch (error) {
      console.error('Ошибка при выборе фото:', error)
    }
  }

  async function compressImage(
    base64String: string,
    maxWidth: number = 800,
    quality: number = 0.7,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = base64String

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        const scale = Math.min(maxWidth / img.width, 1) // Уменьшение, если ширина превышает maxWidth
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        try {
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality) // Сжимаем до JPEG
          resolve(compressedBase64)
        }
        catch (error) {
          reject(new Error(`Error compressing image: ${error instanceof Error ? error.message : error}`))
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    })
  }

  function leaveChat(userName: string) {
    if (socket) {
      socket.send(JSON.stringify({ user: userName, message: 'end connect' }))
      socket.close()
    }
  }

  watch(isConnected, (newVal) => {
    if (!newVal) {
      errorMessage.value = 'Соединение потеряно. Пытаемся переподключиться...'
    }
  })

  return {
    createWebSocket,
    hasNewMessages,
    socket,
    messages,
    errorMessage,
    isConnected,
    imgBuffer: imageBase64,
    clearImage,
    getChatHistory,
    sendMessage,
    captureImage,
    pickImageFromGallery,
    leaveChat,
  }
}
