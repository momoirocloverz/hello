<template>
  <!-- 顾问评价标签页面 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'顾问评价标签',to:''}]" />
    <div class="consultantTag">
      <div class="left">
        <collapse :fansList.sync="labelList"
                  :moreIcon="true"
                  formParent="consultantTag"
                  :btnVisible="accessIsOpened('PERM:ADVISER_COMMENT_LABEL:EDIT')"
                  @searchItem="searchTag"
                  @editSubItem="editSubItem"
                  @deletSubItem="deletSubItem">
          <div slot="title"
               class="line">
            <b>标签分组</b>
            <!-- <el-button size="small"
                     type="text"
                     @click="addTagGroup">新增分组</el-button> -->
          </div>
        </collapse>
      </div>
      <div class="right">
        <common-table :tableColumns="tableColumns"
                      :data="labelTabList"
                      :showPage="false">
          <div class="line"
               v-if="accessIsOpened('PERM:ADVISER_COMMENT_LABEL:EDIT')">
            <el-button @click="addTag"
                       size="small"
                       type="primary">新增顾问评价标签</el-button>
          </div>
        </common-table>
      </div>
      <!-- 添加标签组 -->
      <add-tag-group v-if="addTagGroupVisible"
                     placeholder="请输入顾问评价标签分组名称"
                     label="标签分组名称："
                     :title="isGroupEdit ? '编辑标签分组':'新建标签分组'"
                     :visible.sync="addTagGroupVisible"
                     :submitLoading="submitTagGroupLoading"
                     :subForm="groupEdit"
                     @save="saveLabelGroup">
      </add-tag-group>
      <!-- 添加标签 -->
      <operation-tag :visible.sync="addTagVisible"
                     :submitLoading="submitTagLoading"
                     @saveTag="saveTagItem"
                     @saveAll="saveAll"
                     v-if="addTagVisible">
        <div slot="title">标签分组：{{formData.name}}</div>
        <el-tag slot="content"
                v-for="(name,index) of labelAddList"
                :key="index"
                closable
                @close="tagItemDel(index)">
          {{name}}
        </el-tag>
      </operation-tag>
    </div>
  </div>

</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  labelGroup_getLabelGroups_api,
  labelGroup_create_api,
  label_create_api,
  label_deleteGroup_api,
  label_delete_api,
  label_editGroup_api
} from "@/api/modules/dealerList.ts";
import Collapse from "@/components/tag-collapse/index.vue";
import AddTagGroup from "@/components/tag-collapse/addTag.vue";
import OperationTag from "@/components/tag-collapse/operationTag.vue";
import CommonTable from "@/components/common-table/index.vue";
import { MessageBox } from "element-ui";
import { cloneDeep } from "lodash";

interface SearchData {
  businessCode: string;
  id?: number | string;
  name?: string;
}
interface LabelTabItem {
  id?: number;
  name?: string;
  type?: string | number;
}
interface LabelListItem {
  id: number;
  name: string;
  labels: Array<LabelTabItem>;
  type: string | number;
  select?: boolean;
}

@Component({
  components: {
    Collapse,
    CommonTable,
    AddTagGroup,
    OperationTag
  }
})
export default class consultantTag extends Vue {
  private addTagGroupVisible: boolean = false;
  private addTagVisible: boolean = false;
  private submitTagGroupLoading: boolean = false;
  private submitTagLoading: boolean = false;
  private formData: SearchData = { businessCode: "0", id: 1, name: "" }; // 获取所有数据的入参
  private labelList: Array<LabelListItem> = []; // 右边标签列表
  private labelTabList: Array<LabelTabItem> = []; // 左边的表格的列表
  private labelAddList: Array<string> = []; // 新增弹窗里面的列表
  private groupEdit: LabelTabItem = { name: "" }; // 标签组名字
  private isGroupEdit: boolean = false;
  private tableColumns = [
    {
      title: "顾问评价标签名称",
      key: "name"
    },
    {
      operate: this.accessIsOpened("PERM:ADVISER_COMMENT_LABEL:EDIT"),
      title: "操作",
      width: "100px",
      setBtns: (row: any, index: number) => {
        return [
          {
            label: "删除",
            size: "small",
            handler: () => this.deleteItem(row)
          }
        ];
      }
    }
  ];

  /**
   * @description 获取列表
   * @param 是否是通过id 筛选 默认不是
   */
  private async getLabelGroup(searchType: boolean = true) {
    let _param: SearchData = cloneDeep(this.formData);
    !searchType && _param.id && delete _param.id;
    try {
      let { data } = await labelGroup_getLabelGroups_api(_param);
      if (!searchType) {
        data = data.map((item: any) => {
          item.select = false;
          item.num = item.labelNum || 0;
          return item;
        });
        let _firstData: LabelListItem;
        let _index = data.findIndex((val: any) => val.id === this.formData.id);
        _firstData = data[_index];
        _firstData.select = true;
        this.formData.id = _firstData.id;
        this.formData.name = _firstData.name;
        this.labelList = data;
        this.labelTabList = data[_index].labels || [];
      } else {
        this.labelTabList = data[0].labels || [];
      }
    } catch (error) {
      this.log(error);
    }
  }

  /**
   * @deprecated 左侧标签组的一些方法
   */

  // 点击一行标签筛选
  private searchTag({ id, name }: LabelListItem) {
    this.formData.id = id;
    this.formData.name = name;
    this.getLabelGroup();
  }
  // 新增和编辑标签组-弹窗确认按钮操作
  private saveLabelGroup(name: string) {
    this.isGroupEdit ? this.editLabelGroupApi(name) : this.saveLabelGroupApi(name);
  }
  // 点击新增分组按钮
  private addTagGroup() {
    this.addTagGroupVisible = true;
    this.groupEdit = { name: "" };
    this.isGroupEdit = false;
  }
  // 编辑标签组
  private editSubItem({ name, id }: LabelTabItem) {
    this.groupEdit = { name, id };
    this.isGroupEdit = true;
    this.addTagGroupVisible = true;
  }
  // 新增标签组 API
  private async saveLabelGroupApi(name: string) {
    let _param = { name, businessCode: this.formData.businessCode };
    this.submitTagGroupLoading = true;
    try {
      await labelGroup_create_api(_param);
      this.getLabelGroup(false);
      this.submitTagGroupLoading = false;
      this.showMsg("标签分组新建成功");
    } catch (error) {
      this.submitTagGroupLoading = false;
      this.log(error);
    }
  }
  // 编辑标签组 API
  private async editLabelGroupApi(name: string) {
    let _param = { name, id: this.groupEdit.id };
    this.submitTagGroupLoading = true;
    try {
      await label_editGroup_api(_param);
      this.submitTagGroupLoading = false;
      this.getLabelGroup(false);
      this.showMsg("标签分组更新成功");
    } catch (error) {
      this.submitTagGroupLoading = false;
      this.log(error);
    }
  }
  // 删除标签组
  private async deletSubItem(id: number) {
    this._deleteconfirm("顾问营销标签组", id, this.deletSubItemApi);
  }
  // 删除标签组
  private async deletSubItemApi(id: number) {
    try {
      await label_deleteGroup_api(id);
      this.showMsg("删除成功");
      this.getLabelGroup(false);
    } catch (error) {
      this.log(error);
    }
  }

  /**
   * @deprecated 右边侧标签的一些方法
   */
  // 新增标签
  private addTag() {
    this.addTagVisible = true;
    this.labelAddList = [];
  }
  // 删除一列:标签
  private deleteItem(row: any) {
    this._deleteconfirm("顾问营销标签", row.id, this.deleteLabelApi);
  }
  private async deleteLabelApi(id: number) {
    try {
      await label_delete_api(id);
      this.showMsg("删除成功");
      this.getLabelGroup();
      this.getLabelGroup(false);
    } catch (error) {
      this.log(error);
    }
  }
  // 新建标签：弹窗里面的新增按钮
  private saveTagItem(name: string) {
    let length = this.labelAddList.length + this.labelTabList.length;
    if (length >= 10) {
      this.showMsg("最多支持添加10个顾问标签，添加失败", "warning");
      return;
    }
    this.labelAddList.push(name);
  }
  // 删除单独的标签：弹窗里面的删除按钮
  private tagItemDel(index: number) {
    this.labelAddList.splice(index, 1);
  }
  // 保存全部新建的标签
  private async saveAll() {
    if (this.labelAddList.length <= 0) {
      this.showMsg("请先添加标签", "warning");
      return;
    }
    this.submitTagLoading = true;
    try {
      await label_create_api({ groupId: this.formData.id, names: this.labelAddList });
      this.submitTagLoading = false;
      this.addTagVisible = false;
      this.getLabelGroup();
      this.getLabelGroup(false);
      this.labelAddList = [];
    } catch (error) {
      this.submitTagLoading = false;
      this.log(error);
    }
  }

  // 删除封装
  _deleteconfirm(title: string, id: number, callback: any) {
    MessageBox.confirm(`确定要删除${title}？删除后无法恢复`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        callback(id);
      })
      .catch(() => {
        this.showMsg("放弃操作", "warning");
      });
  }

  created() {
    this.getLabelGroup(false);
  }
}
</script>
<style lang='scss' scoped>
.consultantTag {
  display: flex;
  .left {
    width: 250px;
  }
  .right {
    width: calc(100% - 250px);
    padding-left: 20px;
  }
  .line {
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
    background: #fff;
  }
  .btn-group {
    width: 80%;
    display: flex;
    justify-content: space-between;
    .txt {
      margin-left: 10px;
    }
    .search {
      margin-right: 10px;
    }
  }
  .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .el-tag:first-child {
    margin-left: 0;
  }
}
</style>

