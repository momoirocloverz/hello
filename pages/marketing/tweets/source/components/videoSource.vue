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
        v-loading="loading">
      <li v-for="(item, index) in list"
          :key="index">
        <div class="img-box">
          <div class="img-box_checkbox"
               v-if="accessIsOpened('PERM:MATERIAL:EDIT')">
            <el-checkbox v-model="item.checked"
                         @change="selected(item)"></el-checkbox>
          </div>
          <img :src="item.coverUrl+'?x-oss-process=image/resize,m_fill,h_200,w_300'"
               alt="">
        </div>
        <h4>【{{item.duration | timeFilter}}】{{item.title}}</h4>
        <div class="img-list_bottom">
          <div class="img-list_btn"
               v-if="accessIsOpened('PERM:MATERIAL:EDIT')"
               @click="showDialog(item)">
            编辑</div>
          <div class="img-list_btn"
               v-if="accessIsOpened('PERM:MATERIAL:EDIT')"
               @click="del(item)">
            删除</div>
          <div class="img-list_btn"
               @click="play(item)">
            播放</div>
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
    <dialog-video :showDialog="dialogVisible"
                  :info="curItem"
                  :editMode="editMode"
                  :categories="categories"
                  @refresh="refresh"
                  @close="dialogVisible = false">
    </dialog-video>
    <dialog-play :showDialog="dialogVisible1"
                 :info="curItem"
                 @close="dialogVisible1 = false">
    </dialog-play>
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
import dialogVideo from "./dialogVideo.vue";
import dialogPlay from "./dialogVideoPlay.vue";
import dialogCategory from "./dialogSelectCategory.vue";
import api from "@/api/restful";
import dayjs from "dayjs";
import { MessageBox } from "element-ui";

interface Video {
  title: string;
  duration: number;
  coverUrl: string;
  url: string;
  id: number;
  checked: boolean;
}

@Component({
  components: {
    dialogVideo,
    dialogPlay,
    dialogCategory
  },
  filters: {
    timeFilter(value: any) {
      const HOUR = 3600000;
      const MINUTE = 60000;
      let h = String(Math.floor(value / HOUR)).padStart(2, "0");
      let m = String(Math.floor((value % HOUR) / MINUTE)).padStart(2, "0");
      let s = String(Math.floor(((value % HOUR) % MINUTE) / 1000)).padStart(2, "0");
      return `${h}:${m}:${s}`;
    }
  }
})
export default class videoList extends Vue {
  @Prop({ default: false }) readonly isToggleDialog: boolean;
  @Prop({ default: 2 }) readonly curType: number; // 2-自建，1-集团，0-主机厂
  @Prop({ default: [] }) readonly categories: [];
  @Prop({ default: false }) readonly isRefreshData: boolean;
  @Prop({ default: null }) readonly groupId: number;
  @Prop({ default: false }) readonly isShowAddBtn: number;
  private list: Video[] = [];
  private dialogVisible: boolean = false;
  private dialogVisible0: boolean = false;
  private dialogVisible1: boolean = false;
  private editMode: boolean = false;
  private allSelected: boolean = false;
  private isIndeterminate: boolean = false;
  private curItem: Video | {} = {};
  private loading: boolean = false;
  private selectedList: number[] = [];
  private pager: any = {
    size: 10,
    page: 1
  };
  private total: number = 0;
  private showDialog(row?: Video) {
    this.dialogVisible = true;
    if (row) this.curItem = row;
    this.editMode = row ? true : false;
  }
  private showCatDialog() {
    if (this.selectedList.length === 0) {
      return this.$message({ type: "error", message: "请选择视频" });
    }
    this.dialogVisible0 = true;
  }
  private async catChange(val: number) {
    try {
      let res = await api.put({ url: "VIDEO_GROUP", isAdminApi: true, groupId: val, ids: this.selectedList });
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
        url: "VIDEOS",
        isAdminApi: true,
        source: this.curType,
        groupId: this.groupId,
        ...this.pager
      });
      this.loading = false;
      res.data.map((v: Video) => {
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
      this.list.map((v: Video) => {
        v.checked = true;
        this.selectedList.push(v.id);
      });
    } else {
      this.list.map((v: Video) => {
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
  private selected(item: Video) {
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
    this.list.map((v: Video) => {
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
  private del(row?: Video) {
    let ids: number[];
    if (row) {
      ids = [row.id];
    } else {
      ids = this.selectedList;
    }
    if (ids.length === 0) {
      return this.$message({ type: "error", message: "请选择视频" });
    }
    const h = this.$createElement;
    const message: any = h("p", {}, [
      h("p", { style: "color: #333" }, "确定要删除选中的素材？ "),
      h("p", { style: "color: #666" }, "删除后无法恢复")
    ]);
    this.$confirm(message, "提示", { type: "warning" }).then(_ => {
      api.delete({ url: "VIDEOS", ids: ids, isAdminApi: true }).then((data: any) => {
        this.$message({ type: "success", message: "删除成功" });
        this.$emit("refreshGroup");
      });
    });
  }
  private play(item: Video) {
    this.dialogVisible1 = true;
    this.curItem = item;
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
$primary-color: #127dd7;
.pager {
  text-align: right;
}
ul.img-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;

  li {
    width: 32%;
    margin-bottom: 20px;
    list-style: none;
    background: #fff;
    box-shadow: 0px 1px 2px 0px #f7f7f7;

    &.no-data {
      width: 100%;
      height: 150px;
      line-height: 150px;
      text-align: center;
      color: #666;
    }

    h4 {
      line-height: 1.5em;
      margin: 8px;
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
        height: calc(100% * 2 / 3);
        background: #f7fdfc;
        height: 150px;
      }
    }

    .img-list_bottom {
      display: flex;
      padding: 6px 10px;
      box-sizing: border-box;
      justify-content: space-between;
      border-top: 1px solid #f7f7f7;
      span {
        margin-top: 4px;
      }

      .img-list_btn {
        flex: 1;
        text-align: center;
        color: $primary-color;
        cursor: pointer;
      }
    }
  }
  li:nth-child(3n-1) {
    margin-left: 2%;
    margin-right: 2%;
  }
}
.top-select-container {
  width: 100%;
  margin: 10px 0;
}
</style>
