<template>
  <div class="serie__box">
    <breadcrumb-group :breadGroup="breadGroup" />
    <!-- {{serieForm}} -->
    <!-- {{highlightListForSubmit}} -->
    <!-- {{picturesForSubmit}} -->
    <!-- {{videoesForSubmit}} -->
    <el-card>
      <div class="bgwt">
        <el-tabs v-model="currentStep"
                 :before-leave="beforeLeave">
          <el-tab-pane v-for="(item, i ) in componentList"
                       :key="item.name"
                       :label="item.label"
                       :name="i+''"
                       :disabled="tabDisabled" />
        </el-tabs>
      </div>

      <keep-alive>
        <component :is="currentComponent"
                   ref="goodsDetailChildRef"
                   :stepWalk.sync="currentStep"
                   :serieForm.sync="serieForm"
                   :modelData.sync="modelData"
                   :highlightListForSubmit.sync="highlightListForSubmit"
                   :picturesForSubmit.sync="picturesForSubmit"
                   :videoesForSubmit.sync="videoesForSubmit"
                   @onlySave="onlySave"
                   @publish="publish" />
      </keep-alive>
    </el-card>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import serieOperationMixin from "./mixin/serie-operation.mixin";
import goodsDetailHighlight from "./components/detail-highlight.vue";
import serieBasis from "./components/serie-basis.vue";
import goodsAlbum from "./components/album.vue";
import goodsVideos from "./components/videos.vue";
import NProgress from "nprogress";
import { addSerie, modifySerie } from "@/api";
const brandCode = "geely";
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false,
  components: {
    serieBasis,
    goodsDetailHighlight,
    goodsAlbum,
    goodsVideos,
  },
})
export default class SerieOperation extends mixins(serieOperationMixin) {
  readonly componentList: element.Tabs[] = [
    { label: "基本信息", name: "serieBasis" },
    { label: "亮点配置", name: "goodsDetailHighlight" },
    { label: "车系图片", name: "goodsAlbum" },
    { label: "车系视频", name: "goodsVideos" }
  ];
  currentStep: string = '0';
  get btnsLoading() {
    return Object.keys(this.modelData).length <= 0;
  };
  saveType: number | string;
  highlightListForSubmit: any[] = [];
  picturesForSubmit: vehicleConfig.Media[] = [];
  videoesForSubmit: vehicleConfig.Media[] = [];
  res2Submit: any = {}; // 待提交数据
  currentStepMirror: number = 0;
  onSaveLoading: boolean = false;
  needRouteCheck: boolean = true;
  modelData: any = {};
  serieForm: any = {
    logo: "",
    name: "",
    externalCode: "",
    introduction: ""
  };
  @Watch("currentStep")
  currentStepChange(newVal: string, oldVal: string) {
    if (Number(newVal) > Number(oldVal)) {
      this.currentStepMirror = Number(newVal);
    }
  }
  get tabDisabled() {
    return this.operation === 'add'
  }
  beforeLeave(activeName: string, oldActiveName: string) {
    const { operation, currentStepMirror } = this;
    if (operation === 'add') {
      return currentStepMirror >= Number(activeName)
    }
  }
  formatObj(status: number | string) {
    this.saveType = status;
    let obj = {
      brandCode,
      ...this.serieForm,
      highlightsIds: this.highlightListForSubmit,
      vehicleExternalResourcesList: [
        this.formatResourceList('PICTURE'),
        this.formatResourceList('VIDEO')
      ]
    }
    if (status === 0) {
      obj.code = this.$route.query.serieCode
    }
    return obj
  }
  formatResourceList(urlType: string) {
    const urlList = urlType === 'PICTURE'
      ? this.picturesForSubmit
      : this.videoesForSubmit;
    return {
      code: this.serieCode,
      urlList,
      urlType
    }
  }
  onlySave() {
    this.res2Submit = this.formatObj(0);
    if (this.onSaveLoading) return;
    this.onSaveLoading = true;
    this.addSerie()
  };
  publish() {
    this.res2Submit = this.formatObj(1);
    if (this.onSaveLoading) return;
    this.onSaveLoading = true;
    this.addSerie()
  };
  async addSerie() {
    if (this.operation !== 'add') return;
    this.needRouteCheck = true;
    try {
      const { data } = await addSerie(this.res2Submit);
      if (data) {
        this.showMsg(`${this.saveType === 0 ? '保存' : '发布'}成功`);
        this.needRouteCheck = false;
        this.$router.replace({
          name: "goods-list-factory"
        })
      }
      this.onSaveLoading = false;
    } catch (e) {
      this.onSaveLoading = false;
      this.log(e)
    }
  };
  goEditGoodsItem() {
    const { query, params, name } = this.$route
    this.$router.replace({
      name,
      query,
      params: {
        ...params,
        operation: "edit"
      }
    })
  };
}
</script>
<style lang="scss">
.serie__box {
  .el-tabs__item.is-disabled {
    color: #222;
  }
}
</style>