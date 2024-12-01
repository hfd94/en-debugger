<template>
  <v-sheet class="sheet" :border="true" height="32" width="100%">
    <v-tooltip class="tooltip" location="bottom" transition="fade-transition">
      <template v-slot:activator="{ props }">
        <v-btn class="text-caption add-btn" icon v-bind="props" variant="text">
          <v-icon color="grey-lighten-1"> mdi-package-variant-plus </v-icon>
        </v-btn>
      </template>
      <span>新建集合</span>
    </v-tooltip>
  </v-sheet>

  <v-treeview
    style="margin-left: 1px"
    class="tree-view-work"
    :items="datas"
    :opened="initiallyOpen"
    item-value="title"
    open-on-click
    @click:select="(arg:any) => onClickItem(arg.path)"
  >
    <template v-slot:append="{ isOpen, item }">
      <template v-if="item.children">
        <div
          class="right-click"
          :class="menu.show && menu.right == item.title ? 'right-select' : ''"
          @contextmenu.prevent="($event:any) => onRightClick($event, item)"
        ></div>
        <v-icon
          class="expand-icon"
          :icon="isOpen ? IconChevronContract : IconChevronExpand"
          size="12"
        />
      </template>
    </template>

    <template v-slot:title="{ title, item }">
      <div v-if="item.children">
        {{ `${title} (${item.children.length})` }}
      </div>
      <div v-else>{{ title }}</div>
    </template>

    <template v-slot:prepend="{ item, isOpen }">
      <template v-if="!!item.children">
        <v-icon :icon="!isOpen ? IconFolder : IconFolderOpen" size="18" />
      </template>

      <template v-else>
        <div
          class="text-caption prefix-icon"
          :class="`text-${colorConf[item.type!].color}`"
        >
          {{ colorConf[item.type!].title }}
        </div>
      </template>
    </template>

    <!-- <template v-slot:prepend="{ item, isOpen }"> </template> -->
  </v-treeview>

  <v-overlay
    v-model="menu.show"
    @contextmenu.prevent="menu.show = false"
    class="menus"
    transition="none"
    :style="{
      top: `${menu.y}px`,
      left: `${menu.x}px`,
      position: 'absolute',
      zIndex: 2000,
    }"
    absolute
  >
    <v-card class="menus-card" elevation="6" @click:outside="menu.show = false">
      <v-list>
        <v-list-item @click="() => {}">
          <v-list-item-title>新建Api</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => {}">
          <v-list-item-title>新建文件夹</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="() => {}">
          <v-list-item-title>清空</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => {}">
          <v-list-item-title>删除</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-overlay>
  <!-- <v-menu v-model="menu.show" activator="parent">
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
  </v-menu> -->
</template>
<script setup lang="ts">
import IconFolder from "@/components/icons/icon-folder.vue";
import IconFolderOpen from "@/components/icons/icon-folder-open.vue";
import IconChevronContract from "@/components/icons/icon-chevron-contract.vue";
import IconChevronExpand from "@/components/icons/icon-chevron-expand.vue";
import { useWorkSpace } from "./hooks/useWorkspance";

const { menu, datas, initiallyOpen, colorConf, onClickItem, onRightClick } =
  useWorkSpace();
</script>

<style lang="scss" scoped>
.tree-view-work {
  :deep(.v-list-item__prepend .v-list-item-action button) {
    display: none;
  }

  :deep(.v-list-group .v-list-item__content .v-list-item-title) {
    position: relative;
    font-size: 12px;
    user-select: none;
  }

  :deep(.v-list-item__prepend .v-list-item__spacer) {
    width: 5px;
  }

  :deep(.v-list-item--density-default.v-list-item--one-line) {
    min-height: 25px;
  }

  :deep(.v-treeview-group.v-list-group .v-list-group__items .v-list-item) {
    user-select: none;
    padding-inline-start: calc(0px + var(--indent-padding)) !important;
  }

  .expand-icon {
    position: absolute;
    z-index: 0;
    opacity: 0;
    transition: all 0.3s ease;
  }
  .right-click {
    z-index: 1;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    &:hover {
      + .expand-icon {
        opacity: 255;
      }
    }
  }

  .right-select {
    border: 1px solid;
  }
  .prefix-icon {
    text-transform: uppercase !important;
    // font-style: normal;
    width: 45px;
    // text-align: right;
  }
  //   .prefix-icon {
  //     width: 18px;
  //     height: 18px;
  //     margin-right: 5px;
  //   }
}
.sheet {
  border-top: none;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
  .add-btn {
    width: 24px;
    height: 24px;
  }
}
.menus {
  user-select: none;
  :deep(.v-overlay__scrim) {
    opacity: 0.001;
  }
  .menus-card {
    :deep(.v-list-item-title) {
      font-size: 12px;
    }
  }
  :deep(.v-list) {
    padding: 5px 8px;
  }
  :deep(.v-list-item--density-default.v-list-item--one-line) {
    min-height: 30px;
  }
}
</style>
