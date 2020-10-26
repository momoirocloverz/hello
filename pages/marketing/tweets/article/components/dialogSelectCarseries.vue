<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择车系"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="40%">
      <div class="dialog-content">
        <ul class="series-list">
          <li :key="index"
              :class="{'active': item.checked}"
              v-for="(item, index) in tableData"
              @click.stop="check(item)">
            <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
          </li>
        </ul>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span style="float:left;margin-top:10px;">已选：{{selectList.length}}</span>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import api from "@/api/restful";
const brandCode: string = "geely";

interface Item {
  id: number;
  code: string;
  name: string;
  checked: boolean;
}

@Component({
  components: {}
})
export default class dialogReview extends Vue {
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: { list: [] } })
  readonly info: any;
  private curCollapse: string[] = [];
  private tableData: Item[] = [];
  private selectList: Item[] = [];

  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh() {
    if (this.selectList.length > 5) {
      return this.$message({ type: "warning", message: "最多选择5个车系" });
    }
    let series: string[] = [];
    this.selectList.map((v: Item) => {
      series.push(v.code);
    });
    this.$emit("selected", series);
    this.closeDialog();
  }
  async getList(cb: Function) {
    try {
      let data = await api.get({ url: "GET_AUTH_SERIES_AND_MODELS", isAdminApi: true });
      data = data.data || [];
      data.map((v: Item) => {
        v.checked = false;
      });
      this.tableData = data;
      if (cb) cb();
    } catch (err) {
      throw new Error(err);
    }
  }
  check(item: Item) {
    item.checked = !item.checked;
    if (item.checked) {
      this.selectList.push(item);
    } else {
      this.removeSelect(item);
    }
  }
  // 从selectList中移除
  removeSelect(item: Item) {
    let index: number | undefined = this.selectList.findIndex((v: Item) => v.code === item.code);
    if (index !== undefined) {
      this.selectList.splice(index, 1);
    }
  }
  // 设置历史选中
  initCheckbox() {
    this.selectList = [];
    this.info.list.map((v: string) => {
      this.tableData.map((t: Item) => {
        if (v === t.code) {
          t.checked = true;
          this.selectList.push(t);
        }
      });
    });
  }
  init() {
    this.getList(this.initCheckbox);
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.init();
    }
  }
}
</script>

<style lang="scss">
.series-list {
  width: 100%;
  li {
    width: 100%;
    line-height: 45px;
    border-bottom: 1px solid #ebeef5;
    padding-left: 15px;
    box-sizing: border-box;
    margin-bottom: 5px;
    position: relative;

    &::before {
      content: "";
      background: transparent;
      width: 100%;
      height: 45px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: +10;
    }

    &.active {
      background: #e3f2ff;
    }
  }
}
</style>

