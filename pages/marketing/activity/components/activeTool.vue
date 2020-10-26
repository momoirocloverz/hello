<!--线下活动工具-->
<template>
  <div class="site-tool">
    <el-button
      type="text"
      size="small"
      :disabled="item.disabled"
      v-for="item in toolArr"
      :key="item.id"
      @click="clickItem(item)"
    >
      {{ item.label }}
    </el-button>
    <sign-dialog :dialogObj="dialogObj" :activeMode="activeMode" @goSign="goSign" v-if="dialogObj.show" :row="row" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SignDialog from "./signDialog.vue";
import { DialogInfo } from "@/@types/activity";
@Component({
  name: "siteTool",
  components: {
    SignDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) private toolArr: any;
  @Prop({ default: () => {} }) private row: any;
  @Prop({ default: "" }) private activeMode: string;

  private dialogObj: DialogInfo = {
    title: "现场签到",
    show: false,
    info: {}
  };
  pathMap: any = {
    1: "3dSignIn",
    2: "3dSignIn",
    3: "lotteryDraw"
  };
  clickItem(item: any) {
    if (item.id === 1) {
      this.dialogObj.show = true;
      this.dialogObj.title = "现场签到";
      this.dialogObj.type = "sign";
      this.dialogObj.info = item;
    } else if (item.id === 2) {
      this.jumpActivity(item);
    } else {
      this.jumpActivity(item);
    }
  }
  goSign(item: any) {
    this.jumpActivity(item);
  }
  jumpActivity(item: any) {
    let campaignId = this.row.campaignId || this.row.id;
    const prefix = location.origin + process.env.VUE_APP_PUBLIC_PATH || "/";
    const { sysPlat } = this.$route.query;
    window.open(
      `${prefix}marketing/activity/site/${this.pathMap[item.id]}?id=${campaignId}&imGroupId=${encodeURIComponent(
        this.row.imGroupId
      )}&releaseId=${this.row.releaseId}&sysPlat=${sysPlat}`,
      "_blank",
      "width=900,height=600,top=80px,left=100px,status=no,tollbar=no"
    );
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
.site-tool {
  .tool-item {
    display: inline-block;
    width: 55px;
    text-decoration: none;
    color: $primary-color;
  }
}
</style>
