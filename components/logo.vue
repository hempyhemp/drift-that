<template>
  <img
    class="logo"
    src="@/public/icon-drift-that.svg"
    alt="drift-that-logo"
    :class="sizeClass"
  >
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<
  { size?: number }
>(), {
  size: 52,
})

const sizeClass = `size-${props.size}`
</script>

<style lang="scss">
.logo {
  //background-color: $secondary;
  border-radius: 16px;
  margin: 4px 4px 4px 12px;
}

@for $i from 1 through 200 {
  .size-#{$i} {
    width: #{$i}px;
    height: #{$i}px;
  }
}
</style>
