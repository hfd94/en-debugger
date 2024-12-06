<template>
  <v-tabs
    show-arrows
    center-active
    slider-color="primary darken-1"
    density="compact"
    class="tab-root"
    height="32"
    :model-value="activeIndex"
    @update:model-value="onActiveTab"
  >
    <v-tab
      :ripple="false"
      v-for="val in tabs"
      :key="val.id"
      :text="val.title"
      :value="val.id"
      style="padding: 0 5px 0 5px"
      class="tab-items"
      @mouseenter.prevent="onMouseEnter(val.id)"
      @mouseleave.prevent="onMouseLeave(val.id)"
    >
      <v-icon style="margin-right: 5px" color="success">
        <iconRequest
          v-if="val.type == 'get' || val.type == 'post'"
          style="padding-top: 5px"
        />

        <iconConnect v-else />
      </v-icon>

      <span class="subtitle-1">{{ val.title }}</span>

      <v-btn
        v-if="iconIsActive(val.id)"
        icon
        ripple
        size="x-small"
        variant="text"
        @click="onClickCloseTab(val.id, $event)"
        style="
          font-size: 8px;
          width: calc(var(--v-btn-height));
          height: calc(var(--v-btn-height));
        "
      >
        <v-icon> mdi-close </v-icon>
      </v-btn>
      <div v-else style="width: 20px"></div>
    </v-tab>
  </v-tabs>
</template>
<script setup lang="ts">
import iconRequest from "@/components/icons/icon-request.vue";
import iconConnect from "@/components/icons/icon-connect.vue";
import { useTags } from "./hooks/useTabs";

const onClickCloseTab = (id: string, evt: any) => {
  evt.stopPropagation();
  onCloseTab(id);
};

const {
  iconIsActive,
  activeIndex,
  tabs,
  onCloseTab,
  onMouseEnter,
  onMouseLeave,
  onActiveTab,
} = useTags();
</script>

<style lang="scss" scoped>
// .tab-root {
//   .tab-items:not(:last-child) {
//     &::before {
//       content: "";
//       position: absolute;
//       right: 0;
//       height: 50%;
//       width: 1px;
//       background: #dcdcdc;
//     }
//   }
//   border-bottom: 1px solid red;
// }
.tab-items {
  :global(+ .v-btn__content) {
    width: 150px;
    min-width: 150px;
  }

  :global(.subtitle-1) {
    text-transform: none;
    padding-top: 2px;
    font-size: 12px;
    width: 103px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
