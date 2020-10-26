<template>
  <div class="stroeListAdd">
    <breadcrumb-group :breadGroup="[{label:'商品列表',to:'/goods/store/storeList'},{ label: editId ? '编辑商品' : '新增商品' }]" />

    <div class="line"
         v-show="operateType==='add'">
      <el-steps :active="activeStep"
                :space="200">
        <el-step title="商品类目">
        </el-step>
        <el-step title="商品设置"></el-step>
      </el-steps>
    </div>
    <div v-if="activeStep === 0"
         class="panel-one">
      <el-row :gutter="20">
        <el-col :span="8">
          <storeClassPanel :infoList.sync="oneInfoList"
                           :parentId="oneParentId"
                           :queryModelSearchAsync="oneQueryModelSearchAsync"
                           :selectItem="oneHandleSelect"
                           :loading="oneLoading"
                           :hasNoDateAdd="hasNoDateAdd"
                           :hasMsgAdd="hasMsgAdd"
                           @addSuc="addSuc"
                           title="1级类目"></storeClassPanel>
        </el-col>
        <el-col :span="8">
          <storeClassPanel :infoList.sync="twoInfoList"
                           :parentId="twoParentId"
                           :levelId="2"
                           :queryModelSearchAsync="twoQueryModelSearchAsync"
                           :selectItem="twoHandleSelect"
                           :loading="twoLoading"
                           :hasNoDateAdd="hasNoDateAdd"
                           :hasMsgAdd="hasMsgAdd"
                           :disabled="twoDisabled"
                           :selectOneName="selectOneName"
                           @addSuc="addSuc"
                           title="2级类目"></storeClassPanel>
        </el-col>
        <el-col :span="8">
          <storeClassPanel :infoList.sync="threeInfoList"
                           :parentId="threeParentId"
                           :levelId="3"
                           :disabled="threeDisabled"
                           :selectItem="threeHandleSelect"
                           :queryModelSearchAsync="threeQueryModelSearchAsync"
                           :hasNoDateAdd="hasNoDateAdd"
                           :hasMsgAdd="hasMsgAdd"
                           :loading="threeLoading"
                           :selectOneName="selectOneName"
                           :selectTwoName="selectTwoName"
                           @addSuc="addSuc"
                           title="3级类目"></storeClassPanel>
        </el-col>
      </el-row>
      <footer><span> 已选类目：</span>{{selectAllName}}</footer>
    </div>

    <div v-else>
      <waresForm ref="waresFormRef"
                 :selectText="selectAllName"
                 :activeStep.sync="activeStep"
                 :baseForm.sync="baseForm"
                 :specForSubmit.sync="specForSubmit"
                 :skuTitleList.sync="skuTitleList"
                 :introduction.sync="introduction"
                 :properties.sync="properties"
                 @changeCategory="lastTo"
                 @submitPage="submitPage"
                 @saveModify="modifyProductDetail" />
    </div>

    <div class="footer"
         v-show="activeStep===0">
      <el-button @click="cancel"
                 size="small">取消</el-button>
      <el-button @click="nextTo"
                 size="small"
                 type="primary"
                 :disabled="!category">下一步</el-button>

    </div>
    <storeSale :visible.sync="saleFormVisible"
               :setSaleId="saleId"
               :active="_active"
               @save="goToList"
               :code="saleCode"
               :name="setSaleName"
               :isReturnList="true"
               v-if="saleFormVisible"></storeSale>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import storeClassPanel from "./components/storeClassPanel.vue";
import waresForm from "./components/waresForm.vue";
import { mixins } from "vue-class-component";
import StoreClassPanelMixin from "./mixins/storeClassPanel.mixin";
import StoreOffSaleMixin from "./mixins/storeOffSale.mixin";
import NProgress from "nprogress";
import { addProduct, modifyProductDetail } from "@/api";
import StoreSale from "./components/storeSale.vue";
@Component({
  components: { waresForm, storeClassPanel, StoreSale }
})
export default class StoreListAdd extends mixins(StoreClassPanelMixin, StoreOffSaleMixin) {
  @Ref() readonly waresFormRef: any;
  private activeStep: number = 0;
  private standardForm: any = {};
  private selectText: string = "汽车用品 > 汽车改装 > 全车改装套件";

  private saleCode: number | string = 0;
  private setSaleName: string = "";
  private saleId: number | string = 0;
  private saleFormVisible: boolean = false;

  private baseForm: any = {
    brand: "",
    category: "",
    coverUrl: "",
    mainImg: [],
    minOrder: 1,
    minPack: "",
    productCode: "",
    name: "",
    desc: "",
    type: 1,
    vehicle: []
  };
  private skuTitleList: any[] = [];
  private specForSubmit: any[] = [];
  private introduction: string = "";
  private editId: number | string = "";
  private properties: any[] = [];

  get operateType() {
    return this.$route.params.operateType;
  }
  get _active(): number | string {
    return this.$route.params.type;
  }
  get hasNoDateAdd() {
    return this._active === "2";
  }
  get hasMsgAdd() {
    return this._active === "0";
  }

  private nextTo() {
    this.activeStep = 1;
  }
  private lastTo() {
    this.activeStep = 0;
  }
  private cancel() {
    this.$router.push("/goods/store/storeList");
  }
  private async submitPage(status = true) {
    // true 保存并上架
    try {
      const params = {
        status, // 上架状态，0已下架，1已上架
        ...this.baseForm,
        specs: this.specForSubmit,
        category: this.category,
        properties: this.properties
      };
      String(params.type) === "0" && delete params.vehicle;
      const { data } = await addProduct(params);

      // 点击的是保存按钮，成功后直接跳转
      status ? "" : this.showMsg("编辑成功");
      status ? this.storeSale(data) : this.goToList();
    } catch (e) {
      this.log(e);
    }
  }

  // 经销商上架
  agentSetSale(data: any) {
    this.saleCode = data.code;
    this.saleId = data.id;
    this.setSaleName = data.name;
    this.saleFormVisible = true;
  }
  // 保存并上架
  private storeSale(data: any) {
    this._active === "2" ? this.agentSetSale(data) : this.factorySetSale(data, true);
  }

  goToList() {
    this.$router.replace({
      name: "goods-store-storeList"
    });
  }
  async modifyProductDetail() {
    try {
      const params = {
        id: this.$route.params.id,
        ...this.baseForm,
        specs: this.specForSubmit,
        properties: this.properties
      };
      String(params.type) === "0" && delete params.vehicle;
      const { data } = await modifyProductDetail(params);
      this.showMsg("编辑成功");
      this.$router.replace({
        name: "goods-store-storeList"
      });
    } catch (e) {
      this.log(e);
    }
  }

  created() {
    this.editId = this.$route.params.id || "";
  }
  beforeMount() {
    this.operateType === "edit" && (this.activeStep = 1);
  }

  private beforeRouteLeaveCount: number = 1;
  beforeRouteLeave(to: any, from: any, next: any) {
    let t1 = "编辑信息未保存，确定要离开 ？";
    let t2 = "提示";
    const alertToChoose = () =>
      this.$confirm(t1, t2)
        .then(() => {
          next();
        })
        .catch(() => {
          NProgress.done();
        });
    if (this.beforeRouteLeaveCount === 1) {
      this.beforeRouteLeaveCount++;
      next();
    } else {
      if (this.activeStep === 1) {
        let res = this.waresFormRef.isModified();
        res && alertToChoose();
        !res && next();
      } else {
        next();
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.line {
  background: #fff;
  margin-top: -20px;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}
.panel-one {
  margin-top: 30px;
  footer {
    background: #fff;
    padding: 10px;
    font-size: 12px;
    margin-top: 10px;
    span {
      color: #827f7f;
    }
  }
}
/deep/ {
  .footer {
    display: flex;
    justify-content: center;
    @extend .line;
    margin-top: 20px;
  }
  .el-step__title {
    font-size: 13px;
  }
}
</style>