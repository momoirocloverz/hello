<template>
  <!-- 搜索框-意向车型 -->
  <el-cascader v-model="vehicleVal"
               :options="vehicleList"
               :props="props"
               clearable
               placeholder="请选择意向车型"
               @change="handleChange"></el-cascader>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import { seriesBrandCode, modelBySeriesCode } from "@/api";

const GEELY = "geely";

@Component
export default class SearchCare extends Vue {
  @PropSync("code", { type: String, default: "" }) _code: string;
  private vehicleVal: Array<string | number> = [];
  private vehicleList: any = [];
  private props: any = {
    label: "name",
    value: "code",
    lazy: true,
    lazyLoad: (node: any, resolve: any) => this._getSeriesApi(node, resolve)
  };
  @Watch("_code")
  codeChange(newVal: boolean, oldVal: boolean) {
    this.vehicleVal = !newVal ? [] : this.vehicleVal;
  }

  // 获取车型
  private async _getVehicleApi() {
    try {
      let { data } = await seriesBrandCode(GEELY);
      this.vehicleList = data;
    } catch (error) {
      this.log(error);
    }
  }
  // 获取车系
  private async _getSeriesApi(node: any, resolve: any) {
    let seriesCode = node.value;
    try {
      let { data = [] } = await modelBySeriesCode(seriesCode);
      data.map((item: any) => {
        item.leaf = true;
      });
      resolve(data);
    } catch (error) {
      resolve([]);
      this.log(error);
    }
  }

  private handleChange(val: Array<string>) {
    this._code = val[val.length - 1];
  }

  created() {
    this._getVehicleApi();
  }
}
</script>
<style lang='scss' scoped>
</style>