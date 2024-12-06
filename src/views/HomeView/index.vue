<template>
  <v-app id="inspire">
    <SystemBar />
    <Navigation />
    <Content />
  </v-app>
</template>

<script setup lang="ts">
import SystemBar from "@/layout/SystemBar/index.vue";
import Navigation from "@/layout/Navigation/index.vue";
import Content from "@/layout/Content/index.vue";
</script>

<style lang="scss" scoped></style>
