<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'设置',to:''},{label:'消息设置',to:'/sys/templateMsg'}]" />

    <el-card>
      <p>使用须知:</p>
      <p>1、使用微信公众号模板消息需先绑定认证服务号，并于<a href="https://mp.weixin.qq.com/"
           target="_blank"
           class="link">微信公众号后台</a>开通“模板消息”功能（行业类目请选择：IT科技>互联网|电子商务；副行业类目请选择：IT科技>IT软件与服务）；</p>
      <p>2、每个认证服务号可同时启用25个模板ID（公众号相同的模板ID计为1个；）；公众号已添加的模板一旦达到25个，可能无法正常推送消息，此时请商家进入<a href="https://mp.weixin.qq.com/"
           target="_blank"
           class="link">微信公众号后台</a>删除部分不启用的模板。</p>
    </el-card>
    <el-card style="margin-top:20px;">
      <search-table :data="tableData"
                    :tableColumns="tableColumns"
                    :show-page="false"
                    :searchConfig="searchConfig">
        <template v-slot:column4="{row}">
          <el-switch v-if="accessIsOpened('PERM:MESSAGES_OPTIONS:EDIT')"
                     v-model="row.enabled"
                     @change="switchChange(row)"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>
      </search-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import api from "@/api/restful";
import { Component, Vue } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import { storeInfoSetting } from "@/utils/userSetting";

@Component({
  components: {
    SearchTable
  }
})
export default class Coupon extends Vue {
  private tableData: any = [];
  private searchConfig: object = {};
  private total: number = 0;
  private tableColumns: object = [
    {
      title: "消息类别",
      key: "templateType",
      width: 150
    },
    {
      title: "消息标题",
      key: "templateTitle",
      width: 200
    },
    {
      title: "消息规则",
      key: "templateRule"
    },
    {
      title: "使用模版ID",
      key: "templateNum"
    },
    {
      title: "操作",
      key: "setting",
      width: 150,
      slot: true,
      slotName: "column4"
    }
  ];
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  get dealerId() {
    return storeInfoSetting.getInfo().channelId;
  }
  private async getList() {
    try {
      let res = await api.get({ url: "GET_TEM_LIST", dealerId: this.dealerId });
      res.data.map((v: any) => {
        // v.enabled = v.enabled === 1 ? true : false;
        this.tableData.push(v);
      });
      this.total = this.tableData.length;
      // this.tableData = res.data;
    } catch (err) {
      throw new Error(err);
    }
  }
  private async disable(item: any) {
    try {
      let data = await api.put({
        url: "DISABLE_TEM_MSG",
        id: item.id,
        organId: this.organId
      });
      this.$message({ type: "success", message: "设置成功" });
    } catch (err) {
      item.enabled = true;
      console.log(err);
    }
  }
  private async enable(item: any) {
    try {
      let data = await api.post({
        url: "ENABLE_TEM_MSG",
        id: item.id,
        organId: this.organId
      });
      this.$message({ type: "success", message: "设置成功" });
    } catch (err) {
      item.enabled = false;
      console.log(err);
    }
  }
  switchChange(row: any) {
    if (row.enabled) {
      this.enable(row);
    } else {
      this.disable(row);
    }
  }
  async created() {
    let info = await api.get({ url: "GET_AUTH_INFO", organId: this.organId });
    if (info.data) {
      this.getList();
    } else {
      this.$message({ type: "error", message: "请先绑定公众号" });
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: $primary-color;
  text-decoration: none;
}
</style>

