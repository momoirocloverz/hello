<template>
  <div class="appointment">
    <breadcrumb-group :breadGroup="[{label:'预约试驾',to:''}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    ref="adminTableRef"
                    :customQuery="customQuery"
                    :apiFn="getList"
                    :formData.sync="subForm">
      <template slot="search"
                class="search-head">
        <el-form-item prop="dealerName"
                      v-if="role === '0'">
          <SearchRegion :bId.sync="subForm.businessUnitId"
                        :rId.sync="subForm.regionId"
                        :dId.sync="subForm.dealerCode"
                        :isClear.sync="isClearRegion"
                        @goSearch="goSearchTab"></SearchRegion>
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input placeholder="客户姓名"
                    v-model="subForm.customerName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="customerPhone">
          <el-input placeholder="手机号"
                    v-model="subForm.customerPhone"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.vehicleSeriesCode"
                     placeholder="车系"
                     @change="changeSeries"
                     clearable>
            <el-option v-for="(item, index) in carSeries"
                       :key="index"
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgType">
          <el-select v-model="subForm.vehicleModelCode"
                     :disabled="subForm.vehicleSeriesCode?false:true"
                     placeholder="车型"
                     clearable>
            <el-option v-for="(item, index) in carModel"
                       :key="index"
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="counselorName"
                      v-if="role === '2'">
          <el-input placeholder="专属顾问"
                    v-model="subForm.counselorName"
                    clearable></el-input>
        </el-form-item>
      </template>
    </el-admin-table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import { roleInfoSetting, storeInfoSetting } from "@/utils/userSetting";
import { testDriveList } from "@/api/modules/appointment";
import { seriesBrandCode, modelBySeriesCode } from "@/api";
import SearchRegion from "@/components/search-region/index.vue";
import dayjs from "dayjs";
interface culmon {
  title: string;
  key: string;
}
interface SubForm {
  dealerName: string;
  customerName: string;
  customerPhone: string;
  vehicleSeriesCode: string;
  vehicleModelCode: string;
  counselorName: string;
  dealerCode: string;
  businessUnitId: string;
  regionId: string;
}
@Component({
  components: {
    SearchRegion
  }
})
export default class appointment extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  subForm: SubForm = {
    dealerName: "",
    customerName: "",
    customerPhone: "",
    vehicleSeriesCode: "",
    vehicleModelCode: "",
    counselorName: "",
    dealerCode: "",
    businessUnitId: "",
    regionId: ""
  };
  role: number | string = roleInfoSetting.getRole();
  get customQuery() {
    if (roleInfoSetting.getRole() === "2") {
      return {
        dealerCode: storeInfoSetting.getInfo().dealerCode
      };
    } else if (roleInfoSetting.getRole() === "0") {
      return {
        mfId: storeInfoSetting.getInfo().channelId
      };
    } else {
      return {};
    }
  }
  // 车系
  carSeries: any[] = [];
  carModel: any[] = [];
  dealerShow: any = {
    prop: "dealerName",
    key: "dealerName",
    label: "经销商名称"
  };
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        prop: "customerName",
        key: "customerName",
        label: "客户姓名"
      },
      {
        prop: "customerPhone",
        key: "customerPhone",
        label: this.role === "0" ? "手机号" : "联系电话"
      },
      {
        prop: "model",
        key: "model",
        label: "预约车型",
        formatter: (row: any) => {
          if (row.model && row.model.name) {
            return `${row.model.seriesName}-${row.model.name}`;
          } else {
            return row.model;
          }
        }
      },
      {
        prop: "appointmentDate",
        key: "appointmentDate",
        label: "预约时间",
        formatter: (row: any) => dayjs(row.appointmentDate).format("YYYY-MM-DD")
      },
      {
        prop: "adviserName",
        key: "adviserName",
        label: "专属顾问"
      },
      // {
      //   prop: "status",
      //   key: "status",
      //   label: "状态",
      //   render: (h: any, row: any) =>
      //     h(
      //       "div",
      //       {
      //         attrs: {
      //           class: `status${row.status}`
      //         }
      //       },
      //       row.status === 0 ? "未到店" : row.status === 1 ? "待评价" : row.status === 2 ? "已完成" : "已取消"
      //     )
      // },
      // {
      //   prop: "textComment",
      //   key: "textComment",
      //   label: "评价"
      // },
      {
        prop: "createdTime",
        key: "createdTime",
        label: "提交时间",
        formatter: (row: any) => dayjs(row.createdTime).format("YYYY-MM-DD HH:mm")
      }
    ]
  };
  changeSeries() {
    let code = this.subForm.vehicleSeriesCode;
    this.carModel = [];
    this.subForm.vehicleModelCode = "";
    if (code) {
      this.fctoryCarMol(code);
    }
  }
  async factoryCarSeries() {
    // 获取主机厂车系
    let { data } = await seriesBrandCode("geely");
    if (data) {
      this.carSeries = data;
    }
  }
  async fctoryCarMol(code: string) {
    let { data } = await modelBySeriesCode(code);
    if (data) {
      this.carModel = data;
    }
  }
  getList(param = this.subForm) {
    return testDriveList(param);
  }
  created() {
    if (this.role === "0") {
      this.tableAttrs.columns.unshift(this.dealerShow);
    }
    this.factoryCarSeries();
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .status0,
  .status1,
  .status2,
  .status3 {
    position: relative;
    margin-left: 15px;
  }
  .status0:before,
  .status1:before,
  .status2:before,
  .status3:before {
    position: absolute;
    left: -10px;
    bottom: 8px;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #0851ee;
    border-radius: 50%;
  }
  .status1:before {
    background-color: #ceba05;
  }
  .status2:before {
    background-color: #26c24d;
  }
  .status3:before {
    background-color: #ccc;
  }
}
</style>

