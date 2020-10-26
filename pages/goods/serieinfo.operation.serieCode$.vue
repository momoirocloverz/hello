<template>
  <div>
    <breadcrumb-group :breadGroup="breadGroup" />
    <!-- {{serieForm}} -->
    <!-- {{highlightListForSubmit}} -->
    <!-- {{picturesForSubmit}} -->
    <!-- {{videoesForSubmit}} -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <img :src="serieForm.logo"
               class="se_logo">
        </el-col>
        <el-col :span="13">
          <el-form label-width="120px"
                   class="b_form">
            <el-form-item label="车系名称：">
              <b>{{ serieForm.name }}</b>
            </el-form-item>
            <el-form-item label="厂家指导价：">
              {{ serieData.minPrice ? BigNumber(serieData.minPrice).dividedBy(10000) : 0 }}
              ~
              {{ serieData.maxPrice ? BigNumber(serieData.maxPrice).dividedBy(10000) : 0 }}
              万元
            </el-form-item>
          </el-form>
        </el-col>

        <template v-if='accessIsOpened(`PERM:${accessKey}:EDIT`)'>
          <el-button size="mini"
                     class="go_edit_btn"
                     type="primary"
                     v-if="$route.query.sysPlat==='factory' && $route.params.operation==='view'"
                     :disabled="disabled"
                     @click="goEditGoodsItem">编辑</el-button>
        </template>
      </el-row>

      <div class="bgwt">
        <el-tabs v-model="currentStep">
          <el-tab-pane v-for="(item, i ) in componentList"
                       :key="item.name"
                       :label="item.label"
                       :name="i+''" />
        </el-tabs>
      </div>

      <keep-alive>
        <component :is="currentComponent"
                   ref="goodsDetailChildRef"
                   :stepWalk.sync="currentStep"
                   :serieData.sync="serieData"
                   :serieForm.sync="serieForm"
                   :modelData.sync="modelData"
                   :picturesForSubmit.sync="picturesForSubmit"
                   :videoesForSubmit.sync="videoesForSubmit">
          <div slot="header" />
          <div slot="footer" />
        </component>
      </keep-alive>
      <div class="ql-editor"
           v-show="currentComponent==='serieBasisView'"
           v-html="serieForm.introduction">
      </div>
    </el-card>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import serieOperationMixin from "./mixin/serie-operation.mixin";
import serieBasisView from "./components/serie-basis-view.vue";
import goodsAlbum from "./components/album.vue";
import goodsVideos from "./components/videos.vue";
import NProgress from "nprogress";
import { addSerie, modifySerie } from "@/api";
const brandCode = "geely";
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false,
  components: {
    serieBasisView,
    goodsAlbum,
    goodsVideos,
  },
})
export default class SerieOperation extends mixins(serieOperationMixin) {
  readonly BigNumber = BigNumber;
  readonly componentList: element.Tabs[] = [
    { label: "车系详情", name: "serieBasisView" },
    { label: "车系图片", name: "goodsAlbum" },
    { label: "车系视频", name: "goodsVideos" }
  ];
  get currentComponent() {
    return this.componentList[+this.currentStep].name
  };
  currentStep: string = '0';
  saveType: number | string;
  picturesForSubmit: vehicleConfig.Media[] = [];
  videoesForSubmit: vehicleConfig.Media[] = [];
  modelData: any = {};
  serieForm: any = {
    logo: "",
    name: "",
    externalCode: "",
    introduction: ""
  };
  serieData: any = {};

  goEditGoodsItem() {
    const { query, params, name } = this.$route
    this.$router.replace({
      name: "goods-serie",
      query,
      params: {
        ...params,
        operation: "edit"
      }
    })
  };
}
</script>
<style lang="scss" scoped>
.go_edit_btn {
  position: absolute;
  right: 15px;
  top: 25px;
  z-index: 33;
}
.se_logo {
  width: 100%;
}
/deep/ {
  .feature_item.active {
    border-color: #ddd;
    cursor: initial;
    &::before,
    &::after {
      display: none;
    }
  }
}
</style>