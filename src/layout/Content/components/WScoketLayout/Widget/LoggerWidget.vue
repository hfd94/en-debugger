<template>
  <v-tabs-window-item
    key="logger"
    value="logger"
    style="height: 100%; position: relative"
  >
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
            @click="data.onClearLogger"
          >
            <v-icon>mdi-cancel </v-icon>
          </v-btn>
        </template>
        <span>清空日志</span>
      </v-tooltip>
    </div>
    <v-virtual-scroll
      ref="virtualScroll"
      :items="data.loggers"
      class="message-list"
    >
      <template v-slot:default="{ item, index }">
        <div
          :key="item.time"
          class="logger-item"
          :class="{
            'bg-grey-lighten-4': (index + 1) % 2 == 0,
          }"
        >
          <div>
            <span v-if="item.level == 1" class="text-orange-accent-4 title">
              [Warn]
            </span>
            <span v-else-if="item.level == 2" class="text-red-darken-3 title">
              [Error]
            </span>
            <span class="title" v-else>[Info]</span>

            <span class="time">[{{ item.time }}]</span>
          </div>

          <div class="text">{{ item.value }}</div>
        </div>
      </template>
    </v-virtual-scroll>
  </v-tabs-window-item>
</template>

<script lang="ts" setup>
import { useRunningStore } from "@/stores";
import { computed, ref, watch } from "vue";

const props = defineProps({
  uuid: { type: String, required: true },
});

const virtualScroll = ref();
const { openWScoket } = useRunningStore();

const data = computed(() => {
  return openWScoket[props.uuid];
});

const logger = computed(() => {
  return data.value.loggers;
});
// scrollToIndex
watch(data.value.loggers, () => {
  console.log(virtualScroll.value);
});
</script>
<style lang="scss" scoped>
.message-list {
  padding: 5px;
  width: 100%;
  height: calc(100% - 35px);
  border-bottom: 1px solid;

  .title {
    user-select: none;
    display: inline-block;
    // font-family: "v-mono";
    font-weight: 400;
    // width: 47px;
    text-align: right;
  }

  .text {
    word-wrap: break-word;
  }

  .time {
    user-select: none;
    margin-left: 5px;
  }

  .logger-item {
    // padding-left: 52px;
    padding: 1px 5px;

    &:hover {
      background-color: #eeeeee !important;
    }
  }
}

.mini-button-group {
  display: flex;
  padding: 5px 20px;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  align-items: center;

  .loadProtobuf {
    width: 24px;
    height: 24px;
  }
}
</style>
