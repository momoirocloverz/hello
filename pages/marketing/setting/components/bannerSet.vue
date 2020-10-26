<!--商城首页-->
<template>
  <div :class="['banner-container', ` ${bannerType}`]" v-loading="loading">
    <!--预览start-->
    <div class="phone-preview">
      <el-carousel
        :height="carouselHeight"
        class="banner-wrap"
        arrow="never"
        :indicator-position="mallSet.length < 2 ? 'none' : 'outside'"
      >
        <el-carousel-item v-for="(item, idx) in mallSet" :key="idx">
          <img alt="" :src="item.setForm.url" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--预览end-->
    <!--设置start--->
    <div class="banner-set" ref="bannerRef">
      <div class="title">商城首页Banner设置</div>
      <div class="pic-set-list">
        <div class="pic-item-set" v-for="(set, idx) in mallSet" :key="idx">
          <div class="top">
            <span>图{{ idx + 1 }}</span>
            <span class="el-icon-delete" @click="deleteSet(idx)"></span>
          </div>
          <div class="form-content">
            <common-form
              :props="formProp"
              :ref="`setFormRef`"
              :form="set.setForm"
              :rules="constant.BANNER_RULES"
              size="small"
              label-width="140px"
            >
              <el-radio-group slot="type" v-model="set.setForm.type" @change="changeRadio(set, idx)">
                <el-radio v-for="(item, idx) in constant.CONTENT_ARR" :key="idx" :label="item.value">{{
                  item.label
                }}</el-radio>
              </el-radio-group>
              <div slot="info">
                <el-button size="small" @click="relationSet(set, idx)">{{ set.chooseLabel }}</el-button>
                <span class="mt-15 ml-15">已选：{{ set.setForm.info ? 1 : 0 }}</span>
              </div>
            </common-form>
          </div>
        </div>
      </div>
      <div class="add-wrap" v-if="mallSet.length < 3">
        <el-button type="text" icon="el-icon-plus" size="small" @click="addSet">添加</el-button>
      </div>
      <el-button size="small" type="primary" @click="handleSave" class="mt-15" v-if="hasEditPer">保存</el-button>
    </div>
    <!--设置end-->
    <choose-relate-dialog
      v-if="dialogInfo.show"
      :currentForm="currentForm"
      :dialogObj="dialogInfo"
      @handleSure="chooseInfo"
      @handleClose="handleClose"
    />
  </div>
</template>

<script lang="ts">
import CommonForm from "@/components/common-form/index.vue";
import ChooseRelateDialog from "./chooseRelateDialog.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import Const from "../const";
import _ from "lodash";
import { DialogInfo } from "@/@types/activity";
import { getMallBanner, getInteractBanner, createActivityBanner, createHomeBanner } from "@/api";
interface SetForm {
  id: number;
  type?: number;
  releaseId?: number;
  campaignType?: number;
  vehicleCode?: any;
  info: any;
  url: string;
}
interface SetItem {
  setForm: SetForm;
  relateLabel: string;
  chooseLabel: string;
}

@Component({
  name: "bannerSet",
  components: {
    CommonForm,
    ChooseRelateDialog
  }
})
export default class extends Vue {
  @Prop({ default: "mall" }) private bannerType: string;
  initItem: SetItem = {
    setForm: {
      type: 0,
      id: 1,
      info: null,
      url: ""
    },
    relateLabel: "关联活动",
    chooseLabel: "选择活动"
  };

  loading: Boolean = false;
  currentForm: any = {};
  curIdx: number = 0;
  private mallSet: SetItem[] = [_.cloneDeep(this.initItem)];
  currentSet: SetItem = this.mallSet[0];
  dialogInfo: DialogInfo = {
    show: false,
    type: "active",
    title: "关联活动",
    info: {}
  };
  get hasEditPer(): boolean {
    return this.accessIsOpened("PERM:MALL_BANNER:EDIT");
  }
  get formProp(): Array<any> {
    return this.bannerType === "mall" ? this.constant.BANNER_SET_PROPS : this.constant.GIFT_BANNER_PROPS;
  }
  get carouselHeight(): string {
    return this.bannerType === "mall" ? "140px" : "170px";
  }
  get constant() {
    return new Const(this).const;
  }
  get choosedName() {
    return this.currentForm.info && this.currentForm.info.name;
  }
  private changeRadio(set: SetItem, idx: number) {
    let _obj: any = this.constant.CONTENT_ARR.find((val: any) => val.value === set.setForm.type);
    set.setForm.info = null;
    set.relateLabel = `关联${_obj.label}`;
    set.chooseLabel = `选择${_obj.label}`;
    this.currentForm.releaseId = null;
    this.currentForm.campaignType = null;
    this.currentForm.vehicleCode = null;
    this.currentForm.vehicleType = null;
  }
  private deleteSet(idx: number): void {
    this.mallSet.splice(idx, 1);
    this.currentForm = _.cloneDeep({
      type: 0,
      id: 1,
      info: null,
      url: ""
    });
  }
  private addSet() {
    if (this.mallSet.length < 3) {
      this.mallSet.push(_.cloneDeep(this.initItem));
    }
  }
  private relationSet(set: SetItem, idx: number) {
    this.currentSet = set;
    this.currentForm = _.cloneDeep(set.setForm);
    this.curIdx = idx;
    this.dialogInfo.title = set.relateLabel;
    this.dialogInfo.show = true;
    this.dialogInfo.info = set;
    this.dialogInfo.type = this.currentForm.type === 1 ? "goods" : "active";
  }
  private chooseInfo(row: any, parent: any): void {
    let { type } = this.currentForm;
    if (type === 0 || type === 2) {
      this.currentForm.info = row.id;
      // 活动
      this.currentForm.releaseId = row.id;
      this.currentForm.campaignType = row.type;
    } else {
      // 商品
      this.currentForm.info = row.code;
      this.currentForm.vehicleCode = row.code;
      this.currentForm.vehicleType = 1;
    }
    this.mallSet[this.curIdx].setForm = _.cloneDeep(this.currentForm);
    this.handleClose();
  }
  private handleClose(): void {
    this.dialogInfo.show = false;
    this.dialogInfo.type = "";
    this.dialogInfo.info = {};
  }

  private handleSave() {
    let results: Array<Promise<any>> = [];
    let $setFormRefs: any = this.$refs.setFormRef;
    $setFormRefs.forEach((ref: HTMLFormElement) => {
      let pro = ref.formRef.validate();
      results.push(pro);
    });
    Promise.all(results).then(() => {
      let _arr: Array<any> = [];
      this.mallSet.forEach((item: any, idx: number) => {
        console.log(item.setForm);
        let { type, campaignType, releaseId, vehicleCode, url } = item.setForm;
        _arr.push({
          serialNumber: idx + 1,
          type: this.bannerType === "mall" ? type : 2,
          campaignType,
          releaseId,
          vehicleCode: type === 1 ? vehicleCode : null,
          vehicleType: type === 1 ? 1 : null,
          url
        });
      });
      this.createBanner(_arr);
    });
  }
  async createBanner(data: any) {
    try {
      this.loading = true;
      if (this.bannerType === "mall") {
        await createHomeBanner(data);
      } else {
        await createActivityBanner(data);
      }
      this.$message.success("创建成功");
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }
  async getBannerList() {
    this.loading = true;
    let res: any = {};
    if (this.bannerType === "mall") {
      res = await getMallBanner();
    } else {
      res = await getInteractBanner();
    }
    this.loading = false;

    this.mallSet = [];
    let resData: any = res.data || [];
    resData.forEach((item: any) => {
      let { type, id, info, url, vehicleCode, campaignType, releaseId } = item;
      this.mallSet.push({
        setForm: {
          type,
          id,
          releaseId,
          vehicleCode,
          campaignType,
          info: type === 0 || type === 2 ? releaseId : vehicleCode,
          url
        },
        relateLabel: this.bannerType === "mall" ? (type === 0 ? "关联活动" : "关联商品") : "关联活动",
        chooseLabel: this.bannerType === "mall" ? (type === 0 ? "选择活动" : "选择商品") : "选择活动"
      });
    });
    console.log(this.mallSet);
  }
  created() {
    this.getBannerList();
  }
}
</script>

<style scoped lang="scss">
.banner-container {
  display: flex;
  flex-direction: row;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #ebeef5;
  .phone-preview {
    position: relative;
    width: 375px;
    height: 800px;
    max-width: 350px;
    margin-bottom: 20px;
    background: #f5f5f5;
    background: url("../../../../assets/images/activity/home.png") no-repeat;
    background-size: contain;
    .banner-wrap {
      position: absolute;
      top: 95px;
      width: 100%;
      .el-carousel-item {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .banner-set {
    flex: 1;
    padding-left: 20px;
    .title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .upload-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 120px;
      border: 1px dashed #ccc;
      .el-icon-plus {
        color: #ccc;
        font-size: 24px;
      }
    }
    .pic-set-list {
      width: 100%;
      .form-content {
        padding: 10px 0;
      }
      .pic-item-set {
        width: 100%;
        border: 1px solid #e6e6e6;
        margin-bottom: 15px;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 40px;
          line-height: 40px;
          background: #f5f5f5;
          padding: 0 15px;
          border-bottom: 1px solid #e6e6e6;

          .el-icon-delete {
            cursor: pointer;
            color: $primary-color;
          }
        }
      }
    }
    .add-wrap {
      width: 100%;
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
      margin-top: 20px;
      padding: 0 15px;
      margin-bottom: 15px;
    }
  }
  &.mall {
    .phone-preview {
      background: url("../../../../assets/images/activity/home.png") no-repeat;
      background-size: contain;
    }
  }
  &.interact {
    .phone-preview {
      background: url("../../../../assets/images/activity/interact.png") no-repeat;
      background-size: contain;
    }
  }
}
</style>
