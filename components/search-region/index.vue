<template>
  <!-- 事业部-大区-经销商 -->
  <div>
    <el-form-item>
      <el-select v-model="_businessUnitId"
                 placeholder="事业部"
                 clearable
                 @change="businessChange">
        <el-option v-for="item in businessList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"
                   size="small">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="_regionId"
                 placeholder="大区"
                 @change="regionChange"
                 :disabled="!_businessUnitId"
                 clearable>
        <el-option v-for="item in regionList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"
                   size="small">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="_dealerCode"
                 placeholder="经销商"
                 :disabled="!_regionId"
                 clearable>
        <el-option v-for="item in dealerList"
                   :key="item.id"
                   :label="item.dealerName"
                   :value="item.dealerCode"
                   size="small">
        </el-option>
        <div>
          <el-pagination layout="prev, pager, next"
                         :page-size="10"
                         @current-change="handleCurrentChange"
                         :total="totalCount">
          </el-pagination>
        </div>
      </el-select>
    </el-form-item>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { getBu2Region, getFactoryDealer, dealer_buRegId_api } from "@/api/";

@Component
export default class SearchRegion extends Vue {
  // 事业部
  @PropSync("bId", {
    type: [String, Number],
    default: ""
  })
  _businessUnitId!: string | number;
  // 大区
  @PropSync("rId", {
    type: [String, Number],
    default: ""
  })
  _regionId!: string | number;
  // 经销商
  @PropSync("dId", {
    type: [String, Number],
    default: ""
  })
  _dealerCode!: string | number;
  // 是否是点击重置
  @PropSync("isClear", {
    type: Boolean,
    default: false
  })
  _isClear!: boolean;

  // 是否需要根据经销商code去反查询-大区和事业部
  @Prop({ type: [Boolean], default: false }) isReverse!: boolean;

  private businessList: any[] = [];
  private regionList: any[] = [];
  private dealerList: any[] = [];

  private defaultDealerCode: string | number;
  private defaultRegionId: string | number;
  private totalCount: number = 0;

  // 点击重置按钮-如果为空去请求数据
  @Watch("_isClear")
  isClearOnChange(newVal: any) {
    this._isClear ? this.getBusinessList() : "";
  }

  // 获取事业部
  private async getBusinessList() {
    let params = { buCodeList: "" };
    try {
      let { data } = await getBu2Region(params);
      this.businessList = data;
      // 如果只有一条数据，默认把数据填进去
      if (data.length === 1) {
        this._businessUnitId = data[0].id;
        this.businessChange(data[0].id);
        this.$emit("goSearch");
      }
      // 需要根据经销商code去反查询-大区和事业部 并且 存在经销商code
      if (this.isReverse && this._dealerCode) {
        this.defaultDealerCode = this._dealerCode;
        this.getBusnessAndRegion();
      }
      this._isClear = false;
    } catch (error) {
      this.log(error);
    }
  }
  // 获取大区
  private businessChange(buId: string | number, regId?: string | number) {
    this.clear();
    this.businessList.forEach((item: any) => {
      item.id === buId ? (this.regionList = item.regionList) : "";
    });
    // 如果传入 regId 说明是需要反查询
    if (regId) {
      this._regionId = regId;
      this.regionChange(regId, this.defaultDealerCode);
    }
  }
  // 大区改变
  private async regionChange(regId: string | number, dealerCode?: string | number) {
    this.dealerList = [];
    this.defaultRegionId = regId;
    this._dealerCode = "";
    if (!regId) {
      return;
    }
    // 如果传入 dealerCode 说明是需要反查询
    dealerCode ? this.getDealerList(1, regId, dealerCode) : this.getDealerList(1, regId);
  }
  // 获取经销商
  private async getDealerList(page: number, regId: string | number, dealerCode?: string | number) {
    try {
      let { data, totalCount } = await getFactoryDealer({ regionId: regId, page: page, size: 10 });
      this.dealerList = data;
      this.totalCount = totalCount;
      // 如果传入 regId 说明是需要反查询
      dealerCode ? (this._dealerCode = dealerCode) : "";
    } catch (error) {
      this.log(error);
    }
  }
  handleCurrentChange(e: any) {
    this._dealerCode = "";
    this.getDealerList(e, this.defaultRegionId);
  }

  // 如果只有 经销商code 说明需要反选-需要请求出 大区ID 事业部ID
  private async getBusnessAndRegion() {
    try {
      let { data } = await dealer_buRegId_api({ dealerCodes: this._dealerCode });
      let { buId, regId } = data[0];
      this._businessUnitId = buId;
      this._regionId = regId;
      this.businessChange(buId, regId);
    } catch (error) {
      this.log(error);
    }
  }

  private clear() {
    this.regionList = [];
    this.dealerList = [];
    this._regionId = "";
    this._dealerCode = "";
  }

  created() {
    this.getBusinessList();
  }
}
</script>
<style lang='scss' scoped>
</style>