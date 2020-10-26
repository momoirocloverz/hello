<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择用户" :visible.sync="showDialog" :before-close="closeDialog" width="70%">
      <div class="dialog-content">
        <search-table
          ref="searchTableRef"
          :url="urls.ADVISER_LIST"
          :tableColumns="tableColumns"
          :searchConfig="searchConfig"
          :isDefaultQuery="true"
          :isCommonURL="true"
          :proxyQuery="proxyQuery"
          :proxyData="proxyData"
          :defaultSelected="info.selectList"
          @selectionChange="selectionChange"
        >
        </search-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <span style="float:left;margin-top:10px;">已选：{{ selectList.length }}/5</span>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import api from "@/api/restful";
import urls from "@/api/urls";
import { storeInfoSetting } from "@/utils/userSetting";

interface Item {
  id: number;
  mobile: string;
  name: string;
  position: string;
}

@Component({
  components: {
    SearchTable
  }
})
export default class dialogReview extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  private options: any[] = [];
  private tableData: Item[] = [];
  private urls: any = urls;
  private selectList: Item[] = [];
  private searchConfig: object = {
    props: [
      {
        tag: "input",
        prop: "account",
        placeholder: "帐号"
      },
      {
        tag: "input",
        prop: "name",
        placeholder: "姓名"
      },
      {
        tag: "input",
        prop: "phone",
        placeholder: "手机号"
      }
    ]
  };
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "帐号",
      key: "account"
    },
    {
      title: "姓名",
      key: "name",
      width: 150
    },
    {
      title: "手机号",
      key: "phone"
    },
    {
      title: "邮箱",
      key: "email"
    },
    {
      title: "岗位",
      key: "position"
    }
  ];
  closeDialog() {
    this.searchTableRef.resetDefaultSelect();
    this.$emit("close", true);
  }
  /**
   * 关闭弹窗并通知刷新
   */
  closeAndRefresh() {
    if (this.selectList.length > 5) {
      return this.$message({ type: "error", message: "最多选择5个" });
    }
    this.$emit("selected", JSON.parse(JSON.stringify(this.selectList)));
    this.$emit("close", true);
  }
  proxyQuery(filters: any) {
    let { channelId } = storeInfoSetting.getInfo();
    let { sysPlat } = this.$route.query;
    let channels: any = ["factory", "company", "agent"];
    filters.channel = channels.indexOf(sysPlat || "agent");
    filters.channelId = channelId;
    filters.status = 0;
    return filters;
  }
  proxyData(data: any) {
    return data;
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>
