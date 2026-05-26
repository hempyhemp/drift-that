<template>
  <IonPage>
    <ion-header id="header" mode="md" class="header">
      <div class="d-flex align-items-center">
        <Logo />

        <h3>
          DRIFT//THAT
        </h3>
      </div>

      <div class="mr12 d-flex align-items-center">
        <slot name="actions" />
      </div>
    </ion-header>

    <IonContent>
      <slot />
    </IonContent>
    <NavMenu />
  </IonPage>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: $background;
}
</style>
