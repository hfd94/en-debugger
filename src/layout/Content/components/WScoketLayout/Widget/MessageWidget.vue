<template>
  <v-tabs-window-item
    key="msg"
    value="message"
    style="height: 100%; position: relative"
  >
    <!-- <v-expand-transition> -->
    <div class="quick" :style="{ width: expand ? '150px' : '40px' }">
      <div v-if="expand" class="expand">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          size="small"
          @click="expand = false"
        />
        <span class="expand-title text-body-2">快捷消息</span>

        <!-- <v-tooltip class="tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="add-message text-caption"
              icon="mdi-package-variant-closed-plus "
              variant="text"
              size="small"
            />
          </template>
          <span>添加快捷消息模板</span>
        </v-tooltip> -->
      </div>
      <div class="reduce" v-else>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          size="small"
          @click="expand = true"
        />
        <span class="reduce-title text-body-2">展开</span>
      </div>

      <div class="quick-message-box">
        <QuickMessage v-if="expand" :uuid="props.uuid" />
      </div>
    </div>
    <!-- </v-expand-transition> -->

    <v-expand-transition>
      <div class="rwMessage" :style="{ left: expand ? '150px' : '40px' }">
        <!-- logger -->
        <div class="mini-button-group">
          <v-tooltip class="tooltip" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="loadProtobuf"
                icon
                size="small"
                variant="text"
                color="light-blue-accent-3"
                @click="data.onClearWsLogger"
              >
                <v-icon>mdi-cancel </v-icon>
              </v-btn>
            </template>
            <span>清空日志</span>
          </v-tooltip>
        </div>
        <v-virtual-scroll
          ref="loggerScroll"
          :items="data.wsLoggers"
          class="message-list"
        >
          <template v-slot:default="{ item, index }">
            <div
              :key="item.time"
              class="logger"
              :class="{
                'bg-grey-lighten-4': (index + 1) % 2 == 0,
              }"
            >
              <div class="logger-text-box">
                <v-icon v-if="item.direction == 1" color="orange"
                  >mdi-arrow-down-bold
                </v-icon>
                <v-icon v-else color="success">mdi-arrow-up-bold </v-icon>

                <span class="logger-text">{{ item.value }}</span>
              </div>

              <div class="logger-time">{{ item.time }}</div>
            </div>
          </template>
        </v-virtual-scroll>

        <!-- Send message panel -->
        <div class="code-input">
          <div class="left-box">
            <CodeEditor
              ref="codeEditor"
              language="typescript"
              @complate="data.setCommandElement"
              @change="onEditorValueChange"
            />
          </div>

          <div class="right-box">
            <div>
              <v-btn
                class="button"
                color="light-blue-accent-3"
                style="margin-bottom: 65px"
                :disabled="data.commandScriptText.length == 0"
              >
                <v-icon style="margin-right: 5px"
                  >mdi-star-plus-outline
                </v-icon>
                添加快捷
              </v-btn>
            </div>
            <div style="display: flex; flex-direction: column">
              <v-btn
                class="button"
                color="red-accent-3"
                @click="onClearMessage"
              >
                <v-icon style="margin-right: 5px">mdi-delete-outline</v-icon>
                清空
              </v-btn>
              <v-btn class="button" color="blue-accent-2" @click="onSend">
                <v-icon style="margin-right: 5px">mdi-rocket-launch</v-icon>
                发送
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </v-tabs-window-item>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import QuickMessage from "./QuickMessage/index.vue";
import CodeEditor from "@/components/CodingEdtior/index.vue";
import { useRunningStore } from "@/stores";
const props = defineProps({
  uuid: { type: String, required: true },
});
const { openWScoket } = useRunningStore();

const loggerScroll = ref();

const data = computed(() => {
  return openWScoket[props.uuid];
});

const expand = ref(false);
const onEditorValueChange = (v: string) => {
  data.value.onDidCommandValue(v);
};

const onClearMessage = () => {
  data.value.onResetCommandValue("");
};
const onSend = () => {};

watch(data.value.wsLoggers, (n, o) => {
  setTimeout(() => {
    loggerScroll.value.scrollToIndex(n.length);
  }, 10);
});
</script>

<style lang="scss" scoped>
.quick {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  //   transition: width 0.3s ease;
  user-select: none;
  :deep(.v-btn--icon.v-btn--density-default) {
    width: 24px;
    height: 24px;
  }
  .add-message {
    margin-right: 3px;
    margin-left: 2px;
  }
  .reduce {
    margin-top: 5px;
    margin-left: 7px;
    display: flex;
    flex-direction: column;
    // align-items: center;
  }
  .reduce-title {
    margin-left: 5px;
    margin-top: 5px;
    height: 100%;
    text-align: left;
    width: 14px;
  }

  .expand {
    display: flex;
    margin-top: 5px;
    margin-left: 7px;
  }

  .expand-title {
    display: block;
    margin-top: 3px;
    width: 104px;
    text-align: right;
    white-space: nowrap;
  }

  &-message-box {
    margin-top: 5px;
    height: calc(100% - 24px);
    overflow: auto;
  }

  &::after {
    content: "";
    top: 0;
    right: 0;
    position: absolute;
    border: 1px solid;
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    border-left: thin;
    height: 100%;
  }
}

.rwMessage {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;

  .message-list {
    padding: 5px;
    width: 100%;
    height: calc(100% - 250px);
    border-bottom: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .code-input {
    display: flex;
    position: relative;
    height: 210px;
    .left-box {
      width: calc(100% - 120px);
      height: 100%;
      padding: 5px;
    }
    .right-box {
      display: flex;
      position: absolute;
      flex-direction: column;
      right: 15px;
      bottom: 10px;
      .button {
        margin-top: 10px;
        width: 100px;
      }
    }
  }
}

.mini-button-group {
  display: flex;
  height: 40px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;

  .loadProtobuf {
    width: 28px;
    height: 28px;
  }
}

.logger {
  font-size: 12px;
  display: flex;
  justify-content: space-between;

  .logger-text-box {
    padding: 1px 0px;
    width: calc(100% - 85px);
    display: flex;
  }
  .logger-text {
    padding-left: 5px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .logger-time {
    width: 75px;
    user-select: none;
  }

  &:hover {
    background-color: #eeeeee !important;
  }
}
</style>
