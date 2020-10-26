<template>
  <div>
    <breadcrumb-group :breadGroup="breadGroup" />

    <el-card class="goods_detail">
      <el-row>
        <el-col :span="7">
          <img :src="basisForm.logo"
               class="b_logo">
        </el-col>
        <el-col :span="12"
                :offset="1">
          <el-form label-width="120px"
                   class="b_form">
            <el-form-item label="车型名称：">
              <b>{{ basisForm.name }}</b>
            </el-form-item>
            <el-form-item label="厂家指导价：">
              {{ basisForm.guidePrice }} 万元
            </el-form-item>
            <el-form-item label="上市日期：">
              {{ basisForm.listingDate?dayjs(basisForm.listingDate).format('YYYY-MM-DD'):'-' }}
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4"
                v-if='accessIsOpened(`PERM:${accessKey}:EDIT`)'>
          <el-button @click="goEditGoodsItem"
                     size="small"
                     :disabled="disabled"
                     v-if="$route.query.sysPlat==='factory' && $route.params.operation==='view'"
                     type="primary">编辑</el-button>
          <dialogAgentOperetion :showAgentDialog="sysPlat==='agent'"
                                :infoRow.sync="modelData"
                                :btnsLoading="btnsLoading" />
        </el-col>
      </el-row>

      <!-- <div class="bgwt">
        <el-tabs v-model="currentComponent">
          <el-tab-pane v-for="item in componentList"
                       :key="item.name"
                       :label="item.label"
                       :name="item.name" />
        </el-tabs>
      </div> -->
      <modelBasisView v-show="false"
                      :basisForm.sync="basisForm"
                      :modelData.sync="modelData">
        <div slot="header" />
        <div slot="footer" />
      </modelBasisView>
      <goodsVehicleConfig :configForSubmit.sync="configForSubmit">
        <div slot="header" />
        <div slot="footer" />
      </goodsVehicleConfig>
      <!-- <div v-show="currentComponent==='modelBasisView'"
           v-html="basisForm.introduction">
      </div> -->

      <el-backtop target="#theme-container-main" />
    </el-card>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue, Ref } from 'vue-property-decorator';
import modelBasisView from "./components/model-basis-view.vue";
import dialogAgentOperetion from "./components/dialog-agent-operation.vue";
import goodsVehicleConfig from "./components/vehicle-config.vue";
import AgentDialogMixin from "./mixin/agent-dialog.mixin";
import dayjs from "dayjs";

@Component({
  components: {
    modelBasisView,
    goodsVehicleConfig,
    dialogAgentOperetion
  },
})
export default class ModelDetail extends Vue {
  readonly dayjs = dayjs;
  readonly componentList: element.Tabs[] = [
    // { label: "车辆详情", name: "modelBasisView" },
    { label: "车型配置", name: "goodsVehicleConfig" }
  ];
  currentComponent: string = 'goodsVehicleConfig';

  get disabled() {
    return this.$route.query.operation === 'view'
  }
  get sysPlat() {
    return this.$route.query.sysPlat
  }
  get operation() {
    return this.$route.params.operation
  }
  get accessKey() {
    return this.$route.query.sysPlat === 'factory' ? 'MODEL_MANAGE' : 'MODEL'
  }
  get breadGroup() {
    const parent = this.sysPlat === 'factory' ? '/goods/list-factory' : '/goods/list-agent';
    const label = this.operation === 'add'
      ? '新建车型'
      : this.operation === 'view'
        ? '车型详情'
        : '编辑车型'
    return [{ label: '车型管理', to: parent }, { label }]
  }
  modelData: any = {};
  basisForm: any = {};
  configForSubmit: vehicleConfig.ConfigSub = {};
  picturesForSubmit: vehicleConfig.Media[] = [];
  videoesForSubmit: vehicleConfig.Media[] = [];
  get btnsLoading() {
    return Object.keys(this.modelData).length <= 0;
  };

  goEditGoodsItem() {
    const { query, params } = this.$route
    this.$router.replace({
      name: 'goods-model',
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
.goods_detail {
  margin-top: 20px;
}
.bgwt {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 333;
}
.b_logo {
  width: 100%;
}
.b_form {
  width: 400px;
}
/deep/ {
  .param_box {
    .content {
      margin-top: 0;
    }
  }
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