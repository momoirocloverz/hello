<!--活动状态组件-->
<template>
  <div class="a-status" :class="`status${row.campaignStatus}`">
    <span class="dot" :class="`dot${row.campaignStatus}`"></span>
    <span class="status">{{ statusText }}</span>
  </div>
</template>

<script lang="ts">
import Const from "../const/";

import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "activeStatus"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private row: any;
  @Prop({ default: () => "" }) private activeItem: string;
  readonly const: any = new Const(this).const;
  get statusText() {
    let { campaignStatus } = this.row;
    return this.activeItem === "agent"
      ? this.const.AGENT_STATUS_OBJ[campaignStatus] || "未投放"
      : this.const.GROUP_STATUS_OBJ[campaignStatus] || "未投放";
  }
}
</script>
