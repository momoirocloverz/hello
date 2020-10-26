<template>
  <div class="g-status" :class="{ enable: row.enabled }">
    <span class="dot" :class="`dot${row.enabled}`"></span>
    <span class="status">{{ statusText }}</span>
  </div>
</template>

<script lang="ts">


import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "activeStatus"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private row: any;

  get statusText() {
    let { enabled } = this.row;
    return enabled ? "启用" : "冻结";
  }
}
</script>
<style lang="scss">
.g-status {
  .dot{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $tip-color;

  }
  &.enable {
    .dot{
      background: $wechat-color;
    }
  }

}
</style>
