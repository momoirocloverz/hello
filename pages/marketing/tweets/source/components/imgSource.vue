<template>
  <div class="main-panel source-list">
    <div class="top-select-container"
         v-if="accessIsOpened('PERM:MATERIAL:EDIT')">
      <el-checkbox v-model="allSelected"
                   :indeterminate="isIndeterminate"
                   @change="allSelectChange">全选</el-checkbox>
      <el-button size="mini"
                 style="margin-left:20px;"
                 @click="showCatDialog">分组</el-button>
      <el-button size="mini"
                 type="danger"
                 @click="del()">删除</el-button>
      <span style="margin-left:10px;"
            v-show="selectedList.length > 0">已选:{{selectedList.length}}</span>
    </div>
    <ul class="img-list"
        v-loading="loading"
        v-viewer="{movable: false}">
      <li v-for="(item, index) in list"
          :key="index">
        <div class="img-box">
          <div class="img-box_checkbox"
               v-if="accessIsOpened('PERM:MATERIAL:EDIT')">
            <el-checkbox v-model="item.checked"
                         @change="selected(item)"></el-checkbox>
          </div>
          <img :src="item.url+'?x-oss-process=image/resize,m_fill,h_200,w_300'"
               alt="图片素材">
        </div>
      </li>
      <li class="no-data"
          v-if="list.length == 0">暂无数据</li>
    </ul>
    <div class="pager">
      <el-pagination layout="prev, pager, next, sizes, jumper,total"
                     :page-size="pager.size"
                     :page-sizes="[5, 10, 20, 30]"
                     :pager-count="5"
                     :current-page="pager.page"
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     background
                     :total="total">
      </el-pagination>
    </div>
    <dialog-image :showDialog="dialogVisible"
                  :info="curItem"
                  :categories="categories"
                  @refresh="refresh"
                  @close="dialogVisible = false">
    </dialog-image>
    <dialog-category :showDialog="dialogVisible0"
                     :selectedList="selectedList"
                     :categories="categories"
                     :groupId="groupId"
                     @change="catChange"
                     @close="dialogVisible0 = false">
    </dialog-category>
  </div>
</template>  

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import dialogImage from "./dialogImage.vue";
import dialogCategory from "./dialogSelectCategory.vue";
import api from "@/api/restful";

interface Img {
  name: string;
  time: number;
  id: number;
  checked: boolean;
}

@Component({
  components: {
    dialogImage,
    dialogCategory
  }
})
export default class ImgList extends Vue {
  @Prop({ default: false }) readonly isToggleDialog: boolean;
  @Prop({ default: 2 }) readonly curType: number; // 2-自建，1-集团，0-主机厂
  @Prop({ default: [] }) readonly categories: [];
  @Prop({ default: false }) readonly isRefreshData: boolean;
  @Prop({ default: null }) readonly groupId: number;
  @Prop({ default: false }) readonly isShowAddBtn: number;
  private list: Img[] = [];
  private dialogVisible: boolean = false;
  private dialogVisible0: boolean = false;
  private editMode: boolean = false;
  private allSelected: boolean = false;
  private isIndeterminate: boolean = false;
  private curItem: Img | {} = {};
  private loading: boolean = false;
  private selectedList: number[] = [];
  private pager: any = {
    size: 10,
    page: 1
  };
  private total: number = 0;
  private showDialog(row?: Img) {
    this.dialogVisible = true;
    if (row) this.curItem = row;
    this.editMode = row ? true : false;
  }
  private showCatDialog() {
    if (this.selectedList.length === 0) {
      return this.$message({ type: "error", message: "请选择图片" });
    }
    this.dialogVisible0 = true;
  }
  private async catChange(val: number) {
    try {
      let res = await api.put({ url: "METERIAL_IMAGES_GROUP", isAdminApi: true, groupId: val, ids: this.selectedList });
      this.$message({ type: "success", message: "分组成功" });
      this.$emit("refreshGroup");
    } catch (err) {
      console.log(err);
    }
  }
  private refresh() {
    this.$emit("refreshGroup");
  }
  private async getList() {
    this.reset();
    try {
      this.loading = true;
      this.allSelected = false;
      this.isIndeterminate = false;
      let res = await api.get({
        url: "METERIAL_IMAGES",
        isAdminApi: true,
        source: this.curType,
        groupId: this.groupId,
        ...this.pager
      });
      this.loading = false;
      res.data.map((v: Img) => {
        v.checked = false;
      });
      this.list = res.data;
      this.total = res.totalCount;
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  }
  private currentChange(page: number) {
    this.pager.page = page;
    this.selectedList = [];
    this.getList();
  }
  private sizeChange(size: number) {
    this.pager.size = size;
    this.selectedList = [];
    this.getList();
  }
  // 全选
  private allSelectChange(val: boolean) {
    if (val) {
      this.selectedList = [];
      this.list.map((v: Img) => {
        v.checked = true;
        this.selectedList.push(v.id);
      });
    } else {
      this.list.map((v: Img) => {
        v.checked = false;
      });
      this.selectedList = [];
    }
    this.isIndeterminate = false;
  }
  // 重置选择选项
  reset() {
    this.allSelected = false;
    this.isIndeterminate = false;
    this.selectedList = [];
  }
  // 单选
  private selected(item: Img) {
    if (item.checked) {
      this.selectedList.push(item.id);
    } else {
      let i = this.selectedList.indexOf(item.id);
      this.selectedList.splice(i, 1);
    }
    this.setAllCheckboxStatus();
  }
  setAllCheckboxStatus() {
    let count = 0;
    this.list.map((v: Img) => {
      let res: any = this.selectedList.find((vv: number) => vv === v.id);
      if (res) {
        count++;
      }
    });
    if (count === 0) {
      this.isIndeterminate = false;
      this.allSelected = false;
    } else if (count < this.list.length) {
      this.isIndeterminate = true;
      this.allSelected = false;
    } else {
      this.isIndeterminate = false;
      this.allSelected = true;
    }
  }
  private del(row?: Img) {
    let ids: number[];
    if (row) {
      ids = [row.id];
    } else {
      ids = this.selectedList;
    }
    if (ids.length === 0) {
      return this.$message({ type: "error", message: "请选择图片" });
    }
    const h = this.$createElement;
    const message: any = h("p", {}, [
      h("p", { style: "color: #333" }, "确定要删除选中的素材？ "),
      h("p", { style: "color: #666" }, "删除后无法恢复")
    ]);
    this.$confirm(message, "提示", { type: "warning" }).then(_ => {
      api.delete({ url: "METERIAL_IMAGES", ids: ids, isAdminApi: true }).then((data: any) => {
        this.$message({ type: "success", message: "删除成功" });
        this.$emit("refreshGroup");
      });
    });
  }
  @Watch("isToggleDialog")
  onIsToggleDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.showDialog();
    }
  }
  @Watch("isRefreshData")
  onIsRefreshData(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.pager.page = 1;
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>
.source-list {
  ul.img-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    li {
      width: 24%;
      margin: 0 1% 10px 0;
      list-style: none;

      &.no-data {
        width: 100%;
        height: 150px;
        line-height: 150px;
        text-align: center;
        color: #666;
      }

      .img-box {
        width: 100%;
        overflow: hidden;
        position: relative;

        .img-box_checkbox {
          position: absolute;
          left: 10px;
          top: 10px;
        }

        img {
          width: 100%;
          background: #f7fdfc;
        }
      }
    }
  }
  .top-select-container {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
