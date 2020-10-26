<template>
  <div class="main-container">
    <!--dialog-->
    <el-dialog title="添加图片"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="65%">
      <div class="dialog-content">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="groupId"
                       placeholder="请选择分组"
                       size="small">
              <el-option v-for="item in categories"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-button type="primary"
                       size="small" @click="getList">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-col>
        </el-row>
        <div class="main-panel">
          <ul class="img-list">
            <li v-for="(item, index) in list"
                :key="index">
              <div class="img-box">
                <div class="img-box_checkbox">
                  <el-checkbox v-model="item.checked"
                               @change="selected(item)"></el-checkbox>
                </div>
                <img :src="item.url+'?x-oss-process=image/resize,m_fill,h_200,w_300'"
                     :alt="item.title">
              </div>
            </li>
            <li class="no-data"
                v-if="list.length == 0">暂无数据</li>
          </ul>
          <div class="pager">
            <el-pagination layout="prev, pager, next, sizes, jumper,total"
                           :page-size="pager.size"
                           :page-sizes="[10, 20, 30]"
                           :pager-count="5"
                           :current-page="pager.page"
                           @current-change="currentChange"
                           @size-change="sizeChange"
                           background
                           :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import api from "@/api/restful";

interface Img {
  title: string;
  url: number;
  id: number;
  checked: boolean;
}

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: {} }) readonly info: any;
  @Prop({ default: [] }) readonly categories: [];
  private groupId: number | null = null;
  private list: any[] = [];
  private selectedItem: any = {};
  private pager: any = {
    size: 10,
    page: 1
  };
  private total: number = 0;
  private currentChange(page: number) {
    this.pager.page = page;
    this.getList();
  }
  private sizeChange(size: number) {
    this.pager.size = size;
    this.getList();
  }
  private selected(item: any) {
    this.selectedItem = item;
    this.list.map((v: any) => {
      if (item.id !== v.id) {
        v.checked = false;
      }
    });
  }
  closeDialog() {
    this.$emit("close", true);
  }
  closeAndRefresh(form: string) {
    this.$emit("change", this.selectedItem);
    this.closeDialog();
  }
  private async getList() {
    try {
      let res = await api.get({
        url: "METERIAL_IMAGES",
        isAdminApi: true,
        source: this.info.source,
        groupId: this.groupId,
        ...this.pager
      });
      res.data.map((v: Img) => {
        v.checked = false;
      });
      this.list = res.data;
      this.total = res.totalCount;
    } catch (err) {
      console.log(err);
    }
  }
  reset() {
    this.groupId = null;
    this.getList();
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.getList();
    }
  }
}
</script>


<style lang="scss" scoped>
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

    img {
      width: 100%;
      background: #f7fdfc;
    }

    &.no-data {
      width: 100%;
      height: 150px;
      line-height: 150px;
      text-align: center;
      color: #666;
    }

    .img-box {
      width: 100%;
      height: 150px;
      overflow: hidden;
      position: relative;

      .img-box_checkbox {
        position: absolute;
        left: 10px;
        top: 10px;
      }
    }
  }
}
.top-select-container {
  width: 100%;
  margin: 10px;
  * {
    margin-right: 8px;
  }
}
.pager {
  text-align: right;
}
</style>

