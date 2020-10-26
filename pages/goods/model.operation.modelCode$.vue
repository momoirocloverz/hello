<template>
  <div class="goods_detail">
    <breadcrumb-group :breadGroup="breadGroup" />
    <!-- {{basisForm}}<br> -->
    <!-- {{highlightListForSubmit}}<br> -->
    <!-- {{configForSubmit}}<br> -->
    <!-- {{picturesForSubmit}}<br> -->
    <!-- {{videoesForSubmit}} -->
    <div class="bgwt">
      <el-tabs v-model="currentStep"
               :before-leave="beforeLeave">
        <el-tab-pane v-for="(item, i ) in componentList"
                     :key="item.name"
                     :label="item.label"
                     :name="i+''"
                     :disabled="tabDisabled" />
      </el-tabs>
      <template v-if='accessIsOpened(`PERM:${accessKey}:EDIT`)'>
        <el-button size="mini"
                   class="go_edit_btn"
                   type="primary"
                   v-if="$route.query.sysPlat==='factory' && $route.params.operation==='view'"
                   :disabled="disabled"
                   @click="goEditGoodsItem">编辑</el-button>
      </template>
    </div>

    <keep-alive>
      <component :is="currentComponent"
                 ref="goodsDetailChildRef"
                 :stepWalk.sync="currentStep"
                 :basisForm.sync="basisForm"
                 :modelData.sync="modelData"
                 :configForSubmit.sync="configForSubmit"
                 @onlySave="onlySave"
                 @publish="publish" />
    </keep-alive>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Ref } from 'vue-property-decorator';
import modelBasis from "./components/model-basis.vue";
import goodsVehicleConfig from "./components/vehicle-config.vue";
import { addNewVehicle } from "@/api";
// import dialogAgentOperetion from "./components/dialog-agent-operation.vue"
import NProgress from "nprogress";
const BigNumber = require('bignumber.js');
const type = "MODEL";

@Component({
  components: {
    modelBasis,
    goodsVehicleConfig,
    // dialogAgentOperetion
  },
})
export default class GoodsDetail extends Vue {
  @Ref() readonly goodsDetailChildRef: any;
  readonly componentList: element.Tabs[] = [
    { label: "基本配置", name: "modelBasis" },
    { label: "车型配置", name: "goodsVehicleConfig" },
  ];
  get accessKey() {
    return this.$route.query.sysPlat === 'factory' ? 'MODEL_MANAGE' : 'MODEL'
  }
  get currentComponent() {
    return this.componentList[+this.currentStep].name
  };
  get disabled() {
    return this.$route.query.operation === 'view'
  }
  get operation() {
    return this.$route.params.operation
  }
  get modelCode() {
    return this.$route.params.modelCode
  }
  get sysPlat() {
    return this.$route.query.sysPlat
  }
  get serie() {
    return this.$route.query.serie
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
  saveType: number | string;
  basisForm: any = {
    logo: '',
    name: '',
    guidePrice: '',
    // listingDate: new Date(new Date().toDateString()),
    listingDate: '',
    // introduction: '',
  };
  configForSubmit: vehicleConfig.ConfigSub = {};
  res2Submit: any = {}; // 待提交数据
  currentStep: string = '0';
  currentStepMirror: number = 0;
  onSaveLoading: boolean = false;
  needRouteCheck: boolean = true;
  @Watch("currentStep")
  currentStepChange(newVal: string, oldVal: string) {
    if (Number(newVal) > Number(oldVal)) {
      this.currentStepMirror = Number(newVal);
    }
  }
  get btnsLoading() {
    return Object.keys(this.modelData).length <= 0;
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
      ...this.basisForm,
      guidePrice: Number(BigNumber(this.basisForm.guidePrice).multipliedBy(10000)), // 覆盖 basisForm的指导价
      status,
      configValues: this.configForSubmit.configValues,
      modelConfigGroups: this.configForSubmit.modelConfigGroups,
      seriesCode: this.$route.query.serie,
    }
    return obj
  }
  onlySave() {
    this.res2Submit = this.formatObj(0);
    if (this.onSaveLoading) return;
    this.onSaveLoading = true;
    this.addNewVehicle()
  };
  publish() {
    this.res2Submit = this.formatObj(1);
    if (this.onSaveLoading) return;
    this.onSaveLoading = true;
    this.addNewVehicle()
  };
  async addNewVehicle() {
    if (this.operation !== 'add') return;
    this.needRouteCheck = true;
    try {
      const { data } = await addNewVehicle(this.res2Submit);
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
  /**
   * @description 离开时候的校验，vue缺陷，调用两次这个钩子，跟路由守卫有关
   */
  private beforeRouteLeaveCount: number = 1;
  beforeRouteLeave(to: any, from: any, next: any) {
    let t1 = "编辑信息未保存，确定要离开 ？";
    let t2 = "提示";
    const alertToChoose = () => this.$confirm(t1, t2).then(() => {
      next()
    }).catch(() => {
      NProgress.done();
      this.beforeRouteLeaveCount = 1;
    })

    if (this.beforeRouteLeaveCount === 1) {
      this.beforeRouteLeaveCount++
      next()
    } else if (this.currentStep === '3') {
      if (this.operation === 'add' && this.needRouteCheck) {
        alertToChoose()
      } else {
        let t = this.goodsDetailChildRef.backWithoutSave(false)
        if (this.needRouteCheck && t) {
          alertToChoose()
        } else {
          next()
        }
      }
    } else {
      let t = this.goodsDetailChildRef.backWithoutSave(false)
      if (t) {
        alertToChoose()
      } else {
        next()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #fff;
.bgwt {
  background: $bg;
  position: sticky;
  top: 0;
  z-index: 3;
  border-bottom: 2px solid #e4e7ed;
}
.el-tabs {
  width: 90%;
}
/deep/ {
  .el-tabs__nav-wrap {
    padding-left: 20px;
  }
  .el-tabs__item.is-disabled {
    color: #222;
  }
  .content {
    background: $bg;
    padding: 20px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .step_btn {
    width: 100px;
  }
  .tecenter {
    margin-top: 20px;
    text-align: center;
  }
  .el-input.is-disabled .el-input__inner {
    color: #777;
  }
}
.goods_detail {
  position: relative;
  border-radius: 4px;
  min-height: 100%;
}
.go_edit_btn {
  position: absolute;
  right: 15px;
  top: 5px;
  z-index: 33;
}
</style>
