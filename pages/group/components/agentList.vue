<template>
  <div class="overflow-hidden">
    <div class="mb-15 common_flex-space-center" v-if="!isBind">
      <div class="left">
        <span>集团名称：{{ editInfo.name }}</span>
      </div>
      <div class="right">
        <el-button type="primary" size="small" @click="handleBindDealer"> 绑定经销商</el-button>
      </div>
    </div>
    <div v-if="isBind">
      <search-table
        ref="agentTbl"
        url="dealer"
        :searchParams="searchParams"
        :searchConfig="searchConfig"
        :tableColumns="constant.AGENT_TABLE_COLUMNS"
        @selectionChange="selectionChange"
      >
      </search-table>
    </div>

    <search-table
      ref="agentTbl"
      url="dealer"
      :searchParams="searchParams"
      :tableColumns="constant.AGENT_TABLE_COLUMNS"
      v-else
    >
    </search-table>
    <div v-if="isBind" class="fr mt-15">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleBind" :loading="loading">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import Const from "../const/index";
import { State, Action } from "vuex-class";
import { DialogInfo } from "@/@types/activity";
import { getBu2Region, bindDealerList } from "@/api/";
@Component({
  name: "groupFormDialog",
  components: { SearchTable }
})
export default class extends Vue {
  @Ref() agentTblRef: any;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @State(state => state.group.editInfo) private editInfo!: any;
  @Action("removeBindDealer", { namespace: "group" })
  removeBindDealer: Function;
  bu2Region: Array<any> = [];
  allRegion: Array<any> = [];
  checkedDealer: Array<any> = [];
  isBind: boolean = false;
  loading: boolean = false;
  private get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }

  /**
   * 搜索参数
   */
  get searchParams(): any {
    if (this.isBind) {
      return {
        noBloc: 2
      };
    } else {
      return {
        blocId: this.editInfo.id
      };
    }
  }

  /**
   * 搜索配置
   */
  get searchConfig(): any {
    let _obj = {};
    if (this.isBind) {
      _obj = this.constant.AGENT_SEARCH_CONFIG;
    }
    return _obj;
  }

  /**
   * 解绑
   * @param row
   */
  async removeBind(row: any) {
    let h = this.$createElement;
    let message: any = h("div", {}, [h("p", {}, `确定要解除${this.editInfo.name}和${row.dealerName}的绑定关系`)]);
    this.$confirm(message, "解绑").then(async () => {
      await this.removeBindDealer({
        dealerCode: row.dealerCode,
        blocId: this.editInfo.id
      });
      this.$message.success("解绑操作成功");
      this.$emit("handleClose");
      this.$emit("loadList");
    });
  }

  /**
   * 绑定经销商
   */
  handleBindDealer() {
    this.isBind = true;
  }

  /**
   * 取消
   */
  handleCancel() {
    this.isBind = false;
    this.agentTblRef.getList();
  }

  /**
   * 请求绑定经销商
   */
  async handleBind() {
    let _arr: any[] = [];
    this.checkedDealer.forEach((item: any) => {
      _arr.push(item.dealerCode);
    });
    if (_arr.length < 1) {
      this.$message.warning("请至少选择1个经销商");
      return;
    }
    this.loading = true;

    try {
      await bindDealerList({
        blocId: this.editInfo.id,
        dealerCodes: _arr
      });
      this.loading = false;
      this.$message.success("绑定经销商成功");
      this.isBind = false;
      // this.agentTblRef.getList();
      this.$emit("handleClose");
      this.$emit("loadList");
    } catch (e) {
      this.loading = false;
    }
  }
  selectionChange(val: any) {
    this.checkedDealer = val;
  }
  private async loadBu2Region() {
    let params = { buCodeList: "" };
    let res = await getBu2Region(params);
    this.bu2Region = res.data;
  }
  changeBu2(val: any) {
    if (this.bu2Region.length > 0) {
      for (let i = 0; i < this.bu2Region.length; i++) {
        let item = this.bu2Region[i];
        if (item.id === val) {
          this.allRegion = item.regionList || [];
        }
      }
    }
  }
  created() {
    this.loadBu2Region();
  }
}
</script>

<style scoped lang="scss"></style>
