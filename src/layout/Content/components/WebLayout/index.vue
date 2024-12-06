<template>
  <Header v-model="active" :url="props.data?.title" :type="props.type" />
  <Container :active="active" />
</template>

<script setup lang="ts">
import Header from "./Layout/HttpLayoutHead.vue";
import Container from "./Layout/HttpLayoutBottom.vue";
import { ref, type PropType } from "vue";

const props = defineProps({
  data: Object as PropType<VnsDebug.Tabs>,
  type: String,
});

const active = ref("script");
</script>
