<template>
  <Header v-model="active" :uuid="props.uuid" />
  <Main :active="active" :uuid="props.uuid" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "./Layout/WScoketHeader.vue";
import Main from "./Layout/WSocketMain.vue";

const props = defineProps({
  uuid: { type: String, required: true },
});

const active = ref("script");
</script>
