<template>
  <!-- 潜客管理 -->
  <div class="potential">
    <breadcrumb-group :breadGroup="[{label:'潜客管理',to:routerTo},{label:'潜客详情',to:''}]" />
    <user-panel :info="userInfo"
                :id="accountId"
                @goSearch="goSearch"></user-panel>
    <el-tabs v-model="activeTab"
             class="tabs">
      <el-tab-pane v-for="(item,index) of tagList"
                   :key="index"
                   :label="item.label"
                   :name="item.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component v-bind:is="activeTab"
                 :id="accountId"
                 :role="role"></component>
    </keep-alive>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UserPanel from "./../component/userInfo.vue";
import BrowseTable from "./../component/browseTable.vue";
import CollectionTable from "./../component/collectionTable.vue";
import ReserveTable from "./../component/reserveTable.vue";
import TestDriveTable from "./../component/testDriveTable.vue";
import ChatTable from "./../component/chatTable.vue";
import { roleInfoSetting } from "@/utils/userSetting";
import { member_by_factory_detail_api, member_by_dealer_detail_api } from "@/api";
/* eslint-disable-next-line */
import { UserInfo } from "@/@types/custom.ts";

@Component({
  components: {
    UserPanel,
    BrowseTable,
    CollectionTable,
    ReserveTable,
    TestDriveTable,
    ChatTable
  }
})
export default class App extends Vue {
  private activeTab: string = "ReserveTable";
  private tagList = [
    {
      name: "ReserveTable",
      label: "车辆预订记录"
    },
    {
      name: "TestDriveTable",
      label: "预约试驾记录"
    },
    {
      name: "ChatTable",
      label: "沟通记录"
    },
    {
      name: "BrowseTable",
      label: "浏览记录"
    },
    {
      name: "CollectionTable",
      label: "收藏记录"
    }
  ];
  private userInfo: UserInfo = {
    name: "",
    header: "",
    sex: "",
    tel: 0,
    car: "",
    registrationTime: 0, // 注册时间
    followTime: 0, // 最近跟进时间
    followUser: "" // 跟进人
  };
  private role = roleInfoSetting.getRole();
  get accountId() {
    return this.$route.params.id;
  }
  get routerTo() {
    return this.role === "0" ? "/customer/member/factoryMember" : "/customer/member/agentMember";
  }

  private async getFactoryUserInfoApi() {
    try {
      let { data } = await member_by_factory_detail_api(this.accountId);
      this.userInfo = data;
    } catch (error) {
      this.log(error);
    }
  }
  private async getAgentUserInfo() {
    try {
      let { data } = await member_by_dealer_detail_api(this.accountId);
      this.userInfo = data;
    } catch (error) {
      this.log(error);
    }
  }
  private goSearch() {
    this.role === "0" ? this.getFactoryUserInfoApi() : this.getAgentUserInfo();
  }

  created() {
    this.goSearch();
  }
}
</script>