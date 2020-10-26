<template>
  <!-- 经销商-潜客 -->
  <div class="potential">
    <breadcrumb-group :breadGroup="[{label:'潜客管理',to:''}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    ref="memberRef"
                    :apiFn="apiFn"
                    :customQuery="customQuery"
                    :totalCount.sync="totalCount"
                    :formData.sync="searchInfo">
      <template slot="search">
        <el-form-item prop="name">
          <el-input v-model="searchInfo.name"
                    placeholder="潜客姓名"
                    clearable />
        </el-form-item>
        <el-form-item prop="intentionCarModel">
          <SearchVehicle :code.sync="searchInfo.intentionCarModel"></SearchVehicle>
        </el-form-item>
        <el-form-item prop="adviserName">
          <el-input v-model="searchInfo.adviserName"
                    placeholder="专属顾问"
                    clearable />
        </el-form-item>
      </template>
      <b class="count"
         slot="top-content">潜客总数：{{totalCount}}</b>
    </el-admin-table>
    <select-adviser :memberUserId="memberUserId"
                    :oldAdviserName="oldAdviserName"
                    :visible.sync="adviserDialog"
                    @save="goSearch"
                    :adviserUserId="adviserUserId"></select-adviser>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import { customerRoleConfig } from "@/const";
import { agentMemberTableColumn } from "../const/agent.config";
import SearchVehicle from "../component/searchVehicle.vue";
import SelectAdviser from "../component/selectAdviser.vue";
import { member_by_dealer_api, memberList, changeMemberAdviser } from "@/api/index";

interface TableList {
  name: string;
  phone: string;
  intentionCarModel: string;
  adviserName: string;
  time: number;
}

@Component({
  components: { SearchVehicle, SelectAdviser }
})
export default class App extends Vue {
  readonly customQuery = { role: customerRoleConfig.member };
  @Ref() readonly memberRef: any;
  private adviserDialog: boolean = false;

  private apiFn: any = member_by_dealer_api;
  private totalCount: number = 0;
  private searchInfo = {
    name: "",
    intentionCarModel: "",
    adviserName: ""
  };
  private adviserUserId: number = 0;
  private memberUserId: number = 0;
  private oldAdviserName: string = '';
  private tableAttrs = {
    columns: [
      ...agentMemberTableColumn,
      {
        type: "operation",
        col: {
          width: "200px"
        },
        btns: [
          {
            text: "潜客详情",
            atClick: (row: any) => this.goToDetail(row),
            show: (row: any) => this.accessIsOpened("PERM:POSSIBLE_CUSTOMERS:VIEW")
          },
          {
            text: "变更顾问",
            atClick: (row: any) => this.changeAdvise(row),
            show: (row: any) => this.accessIsOpened("PERM:POSSIBLE_CUSTOMERS:EDIT")
          }
        ]
      }
    ]
  };

  private goToDetail(row: any) {
    this.$router.push({
      path: `/customer/member/detail/${row.memberUserId}`
    });
  }
  private changeAdvise({ memberUserId,adviserName,adviserId }: any) {
    this.adviserDialog = true;
    this.memberUserId = memberUserId;
    this.oldAdviserName =adviserName;
    this.adviserUserId = adviserId;
  }
  private goSearch() {
    this.memberRef.goSearch();
  }
}
</script>
<style lang='scss' scoped>
.count {
  margin-bottom: 15px;
  display: inline-block;
}
</style>