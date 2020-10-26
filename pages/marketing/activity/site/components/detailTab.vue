<template>
  <div class="common_active-detail sites-active-detail">
    <div class="mb-15">
      <strong>活动设置</strong>
      <common-form :form="actDetailInfo" :props="constant.DETAIL_ACTIVE_PROP">
        <img class="active-img" alt="活动图片" :src="actDetailInfo.posterUrl" slot="posterUrl" />
        <el-button size="small" slot="description" @click="preview">预览</el-button>
      </common-form>
    </div>
    <div class="mb-15" v-if="actDetailInfo.campaignStatus > 0">
      <strong>现场工具</strong>
      <common-form :form="actDetailInfo" :props="constant.DETAIL_SITE_AWARDS_PROPS">
        <awardsSet
          slot="awardSet"
          class="mt-15"
          :data="actDetailInfo.prizeSettings"
          usedFrom="sites"
          activeType="sites"
        ></awardsSet>
      </common-form>
    </div>
    <div class="mb-15">
      <strong>分享设置</strong>
      <common-form :form="actDetailInfo.shareSetting || {}" :props="commonConst.DETAIL_SHARE_PROPS">
        <img
          class="share-img"
          :src="actDetailInfo.shareSetting && actDetailInfo.shareSetting.image"
          alt="分享图片"
          slot="image"
        />
      </common-form>
    </div>
    <preview-dialog
      :description="actDetailInfo.description"
      :dialogObj="preDialog"
      @hidePreview="hidePreview"
    ></preview-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import commonForm from "@/components/common-form/index.vue";
import commonTable from "@/components/common-table/index.vue";
import { State, Action } from "vuex-class";
import Const from "../const/index";
import * as commonConst from "../../const/common";
import awardsSet from "../../components/awardsSet.vue";
import previewDialog from "./previewDialog.vue";
import { DialogInfo } from "@/@types/activity";

@Component({
  name: "sitesDetail",
  components: {
    commonForm,
    commonTable,
    awardsSet,
    previewDialog
  }
})
export default class AdviserDetail extends Vue {
  @State(state => state.activity.actDetailInfo) private actDetailInfo!: any;
  @Action("getActDetailInfo", { namespace: "activity" })
  getActDetailInfo: Function;
  readonly commonConst: any = commonConst;
  readonly config: any = new Const(this);
  readonly constant: any = this.config.const;
  private sysPlat: any = "agent";
  private preDialog: DialogInfo = {
    title: "预览",
    show: false
  };
  hidePreview() {
    this.preDialog.show = true;
  }
  preview() {
    this.preDialog.show = true;
  }
  created() {
    this.sysPlat = this.$route.query.sysPlat;
    this.getActDetailInfo();
  }
}
</script>
<style lang="scss" scoped>
.sites-active-detail {
}
</style>
