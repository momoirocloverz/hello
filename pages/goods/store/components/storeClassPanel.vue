<template>
  <!-- 商品管理-类目面板 -->
  <div class="storeClassPanel">
    <div class="title">
      <b>{{title}}</b>
      <el-button type="text"
                 @click="addName"
                 size="small"
                 v-if="accessIsOpened('PERM:GOODS_CATEGORY:EDIT')&&hasAdd"
                 :disabled="disabled">+ 添加{{title}}</el-button>
    </div>
    <div class="panel">
      <div class="search">
        <el-autocomplete v-model="searchName"
                         :fetch-suggestions="queryModelSearchAsync"
                         :placeholder="`${title}名称`"
                         clearable
                         size="small"
                         style="width:100%"
                         @select="selectItem">
          <i slot="suffix"
             class="el-input__icon el-icon-search"></i>
        </el-autocomplete>
      </div>
      <ul v-loading="loading">
        <!-- 没有数据 -->
        <li v-if="_infoList.length <= 0"
            class="li">
          <img src=""
               alt="">
          <p>暂无内容</p>
          <el-button @click="msgAddShow"
                     type="primary"
                     size="small"
                     v-if="isAgent && accessIsOpened('PERM:GOODS_LIST:EDIT')&& hasNoDateAdd"
                     :disabled="disabled">提醒主机厂添加</el-button>
          <el-button @click="addName"
                     type="primary"
                     size="small"
                     v-if="!isAgent && accessIsOpened('PERM:GOODS_LIST:EDIT')&& hasMsgAdd"
                     :disabled="disabled">立即添加{{title}}</el-button>
        </li>
        <li v-for="
                     (item,index)
                     of
                     _infoList"
            :key="index"
            :class="{'select':item.select}"
            @click="panelSelect(item)"
            v-else>
          <div class="name">{{item.name}}</div>
          <div class="btn">
            <el-button type="text"
                       @click.stop="editName(item)"
                       size="small"
                       v-if="accessIsOpened('PERM:GOODS_CATEGORY:EDIT')&& hasEdit">编辑</el-button>
            <el-button type="text"
                       @click.stop="deleteName(item)"
                       size="small"
                       v-if="accessIsOpened('PERM:GOODS_CATEGORY:EDIT')&& hasDelete">删除</el-button>&nbsp;
          </div>
        </li>
      </ul>
    </div>
    <AddTag placeholder="请输入类目名称"
            :label="title"
            :title="isEdit ? `编辑${title}`:`添加${title}`"
            :visible.sync="addVisible"
            :submitLoading="submitTagLoading"
            :subForm="subForm"
            @save="saveSuc">
      <template slot="content">
        <el-form-item v-if="selectOneName"
                      label="一级类目：">
          <span>{{selectOneName}}</span>
        </el-form-item>
        <el-form-item v-if="selectTwoName"
                      label="二级类目：">
          <span>{{selectTwoName}}</span>
        </el-form-item>
      </template>
    </AddTag>
    <AddTag placeholder="请输入需要主机厂添加类目"
            label="提醒内容"
            title="提醒主机厂添加商品类目"
            :visible.sync="msgVisible"
            :submitLoading="msgSubmitTagLoading"
            :subForm="msgSubForm"
            inputType="textarea"
            :rows="4"
            :maxlength="100"
            @save="saveMsgSuc">
      <template slot="content">
        <el-form-item label="提醒事项：">
          <span>添加商品类目</span>
        </el-form-item>
      </template>
      <template slot="footerContent">
        <el-form-item>
          <div class="footer-txt">
            <p>举例：</p>
            <p>1级类目：汽车用品；</p>
            <p>2级类目：汽车用品> 车辆用品；</p>
            <p>3级类目：汽车用品> 车辆用品 > 车膜；</p>
          </div>
        </el-form-item>
      </template>
    </AddTag>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Prop, Ref } from "vue-property-decorator";
import AddTag from "@/components/tag-collapse/addTag.vue";
import { product_create_api, product_edit_api, product_delete_api, msg_factory_add } from "@/api";
@Component({
  components: {
    AddTag
  }
})
export default class StoreClassPanel extends Vue {
  @Prop({ default: "标题", type: String }) title: string;
  @Prop({ default: "", type: String }) selectOneName: string;
  @Prop({ default: "", type: String }) selectTwoName: string;
  @Prop({ default: false, type: Boolean }) hasMsgAdd: boolean; // 经销商没有数据是否-提醒主机厂添加
  @Prop({ default: false, type: Boolean }) hasNoDateAdd: boolean; // 主机厂没有数据是否-立即添加
  @Prop({ default: false, type: Boolean }) hasAdd: boolean; // 是否显示顶部添加按钮
  @Prop({ default: false, type: Boolean }) hasEdit: boolean;
  @Prop({ default: false, type: Boolean }) hasDelete: boolean;
  @Prop({ default: false, type: Boolean }) disabled: boolean;
  @Prop({ default: false, type: Boolean }) loading: boolean;
  @Prop({ default: 0, type: Number }) parentId: number;
  @Prop({ default: 1, type: Number }) levelId: number;
  @Prop({ type: Function }) queryModelSearchAsync: any;
  @Prop({ type: Function }) selectItem: any;

  @PropSync("infoList", {
    default: () => [],
    type: Array
  })
  _infoList: any[];

  private searchName: string = "";
  private isEdit: boolean = false;
  private editId: string | number;
  private addVisible: boolean = false;
  private submitTagLoading: boolean = false;
  private subForm = { name: "" };

  private msgVisible: boolean = false;
  private msgSubForm = { name: "" };
  private msgSubmitTagLoading: boolean = false;
  get isAgent() {
    return this.$route.query.sysPlat === 'agent';
  }
  /**
   * @description 操作
   */

  private msgAddShow() {
    this.msgSubForm = { name: "" };
    this.msgVisible = true;
    this.msgSubmitTagLoading = false;
  }

  private addName() {
    this.subForm = { name: "" };
    this.isEdit = false;
    this.addVisible = true;
    this.submitTagLoading = false;
  }
  private editName(item: any) {
    this.subForm = { name: item.name };
    this.isEdit = true;
    this.editId = item.id;
    this.addVisible = true;
  }

  private deleteName(item: any) {
    this.deleteconfirm(async () => {
      try {
        await product_delete_api(item.id);
        this.showMsg("删除成功");
        this.$emit("addSuc", this.parentId, this.levelId);
      } catch (error) {
        this.log(error);
      }
    });
  }

  /**
   * @description 新增编辑
   */
  private saveSuc(name: string) {
    this.isEdit ? this._editAPI(name) : this._addAPI(name);
  }
  private async _addAPI(name: string) {
    let params: any = {};
    params.name = name;
    params.level = this.levelId;
    params.parentId = this.parentId;
    this.submitTagLoading = true;
    try {
      await product_create_api(params);
      this.submitTagLoading = false;
      this.showMsg("添加成功");
      this.$emit("addSuc", this.parentId, this.levelId);
    } catch (error) {
      this.submitTagLoading = false;
      this.log(error);
    }
  }
  private async _editAPI(name: string) {
    this.submitTagLoading = true;
    try {
      await product_edit_api(this.editId, { id: this.editId, name });
      this.showMsg("修改成功");
      this.submitTagLoading = false;
      this.$emit("addSuc", this.parentId, this.levelId);
    } catch (error) {
      this.submitTagLoading = false;
      this.log(error);
    }
  }

  /**
   * @description 选中某一行
   */
  private panelSelect(item: any) {
    this._infoList = this._infoList.map((item: any) => {
      item.select = false;
      return item;
    });
    item.select = true;
    this.$emit("selectItem", item, this.levelId);
  }

  /**
   * @description 提醒主机厂添加
   */
  private async saveMsgSuc() {
    this.msgSubmitTagLoading = true;
    try {
      await msg_factory_add(this.msgSubForm);
      this.showMsg("提醒主机厂成功");
      this.submitTagLoading = false;
    } catch (error) {
      this.submitTagLoading = false;
      this.log(error);
    }
  }
}
</script>
<style lang='scss' scoped>
.storeClassPanel {
  border: 1px solid #ebeef5;
  background: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    padding: 8px 10px;
  }
  .panel {
    margin-top: 10px;
    .search {
      padding: 0px 10px;
    }
    ul {
      margin-top: 10px;
      border-top: 1px solid #ebeef5;
      height: 60vh;
      overflow: auto;
      text-align: center;
      .li {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        p {
          font-size: 12px;
          color: #909399;
          line-height: 80px;
        }
        &:hover {
          background: #fff;
        }
      }
      li {
        padding: 8px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        cursor: pointer;
        .name {
          font-size: 12px;
          min-width: 30%;
          display: inline-block;
          word-wrap: break-word;
        }
        .btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: #827f7f;
          }
        }
        &:hover {
          background: #e6f0ff;
        }
      }
      .select {
        background: #e6f0ff;
        position: sticky;
        top: 0;
        bottom: 0;
        .btn {
          span {
            color: #409eff;
          }
        }
        .name {
          font-weight: bold;
          color: #409eff;
        }
      }
    }
  }
  .footer-txt {
    p {
      font-size: 12px;
      color: #909399;
      line-height: 10px;
    }
  }
}
</style>