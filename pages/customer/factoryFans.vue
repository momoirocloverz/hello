<template>
  <!-- 主机厂-粉丝管理 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'粉丝管理',to:''}]" />
    <div class="factoryFans">
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
            <el-input v-model="formData.nickName"
                      size="small"
                      placeholder="昵称"
                      clearable></el-input>
          </el-form-item>
        </template>
        <template slot="right-btns">
          <el-form-item>
            <span class="bold">粉丝总数：{{ totalCount }}</span>
          </el-form-item>
        </template>
      </el-admin-table>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import { member_by_factory_api } from "@/api/index";
import { customerRoleConfig } from "@/const";
import SearchRegion from "@/components/search-region/index.vue";
import dayjs from "dayjs";
/* eslint-disable-next-line */
import { FansList, FactoryTableList } from "@/@types/custom.ts";

@Component({
  components: {
    SearchRegion
  }
})
export default class App extends Vue {
  readonly customQuery = { role: customerRoleConfig.fans };
  private apiFn: any = member_by_factory_api;
  private totalCount: number = 0;
  private formData: any = { nickName: "", buId: "", dealerCode: "", regId: "" };
  private readonly tableAttrs = {
    border: true,
    hasSearch: true,
    columns: [
      {
        prop: "dealerName",
        label: "经销商名称",
        formatter: (row: any) => {
          let t = row.dealerEnabled === "ENABLE" ? "" : "（冻结）";
          return row.dealerName + t;
        }
      },
      {
        col: {
          width: "80px"
        },
        prop: "avatar",
        label: "头像",
        render: (h: any, row: any) =>
          h("img", {
            attrs: {
              style: "width:50%",
              class: "header",
              src: row.avatar || "/imgs/login/user.png"
            }
          })
      },
      {
        prop: "name",
        label: "昵称",
        formatter: (row: FactoryTableList) => (row.name ? row.name : "未授权用户")
      },
      {
        prop: "label",
        label: "标签",
        formatter: (row: FactoryTableList) => this.filterLabel(row.label)
      },
      {
        prop: "adviserName",
        label: "专属顾问"
      },
      {
        prop: "time",
        label: "关注时间",
        formatter: (row: FactoryTableList) => (row.time && dayjs(row.time).format("YYYY.MM.DD HH:mm")) || "—"
      }
    ]
  };
  private filterLabel(labelVal: Array<string>): string {
    return (labelVal && labelVal.join()) || "—";
  }

  created() {
    let dealerCode = this.$route.query.dealerCode || "";
    this.formData.dealerCode = dealerCode;
  }
}
</script>
<style lang='scss' scoped>
@import "./style/fans-share.scss";
</style>
