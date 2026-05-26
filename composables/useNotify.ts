export async function notify(message: string, duration: number = 1500) {
  const toast = await toastController.create({
    message,
    duration,
    positionAnchor: 'header',
    position: 'top',
  })

  await toast.present()
}
