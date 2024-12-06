<template>
  <v-sheet class="sheet" :border="true" height="32" width="100%">
    <v-tooltip class="tooltip" location="bottom" :transition="false">
      <template v-slot:activator="{ props }">
        <v-btn
          class="text-caption add-btn"
          icon
          v-bind="props"
          variant="text"
          @click="() => onOpenCreateFolder()"
        >
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
    item-value="id"
    open-on-click
    @click:select="(arg:any) => onClickItem(arg.path)"
  >
    <template v-slot:append="{ isOpen, item }">
      <template v-if="item.children">
        <div
          class="right-click"
          :class="menu.active && menu.selectId == item.id ? 'right-select' : ''"
          @contextmenu.prevent="($event:any) => onShowRightMenu($event, item, 0)"
        ></div>
        <v-icon
          class="expand-icon"
          :icon="isOpen ? IconChevronContract : IconChevronExpand"
          size="12"
        />
      </template>
      <template v-else>
        <div
          class="right-click"
          :class="menu.active && menu.selectId == item.id ? 'right-select' : ''"
          @contextmenu.prevent="($event:any) => onShowRightMenu($event, item, 1)"
        ></div>
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

  <!-- 右键弹出菜单 -->
  <v-overlay
    v-model="menu.active"
    @contextmenu.prevent="menu.active = false"
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
    <v-card
      class="menus-card"
      elevation="6"
      @click:outside="menu.active = false"
    >
      <v-list>
        <template v-if="menu.type == 0">
          <v-list-item @click="onOpenCreateApiModal">
            <v-list-item-title>新建Api</v-list-item-title>
          </v-list-item>
          <v-list-item @click="() => onOpenCreateFolder(true)">
            <v-list-item-title>新建文件夹</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="onOpenRename">
            <v-list-item-title>重命名</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="() => onDeleteMenuItem(true)">
            <v-list-item-title>清空</v-list-item-title>
          </v-list-item>
          <v-list-item @click="() => onDeleteMenuItem()">
            <v-list-item-title>删除</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item @click="() => {}">
            <v-list-item-title>打开</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onOpenRename">
            <v-list-item-title>重命名</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="() => {}">
            <v-list-item-title>复制Url</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="() => onDeleteMenuItem()">
            <v-list-item-title>删除</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-overlay>

  <!--  新建文件夹  -->
  <v-dialog v-model="modal.showFolder" width="auto">
    <v-card
      class="alert-form"
      width="400"
      max-width="400"
      :title="!modal.isRename ? '新建集合' : '修改名称'"
    >
      <template v-slot:actions>
        <v-btn color="error" text="取消" @click="onCancelFolder"></v-btn>
        <v-btn
          color="info"
          :disabled="disabled"
          :text="!modal.isRename ? '新建' : '修改'"
          @click="onCreateFolder"
        ></v-btn>
      </template>
      <!-- "filled" | "underlined" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled" -->
      <v-text-field
        :placeholder="!modal.isRename ? '集合名称' : '新的名称'"
        density="compact"
        variant="underlined"
        v-model:model-value="modal.fileName"
        clearable
        required
      >
        <template v-slot:clear="{ props }">
          <v-btn
            @click="props.onClick"
            icon
            ripple
            size="x-small"
            variant="text"
            style="
              font-size: 8px;
              width: calc(var(--v-btn-height));
              height: calc(var(--v-btn-height));
            "
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-card>
  </v-dialog>

  <!--  新建Api  -->
  <v-dialog v-model="modal.showApi" width="auto">
    <v-card class="alert-form" width="400" max-width="400" title="新建Api">
      <template v-slot:actions>
        <v-btn color="error" text="取消" @click="modal.showApi = false"></v-btn>
        <v-btn
          color="info"
          :disabled="disabledApi"
          text="创建"
          @click="onPostCreateApi"
        ></v-btn>
      </template>
      <!-- "filled" | "underlined" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled" -->
      <v-select
        density="compact"
        :items="['GET', 'POST', 'WebSocket']"
        variant="outlined"
        v-model="modal.selectType"
      ></v-select>
      <v-text-field
        placeholder="Api名称"
        density="compact"
        variant="underlined"
        v-model:model-value="modal.fileName"
        clearable
        required
      >
        <template v-slot:clear="{ props }">
          <v-fade-transition :duration="500">
            <v-btn
              @click="props.onClick"
              icon
              ripple
              size="x-small"
              variant="text"
              style="
                font-size: 8px;
                width: calc(var(--v-btn-height));
                height: calc(var(--v-btn-height));
              "
            >
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-fade-transition>
        </template>
      </v-text-field>
      <v-text-field
        placeholder="请求地址 HTTP OR WebSocket"
        density="compact"
        variant="underlined"
        v-model:model-value="modal.requestUrl"
        clearable
        required
      >
        <template v-slot:clear="{ props }">
          <v-fade-transition :duration="500">
            <v-btn
              @click="props.onClick"
              icon
              ripple
              size="x-small"
              variant="text"
              style="
                font-size: 8px;
                width: calc(var(--v-btn-height));
                height: calc(var(--v-btn-height));
              "
            >
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import IconFolder from "@/components/icons/icon-folder.vue";
import IconFolderOpen from "@/components/icons/icon-folder-open.vue";
import IconChevronContract from "@/components/icons/icon-chevron-contract.vue";
import IconChevronExpand from "@/components/icons/icon-chevron-expand.vue";
import { useWorkSpace } from "./hooks/useWorkspance";
import { computed } from "vue";

const {
  menu,
  modal,
  datas,
  initiallyOpen,
  colorConf,
  onClickItem,
  onShowRightMenu,
  onOpenCreateFolder,
  onCreateFolder,
  onCancelFolder,
  onOpenCreateApiModal,
  onPostCreateApi,
  onOpenRename,
  onDeleteMenuItem,
} = useWorkSpace();

const disabledApi = computed(() => {
  if (!modal.selectType || !modal.fileName || !modal.requestUrl) {
    return true;
  } else {
    return !(
      modal.selectType != "" &&
      modal.fileName.length > 0 &&
      modal.requestUrl.length > 0
    );
  }
});
const disabled = computed(() => {
  if (!modal.fileName) {
    return true;
  } else {
    return modal.fileName.length <= 0;
  }
});
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

.alert-form {
  padding: 0px 10px;
  :deep(.v-card-item .v-card-title) {
    text-align: center;
  }
}
</style>
