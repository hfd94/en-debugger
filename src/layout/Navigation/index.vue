<template>
  <v-navigation-drawer rail permanent style="left: 1px">
    <v-tabs
      color="primary"
      direction="vertical"
      :mandatory="false"
      @update:model-value="onSelectNav"
    >
      <v-tab
        v-for="(v, i) in menus"
        :text="v.name"
        :key="i"
        :ripple="false"
        style="padding: 0px 18px; min-width: 48px; max-width: 55px"
      >
        <v-tooltip
          activator="parent"
          location="end"
          :text="v.tooltip"
          class="tooltip"
          transition="fade-transition"
        />
        <v-icon>{{ v.icon }}</v-icon>
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>

  <!-- 侧边内容栏 -->
  <v-navigation-drawer
    width="250"
    v-model:model-value="state.expanded"
    permanent
  >
    <component :is="state.component"></component>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useCustomization } from "@/stores";

// const isExpanded = ref(false);
const { state, menus, onSelectNav } = useCustomization();

//
</script>
