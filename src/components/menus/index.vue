<template>
  <v-overlay
    v-model="props.active"
    :style="{
      top: `${props['position-y']}px`,
      left: `${props['position-x']}px`,
      position: 'absolute',
      zIndex: 2000,
    }"
    class=""
    absolute
  >
    <v-card max-width="200" outlined>
      <v-list>
        <v-list-item>
          <v-list-item-title>Action 1</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Action 2</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Action 3</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-overlay>
</template>
<script setup lang="ts">
const emit = defineEmits({ "update:modelValue": (value: boolean) => true });
const props = defineProps({
  active: Boolean,
  "position-x": Number,
  "position-y": Number,
});
</script>
