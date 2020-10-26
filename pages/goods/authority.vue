<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'授权管理'}]" />
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>G网授权</span>
            <el-button style="float: right;"
                       type="primary"
                       size="small"
                       v-if='accessIsOpened("PERM:AUTHORIZATION:EDIT")'
                       @click="showDialog('G')">G网授权管理</el-button>
          </div>
          <div class="no-data"
               v-if="GPageData.length === 0">暂无数据</div>
          <el-collapse :accordion="true">
            <el-collapse-item :title="item.name"
                              :name="item.code"
                              :key="index"
                              v-for="(item, index) in GPageData">
              <template slot="title">
                {{item.name}}（{{item.modelList.length}}）
              </template>
              <div class="model-box"
                   :key="i"
                   v-for="(model, i) in item.modelList">
                {{model.name}}
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>L网授权</span>
            <el-button style="float: right;"
                       type="primary"
                       v-if='accessIsOpened("PERM:AUTHORIZATION:EDIT")'
                       size="small"
                       @click="showDialog('L')">L网授权管理</el-button>
          </div>
          <div class="no-data"
               v-if="LPageData.length === 0">暂无数据</div>
          <el-collapse :accordion="true">
            <el-collapse-item :title="item.name"
                              :name="item.code"
                              :key="index"
                              v-for="(item, index) in LPageData">
              <template slot="title">
                {{item.name}}（{{item.modelList.length}}）
              </template>
              <div class="model-box"
                   :key="i"
                   v-for="(model, i) in item.modelList">
                {{model.name}}
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>

    <dialog-authorization :showDialog="dialogVisible"
                          :info="curItem"
                          @selected="selectedChange"
                          @close="dialogVisible = false">
    </dialog-authorization>
  </div>
</template>

<script lang='ts'>
import _ from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
import api from "@/api/restful";
import dialogAuthorization from "./components/dialogAuthorization.vue";

interface Model {
  code: string;
  gsystemChoosedFlag?: boolean;
  lsystemChoosedFlag?: boolean;
  name: string;
}

interface Item {
  code: string;
  modelList: Model[];
  name: string;
}

@Component({
  components: {
    dialogAuthorization
  }
})
export default class Authority extends Vue {
  private GPageData: Item[] = [];
  private LPageData: Item[] = [];
  private dialogVisible: boolean = false;
  private curItem: any = {
    code: null,
    list: []
  };
  getAuthList() {
    return api.get({ url: "AUTH_LIST", isAdminApi: true }).then((data: any) => {
      this.GPageData = [];
      this.LPageData = [];
      // 处理数据
      let d = data.data;
      d.map((v: Item) => {
        if (v.modelList.length > 0) {
          let GModel: Item = {
            code: v.code,
            name: v.name,
            modelList: []
          };
          let LModel: Item = JSON.parse(JSON.stringify(GModel));
          v.modelList.map((vv: Model) => {
            if (vv.gsystemChoosedFlag) {
              GModel.modelList.push({
                code: vv.code,
                name: vv.name
              });
            }
            if (vv.lsystemChoosedFlag) {
              LModel.modelList.push({
                code: vv.code,
                name: vv.name
              });
            }
          })
          if (GModel.modelList.length > 0) {
            this.GPageData.push(GModel);
          }
          if (LModel.modelList.length > 0) {
            this.LPageData.push(LModel);
          }
        }
      })
    });
  }
  showDialog(code: string) {
    this.dialogVisible = true;
    this.curItem.code = code;
    if (code === "G") {
      this.curItem.list = JSON.parse(JSON.stringify(this.GPageData))
    }
    if (code === "L") {
      this.curItem.list = JSON.parse(JSON.stringify(this.LPageData))
    }
  }
  async selectedChange({ data, code }: { data: string[]; code: string }) {
    try {
      let res = await api.post({ url: "SAVE_AUTH", modelCodeList: data, regionCode: code, isAdminApi: true });
      this.$message({ type: "success", message: "保存成功" });
      this.getAuthList();
    } catch (err) {
      throw new Error(err);
    }
  }
  created() {
    this.getAuthList();
  }
}
</script>

<style>
.el-collapse {
  border: none;
}
.no-data {
  width: 100%;
  margin: 40px auto;
  text-align: center;
  color: #666;
}
</style>