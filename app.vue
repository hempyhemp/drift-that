<template>
  <IonApp>
    <IonRouterOutlet :animated="true" :animation="customAnimation" />
  </IonApp>
</template>

<script>
import { createAnimation } from '@ionic/core'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const customAnimation = (baseEl, opts) => {
      const enteringEl = opts.enteringEl
      const leavingEl = opts.leavingEl

      const rootAnimation = createAnimation()

      const enterAnimation = createAnimation()
        .addElement(enteringEl)
        .duration(200)
        .fromTo('opacity', '0.8', '1')
        .fromTo('transform', 'translateY(5px)', 'translateY(0)')

      const leaveAnimation = createAnimation()
        .addElement(leavingEl)
        .duration(200)
        .fromTo('opacity', '1', '0.8')
        .fromTo('transform', 'translateY(0)', 'translateY(-5px)')

      return rootAnimation.addAnimation([enterAnimation, leaveAnimation])
    }

    return {
      customAnimation,
    }
  },
})
</script>
