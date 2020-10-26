<!--活动设置-->
<template>
  <div class="active-set">
    <common-form
      ref="stepRef"
      :rules="siteCon.SITE_FORM_RULES"
      :props="siteCon.SITE_ACTIVE_PROP"
      :form="siteForm"
      :inline="false"
      class="common_active-set-form"
    >
      <div slot="location">
        <el-input
          type="text"
          @click.native="showMap"
          v-model="siteForm.location"
          placeholder="请选择位置"
          suffix-icon="el-icon-map-location"
        />
      </div>
      <div slot="memberLimit" class="common_limit-ipt">
        <el-radio-group v-model="siteForm.memberLimit" @change="changeLimit">
          <el-radio v-for="item in allCon.LIMIT_PERSON" :key="item.value" :value="item.value" :label="item.value">{{
            item.label
          }}</el-radio>
        </el-radio-group>
        <el-form-item :inline="true" prop="limitPerson" class="ipt-num">
          <el-input
            maxLength="6"
            :disabled="siteForm.memberLimit < 1"
            v-model="siteForm.limitPerson"
            style="width: 120px;margin: 0 5px"
          ></el-input>
          人
        </el-form-item>
      </div>
      <div slot="description">
        <el-button size="small" @click="preview" class="mb-15">预览</el-button>
        <quill-editor :content.sync="siteForm.description" @on-editor-blur="editBlur($event)"></quill-editor>
      </div>
    </common-form>
    <map-dialog :mapInPageCount="mapInPageCount" :dialogObj="mapDialog" @hideMap="hideMap" />
    <preview-dialog :description="siteForm.description" :dialogObj="preDialog" @hidePreview="hidePreview" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import QuillEditor from "@/components/vue-quill-editor";
import { DialogInfo } from "@/@types/activity";
import mapDialog from "../../components/mapDialog.vue";
import previewDialog from "./previewDialog.vue";
import * as CONST from "../../const/common";
@Component({
  name: "stepActiveSet",
  components: {
    CommonForm,
    QuillEditor,
    mapDialog,
    previewDialog
  }
})
export default class StepActiveSet extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @Prop({ default: () => {} }) private siteCon: any;
  @State(state => state.activity.siteForm) private siteForm!: any;
  @Action("setSiteForm", { namespace: "activity" })
  setSiteForm: Function;
  allCon: any = CONST;
  private mapDialog: DialogInfo = {
    title: "选择地点",
    show: false
  };
  private preDialog: DialogInfo = {
    title: "预览",
    show: false
  };
  mapInPageCount: number = 0;

  private showMap() {
    this.mapInPageCount += 1;
    this.mapDialog.show = true;
    this.mapDialog.title = "选择地点";
  }
  private hideMap(addr: any, lonLat: any, longitude: any, latitude: any) {
    this.mapDialog.show = false;
    this.setSiteForm({
      location: addr,
      latitude,
      longitude
    });
  }
  hidePreview() {
    this.preDialog.show = true;
  }
  preview() {
    this.preDialog.show = true;
  }
  editBlur(e: any) {
    this.stepRef.formRef.validateField("description");
  }
  changeLimit(val: any) {
    if (val === -1) {
      this.siteForm.limitPerson = null;
    }
  }
}
</script>
<style lang="scss">
.active-set {
  .quill-editor {
    .ql-container {
      max-height: 500px !important;
      overflow: auto;
    }
  }
}
</style>
