<template>
  <!-- 商品分类 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'商品分类'}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :totalCount.sync="count"
                    :apiFn="apiFn"
                    ref="adminTableRef"
                    :formData.sync="searchData"
                    :hasSearchBtn="true">
      <div slot="search">
        <el-form-item prop="name">
          <el-input v-model="searchData.name"
                    size="small"
                    placeholder="商品分类名称"
                    clearable />
        </el-form-item>
      </div>
      <div slot="right-btns">
        <el-form-item>
          <el-button @click="addShow"
                     v-if="accessIsOpened('PERM:GOODS_CLASSIFICATION:EDIT')"
                     size="small"
                     type="primary"
                     :disabled="count >= 20">新增分类</el-button>
        </el-form-item>
      </div>
      <div slot="line"
           class="line-box">
        <div class="line">
          商品分类（{{count}}）<span>此处添加的的商品分类，用于商品在用户端分类展示，方便用户通过商品分类快速查找商品，最多支持添加20个商品分类</span>
        </div>
      </div>
    </el-admin-table>
    <AddTag placeholder="请输入商品分类名称"
            label="商品分类名称"
            :title="editId ? `编辑商品分类`:`添加商品分类`"
            :visible.sync="addVisible"
            :submitLoading="submitTagLoading"
            :subForm="subForm"
            @save="saveSuc"></AddTag>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import AddTag from "@/components/tag-collapse/addTag.vue";
import { formatDate } from "@/utils";
import { mall_category_list_api, mall_category_add_api, mall_edit_api, mall_delete_api } from "@/api";

@Component({
  components: {
    AddTag
  }
})
export default class StoreClassification extends Vue {
  @Ref() readonly adminTableRef: any;
  private apiFn: any = mall_category_list_api;
  private searchData = { name: "" };
  private count: number = 0;
  private addVisible: boolean = false;
  private submitTagLoading: boolean = false;
  private editId: number | string = 0;
  private subForm = { name: "" };
  private tableAttrs = {
    columns: [
      {
        prop: "name",
        label: "商品分类"
      },
      {
        prop: "updatedTime",
        label: "创建时间",
        formatter: (row: any) => formatDate(row.updatedTime)
      },
      {
        type: "operation",
        btns: [
          {
            text: "编辑",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_CLASSIFICATION:EDIT"),
            atClick: (row: any) => this.editShow(row)
          },
          {
            text: "删除",
            show: (row: any) => this.accessIsOpened("PERM:GOODS_CLASSIFICATION:EDIT"),
            atClick: (row: any) => this.goToDelete(row.id)
          }
        ]
      }
    ]
  };

  private saveSuc(name: string) {
    this.editId ? this._editApi(name) : this._addApi(name);
  }

  /**
   * @description 操作按钮
   */
  private addShow() {
    this.addVisible = true;
    this.subForm.name = "";
    this.editId = 0;
  }
  private editShow(item: any) {
    this.addVisible = true;
    this.subForm.name = item.name;
    this.editId = item.id;
  }
  private goToDelete(id: number | string) {
    this.deleteconfirm(() => {
      this._deleteApi(id);
    });
  }

  private async _addApi(name: string) {
    try {
      await mall_category_add_api({ name });
      this.showMsg("添加成功");
      this.adminTableRef.goSearch();
    } catch (error) {
      this.log(error);
    }
  }
  private async _editApi(name: string) {
    try {
      await mall_edit_api(this.editId, { id: this.editId, name });
      this.showMsg("修改成功");
      this.adminTableRef.goSearch();
    } catch (error) {
      this.log(error);
    }
  }
  private async _deleteApi(id: number | string) {
    try {
      await mall_delete_api(id);
      this.showMsg("删除成功");
      this.adminTableRef.goSearch();
    } catch (error) {
      this.log(error);
    }
  }
}
</script>
<style lang='scss' scoped>
.line-box {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .line {
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
