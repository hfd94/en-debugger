<template>
  <div class="wsocket-main">
    <v-tabs-window
      v-model="props.active"
      style="height: 100%; overflow: visible"
    >
      <MsgWidget :uuid="props.uuid" />
      <ScriptWidget ref="scriptWidget" @complate="data.setScriptElement">
        <template #header>
          <div class="mini-button-group">
            <div>
              <v-tooltip class="tooltip" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="loadProtobuf"
                    icon
                    size="small"
                    variant="text"
                    color="light-blue-accent-3"
                    @click="reloadScript"
                  >
                    <v-icon>mdi-script-text-play-outline </v-icon>
                  </v-btn>
                </template>
                <span>重载脚本</span>
              </v-tooltip>
            </div>
            <div>
              <v-tooltip class="tooltip" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="loadProtobuf"
                    icon
                    size="small"
                    variant="text"
                    color="light-blue-accent-3"
                  >
                    <v-icon>mdi-file-eye-outline</v-icon>
                  </v-btn>
                </template>
                <span>查看已加载Proto</span>
              </v-tooltip>

              <v-tooltip class="tooltip" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="loadProtobuf"
                    icon
                    size="small"
                    variant="text"
                    color="light-blue-accent-3"
                    @click="data.LoadProtobuf"
                  >
                    <v-icon>mdi-file-upload-outline</v-icon>
                  </v-btn>
                </template>
                <span>加载Proto协议</span>
              </v-tooltip>
            </div>
          </div>
        </template>
      </ScriptWidget>
      <LoggerWidget :uuid="props.uuid" />
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ScriptWidget from "../../Widget/ScriptWidget.vue";
import MsgWidget from "../Widget/MessageWidget.vue";
import LoggerWidget from "../Widget/LoggerWidget.vue";
import { useRunningStore } from "@/stores";
const scriptWidget = ref();

const props = defineProps({
  active: String,
  uuid: { type: String, required: true },
});

const { openWScoket } = useRunningStore();

const data = computed(() => {
  return openWScoket[props.uuid];
});

const reloadScript = () => {
  const str = scriptWidget.value!.GetString();
  if (!!str && str.length == "") {
    return;
  }
  data.value.SetUserScriptCode(str);
};
</script>

<style scoped lang="scss">
.wsocket-main {
  position: absolute;
  top: 94px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0px;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    opacity: 0.38;
  }

  :deep(.v-window__container) {
    height: 100%;
  }
}

.mini-button-group {
  display: flex;
  padding: 5px 20px;
  justify-content: space-between;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  .loadProtobuf {
    width: 24px;
    height: 24px;
  }
}
</style>
