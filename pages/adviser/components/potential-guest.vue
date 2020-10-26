<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    ref="memberRef"
                    :apiFn="apiFn"
                    :customQuery="customQuery" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { porentialGuestTable } from "@/pages/customer/const/agent.config";
import { customerRoleConfig } from "@/const";
import { member_by_dealer_api } from "@/api";

@Component
export default class PotentialGuest extends Vue {
  readonly componentName: string = "PotentialGuest";
  readonly apiFn: any = member_by_dealer_api;
  get customQuery() {
    return {
      adviserId: this.$route.params.id,
      role: customerRoleConfig.member
    };
  }
  readonly tableAttrs = {
    border: true,
    columns: [
      ...porentialGuestTable,
      {
        type: "operation",
        btns: [
          {
            text: "潜客详情",
            show: (row: any) => this.accessIsOpened("PERM:POSSIBLE_CUSTOMERS:VIEW"),
            atClick: (row: any) => this.goToDetail(row)
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
  consultantSet() {}
}
</script>