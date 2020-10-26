<!--营销素材-->
<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{ label: '营销推文', to: '' }, { label: '营销素材', to: '/marketing/tweets/source/index' }]" />
    <el-card>
      <el-tabs v-model="currentTab"
               @tab-click="getOptions">
        <el-tab-pane :label="item"
                     :key="index"
                     :name="index + ''"
                     v-for="(item, index) in tabs"></el-tab-pane>
      </el-tabs>
      <div class="btn-panel">
        <el-radio-group size="small"
                        v-model="source"
                        @change="getOptions">
          <el-radio-button :label="item.value"
                           :key="index"
                           v-for="(item, index) in sources">{{
            item.label
          }}</el-radio-button>
        </el-radio-group>
        <el-button type="primary"
                   size="small"
                   v-if="isShowAddBtn && accessIsOpened('PERM:MATERIAL:EDIT')"
                   @click="add">{{ btns[currentTab] }}</el-button>
      </div>
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="tree-cat_panel">
            <div class="tree-cat_header">
              <span>{{ tabs[parseInt(currentTab)] }}分组</span>
              <i class="el-icon-plus"
                 v-if="accessIsOpened('PERM:MATERIAL:EDIT') && categories.length < 20"
                 @click="showDialog()"></i>
            </div>
            <div class="tree-cat_content">
              <ul v-loading="loading">
                <li v-for="(item, index) in categories"
                    :key="index"
                    :class="{ active: item.id === curCategory }"
                    @click="setGroup(item)">
                  <span>{{ item.name }}({{ item.materialNum }})</span>
                  <el-dropdown trigger="hover"
                               v-if="item.name !== '未分组' && accessIsOpened('PERM:MATERIAL:EDIT')"
                               @command="handleCommand">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{ type: 'update', data: item }">编辑</el-dropdown-item>
                      <el-dropdown-item :command="{ type: 'del', data: item }">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <router-view :is="currentComponent"
                       :isToggleDialog="isToggleDialog"
                       :curType="source"
                       :isRefreshData="isRefresh"
                       :groupId="curCategory"
                       :categories="categories"
                       @refreshGroup="getOptions"></router-view>
        </el-col>
      </el-row>
    </el-card>

    <dialog-cat :showDialog="dialogVisible"
                :info="curItem"
                :editMode="editMode"
                @change="catChange"
                @close="dialogVisible = false">
    </dialog-cat>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from "vue-property-decorator";
import articleSource from "./components/articleSource.vue";
import imgSource from "./components/imgSource.vue";
import videoSource from "./components/videoSource.vue";
import dialogCat from "./components/dialogCat.vue";
import api from "@/api/restful";

@Component({
  components: {
    articleSource,
    imgSource,
    videoSource,
    dialogCat
  }
})
export default class Coupon extends Vue {
  private com: string[] = ["articleSource", "imgSource", "videoSource"];
  private tabs: string[] = ["图文素材", "图片素材", "视频素材"];
  private btns: string[] = ["新建图文", "上传图片", "添加视频"];
  private sources: any[] = [{ value: 2, label: "自建" }, { value: 1, label: "集团" }, { value: 0, label: "主机厂" }];
  private currentTab: string = "0";
  private categories: any[] = [];
  private curCategory: number | null = null;
  private source: number = 2;
  private isRefresh: boolean = false; // 重新拉取列表标志位
  private isToggleDialog: boolean = false;
  private dialogVisible: boolean = false;
  private editMode: boolean = false;
  private curItem: any = {};
  private loading: boolean = false;
  private role: string = "";
  get currentComponent(): string {
    return this.com[Number(this.currentTab)];
  }
  get isShowAddBtn() {
    if (
      (this.role === "factory" && this.source === 0) ||
      (this.role === "company" && this.source === 1) ||
      (this.role === "agent" && this.source === 2)
    ) {
      return true;
    } else {
      return false;
    }
  }
  add() {
    if (this.currentTab === "0") {
      this.$router.push(`/marketing/tweets/source/create?source=${this.source}`);
    } else {
      this.isToggleDialog = !this.isToggleDialog;
    }
  }
  showDialog(row?: any) {
    this.dialogVisible = true;
    if (row) {
      this.editMode = true;
      this.curItem = row;
    } else {
      this.editMode = false;
    }
    this.curItem.dialogName = this.tabs[parseInt(this.currentTab)];
  }
  async catChange(val: any) {
    try {
      if (val.id) {
        let res = await api.put({
          url: "MATERIAL_GROUP_ITEM",
          isAdminApi: true,
          name: val.name,
          id: val.id
        });
        this.$message({ type: "success", message: "修改成功" });
        this.getOptions();
      } else {
        let res = await api.post({
          url: "MATERIAL_GROUP",
          isAdminApi: true,
          name: val.name,
          type: parseInt(this.currentTab) // 0-图文  1-图片  2-视频
        });
        this.$message({ type: "success", message: "创建成功" });
        this.getOptions();
      }
    } catch (err) {
      console.log(err);
    }
  }
  handleCommand(val: { type: string; data: object }) {
    if (val.type === "update") {
      this.showDialog(val.data);
    } else {
      const h = this.$createElement;
      const message: any = h("p", {}, [
        h("p", { style: "color: #333" }, "确定要删除该分组？ "),
        h("p", { style: "color: #666" }, "删除后该分组下所有素材将移入未分组")
      ]);
      this.$confirm(message, "提示", { type: "warning" }).then(_ => {
        api
          .delete({
            url: "MATERIAL_GROUP_ITEM",
            isAdminApi: true,
            id: (<any>val.data).id
          })
          .then((data: any) => {
            this.$message({ type: "success", message: "删除成功" });
            this.getOptions();
          });
      });
    }
  }
  async getOptions() {
    try {
      this.loading = true;
      let { data } = await api.get({
        url: "MATERIAL_GROUP",
        isAdminApi: true,
        source: this.source, // 0-主机厂 1-集团 2-经销商
        type: parseInt(this.currentTab) // 0-图文  1-图片  2-视频
      });
      this.loading = false;
      this.categories = data;
      if (data && data.length > 0) {
        let has: boolean = false;
        data.map((v: any) => {
          if (v.id === this.curCategory) {
            has = true;
            this.setGroup(v);
          }
        });
        if (!has) {
          this.setGroup(data[0]);
        }
      }
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  }
  setGroup(item: any) {
    this.curCategory = item.id;
    // 获取列表
    this.isRefresh = !this.isRefresh;
  }
  created() {
    // 根据角色确定source显示
    this.role = (<any>this.$route.query).sysPlat;
    if (this.role === "factory") {
      this.sources = [];
      this.source = 0;
    } else if (this.role === "company") {
      this.sources.shift();
      this.source = 1;
    }
    this.getOptions();
  }
}
</script>

<style lang="scss" scoped>
.main-panel {
  padding: 10px;
  margin-bottom: 10px;
}
.btn-panel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tree-cat_panel {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding-top: 10px;

  .tree-cat_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    border-bottom: 1px solid #f7f7f7;
    padding: 0 15px;

    .el-icon-plus {
      cursor: pointer;
    }

    * {
      vertical-align: middle;
      display: inline-block;
      line-height: 40px;
    }
  }
  .tree-cat_content {
    width: 100%;
    ul li {
      line-height: 40px;
      padding: 0 15px;
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      * {
        line-height: 40px;
      }
    }
    li:hover {
      background: #e3f2ff;
    }
    li.active {
      background: #e3f2ff;
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
