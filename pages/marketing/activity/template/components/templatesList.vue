<template>
  <div class="template-container">
    <el-tabs v-model="activeName" v-if="role === 'agent'" @tab-click="filterChange">
      <el-tab-pane label="自建模版" name="DEALER"></el-tab-pane>
      <el-tab-pane label="集团模版" name="GROUP"></el-tab-pane>
      <el-tab-pane label="主机厂模版" name="MANUFACTOR"></el-tab-pane>
    </el-tabs>
    <el-radio-group v-model="radio" @change="filterChange" size="small">
      <el-radio-button :label="item.value" :key="index" v-for="(item, index) in options">{{
        item.label
      }}</el-radio-button>
    </el-radio-group>

    <el-row class="mgt-md filter">
      <el-col :span="12">
        <el-input v-model="filter" size="small" placeholder="模版名称"></el-input>
        <el-button type="primary" size="small" @click="filterChange">查询</el-button>
        <el-button type="default" size="small" @click="reset">重置</el-button>
      </el-col>
      <el-col :span="12" class="tar">
        <el-button
          type="primary"
          size="small"
          v-if="
            showEdit && !(role === 'agent' && activeName !== 'DEALER') && accessIsOpened('PERM:ACTIVITY_TEMPLATE:EDIT')
          "
          @click="dialogVisible = true"
          >新建模版</el-button
        >
      </el-col>
    </el-row>
    <ul class="template-list" v-loading="loading">
      <li class="no-data" v-if="tableData.length === 0">还没有模版哦</li>
      <li v-for="(item, index) in tableData" :key="index">
        <div style="position:relative">
          <img :src="item.thumbnail || defaultImg" :alt="item.name" />
          <p class="txt">{{ item.name }}</p>
        </div>
        <div class="btnGroup">
          <div
            class="btn-radius"
            v-if="
              showEdit &&
                !(role === 'agent' && activeName !== 'DEALER') &&
                accessIsOpened('PERM:ACTIVITY_TEMPLATE:EDIT')
            "
            @click="creatTemplate(item)"
          >
            编辑
          </div>
          <div class="btn-radius" v-if="accessIsOpened('PERM:LOTTERY_ACTIVITY:EDIT')" @click="useIt(item)">使用它</div>
        </div>
      </li>
    </ul>

    <div class="pager">
      <el-pagination
        layout="prev, pager, next, sizes, jumper,total"
        :page-size="pager.size"
        :page-sizes="[5, 10, 20, 30]"
        :pager-count="5"
        :current-page="pager.page"
        @current-change="currentChange"
        @size-change="sizeChange"
        background
        :total="total"
      >
      </el-pagination>
    </div>
    <dialog-select-type :showDialog="dialogVisible" :options="options" @close="dialogVisible = false">
    </dialog-select-type>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import dialogSelectType from "./dialogSelectType.vue";
import api from "@/api/restful";
import urls from "@/api/urls";
import defaultImg from "@/assets/images/activity/dft.png";

@Component({
  components: {
    dialogSelectType
  }
})
export default class templatesList extends Vue {
  @Prop({ default: true }) showEdit: boolean;
  private radio: string = "SCRATCH_TICKETS";
  private activeName: string = "DEALER";
  private dialogVisible: boolean = false;
  private defaultImg: string = defaultImg;
  private pager: any = {
    size: 10,
    page: 1
  };
  private role: string = "";
  private total: number = 0;
  private filter: string = "";
  private tableData: any[] = [];
  private loading: boolean = false;
  private options: any[] = [
    { label: "刮刮乐", value: "SCRATCH_TICKETS" },
    { label: "九宫格", value: "NINE_BLOCK_BOX" },
    { label: "大转盘", value: "LUCKY_WHEEL" }
  ];

  currentChange(page: number) {
    this.pager.page = page;
    this.getList();
  }
  sizeChange(size: number) {
    this.pager.size = size;
    this.getList();
  }
  private creatTemplate(item: any) {
    localStorage.setItem("c_temp_meta", item.meta);
    localStorage.setItem("c_temp_meta_fm", item.thumbnail);
    this.$router.push({
      path: `/marketing/activity/template/editor?type=${this.radio}&id=${item.id}`
    });
  }
  private useIt(item: any) {
    this.$emit("useTemp", item);
    localStorage.setItem("c_template", JSON.stringify(item));
    if (this.showEdit) {
      this.$router.push({
        path: `/marketing/activity/lottery/add`,
        query: {
          from: "temp",
          mode: this.role === "factory" ? "hosted" : ""
        }
      });
    }
  }
  async getList() {
    try {
      this.loading = true;
      let params = {
        url: "ACTIVITY_TEMPLATES",
        isAdminApi: true,
        name: this.filter,
        toolType: this.radio,
        ...this.pager
      };
      // 不传值只看自己模版
      if (this.role === "agent" && this.activeName !== "DEALER") {
        params.channel = this.activeName;
      }
      let res = await api.get(params);
      this.loading = false;
      this.total = res.totalCount;
      this.tableData = res.data;
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  }
  filterChange() {
    this.getList();
  }
  reset() {
    this.filter = "";
    this.getList();
  }
  created() {
    // 根据角色确定source显示
    this.role = (<any>this.$route.query).sysPlat;
    if (this.role === "factory") {
      this.activeName = "MANUFACTOR";
    } else if (this.role === "company") {
      this.activeName = "GROUP";
    }
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.template-container {
  .pager {
    margin-top: 20px;
    text-align: right;
  }
  /deep/ {
    .filter .el-input {
      width: 180px;
      margin-right: 8px;
    }
  }
  .tar {
    text-align: right;
  }
  .mgt-md {
    margin-top: 15px;
  }
  .template-list {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    margin-left: -10px;

    li {
      width: 130px;
      text-align: center;
      margin: 12px 8px;
      box-shadow: 0 0 10px #ccc;
      border-radius: 5px;
      overflow: hidden;
      &.no-data {
        width: 100%;
        height: auto;
        margin: 50px 0;
        text-align: center;
        box-shadow: none;
      }

      p.txt {
        text-align: left;
        margin: 0;
        padding: 5px 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.35);
        color: #fff;
      }

      img {
        width: 100%;
        height: 187px;
        object-fit: cover;
        display: block;
      }
      .btnGroup {
        display: flex;
        .btn-radius {
          display: inline-block;
          background: #127dd7;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
          flex: 1;
          padding: 4px 0;
        }
        .btn-radius:hover {
          opacity: 0.8;
        }
        .btn-radius:nth-of-type(1) {
          background: #e17170;
        }
      }
    }
  }
}
</style>
