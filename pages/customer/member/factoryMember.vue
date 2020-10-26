<template>
  <!-- 主机厂潜客 -->
  <div class="factoryMember">
    <breadcrumb-group :breadGroup="[{label:'潜客管理',to:''}]" />
    <el-admin-table :formData.sync="formData"
                    :customQuery="customQuery"
                    :tableAttrs="tableAttrs"
                    :totalCount.sync="totalCount"
                    :apiFn="apiFn"
                    @reset="resetTabRegion"
                    ref="tableRef">
      <template slot="search"
                class="search-head">
        <SearchRegion :bId.sync="formData.buId"
                      :rId.sync="formData.regId"
                      :dId.sync="formData.dealerCode"
                      :isReverse="true"
                      :isClear.sync="isClearRegion"
                      @goSearch="goSearchTab"></SearchRegion>
        <el-form-item prop="name">
          <el-input v-model="formData.name"
                    size="small"
                    placeholder="潜客姓名"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="intentionCarModel">
          <SearchVehicle :code.sync="formData.intentionCarModel"></SearchVehicle>
        </el-form-item>
      </template>
      <b class="count"
         slot="top-content">潜客总数：{{totalCount}}</b>
    </el-admin-table>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { member_by_factory_api } from "@/api/index";
import { customerRoleConfig } from "@/const";
import SearchVehicle from "../component/searchVehicle.vue";
import SearchRegion from "@/components/search-region/index.vue";
import dayjs from "dayjs";
/* eslint-disable-next-line */
import { FansList, FactoryTableList } from "@/@types/custom.ts";

@Component({
  components: {
    SearchVehicle,
    SearchRegion
  }
})
export default class App extends Vue {
  readonly customQuery = { role: customerRoleConfig.member };
  private apiFn: any = member_by_factory_api;
  private totalCount: number = 0;
  private formData: any = { name: "", intentionCarModel: "", buId: "", dealerCode: "", regId: "" };
  private readonly tableAttrs = {
    border: true,
    hasSearch: true,
    columns: [
      {
        prop: "dealerName",
        label: "经销商名称"
      },
      {
        prop: "name",
        label: "潜客姓名"
      },
      {
        prop: "phone",
        label: "潜客手机号"
      },
      {
        prop: "intentionCarModel",
        label: "意向车型",
        formatter: (row: any) =>
          `${row.intentionCarSeries ? row.intentionCarSeries : ""}-${
            row.intentionCarModel ? row.intentionCarModel : ""
          }`
      },
      {
        prop: "adviserName",
        label: "专属顾问"
      },
      {
        prop: "time",
        label: "最近互动时间",
        formatter: (row: FactoryTableList) => (row.time && dayjs(row.time).format("YYYY.MM.DD HH:mm")) || "—"
      },
      {
        type: "operation",
        btns: [
          {
            text: "潜客详情",
            atClick: (row: FactoryTableList) => this.goToDetail(row),
            show: (row: any) => this.accessIsOpened("PERM:POSSIBLE_CUSTOMERS:VIEW")
          }
        ]
      }
    ]
  };
  private filterLabel(labelVal: Array<string>): string {
    return labelVal.join();
  }
  private goToDetail(row: FactoryTableList) {
    this.$router.push({
      path: `/customer/member/detail/${row.memberUserId}`
    });
  }

  created() {
    let dealerCode = this.$route.query.dealerCode || "";
    this.formData.dealerCode = dealerCode;
  }
}
</script>
<style lang='scss' scoped>
.count {
  margin-bottom: 15px;
  display: inline-block;
}
</style>