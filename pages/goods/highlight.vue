<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'车型亮点管理'}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getHighlightsList"
                    ref="adminTableRef"
                    :formData.sync="searchData">
      <template slot="search">
        <el-form-item prop="nameLike">
          <el-input v-model="searchData.nameLike"
                    placeholder="输入名称"
                    clearable />
        </el-form-item>
      </template>
      <template slot="right-btns">
        <el-form-item class="trb">
          <el-button size="small"
                     v-if='accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT")'
                     type="primary"
                     @click="addHighlight">新建车型亮点</el-button>
        </el-form-item>
      </template>
    </el-admin-table>

    <elBtnDialog :visible.sync="modalVisible"
                 :title="`${dialogTitle}车型亮点`"
                 :saveAutoClose="false"
                 @close="closeModal"
                 @save="saveModelForm">
      <el-form @submit.native.prevent
               :model="carModelForm"
               ref="carModelFormRef"
               :rules="carModelFormRule"
               class="car_form"
               label-width="120px">
        <el-form-item prop="name"
                      label="亮点名称">
          <el-input maxlength="10"
                    v-model.trim="carModelForm.name"
                    placeholder="请输入亮点名称">
            <template slot="suffix">
              {{carModelForm.name.length}}/10
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="picUrl"
                      label="图标">
          <uploadToAli v-model="carModelForm.picUrl"
                       accept='image/png,image/jpg,image/jpeg'
                       :size="1024 * 3" />
        </el-form-item>
        <el-form-item>
          <div class="gray_txt">支持jpg、png、jpeg，单个文件不能超过3MB，建议尺寸600*300px（或相同比例）</div>
        </el-form-item>
      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import {
  highlightsList,
  highlightsCreate,
  highlightsEdit,
  highlightsDelete
} from "@/api";
interface Rules {
  name: element.FormRule[];
  picUrl?: element.FormRule[];
}

@Component({
  components: {
    elBtnDialog,
    uploadToAli
  }
})
export default class Highlight extends Vue {
  @Ref() readonly carModelFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  readonly tableAttrs = {
    border: true,
    columns: [
      // {
      //   type: 'index'
      // },
      {
        prop: "msgContent",
        label: "车型图片",
        render: (h: Function, row: any) =>
          h("img", {
            class: "row_img",
            attrs: {
              src: row.picUrl
            }
          })
      },
      {
        prop: "name",
        label: "车型亮点名称"
      },
      {
        type: "operation",
        col: {
          width: "200px"
        },
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT"),
            text: "编辑",
            atClick: (row: any) => this.modifyHighlight(row)
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:MODEL_HIGHLIGHTS:EDIT"),
            text: "删除",
            atClick: (row: any) => this.removeHighlight(row)
          }
        ]
      }
    ]
  };
  searchData = {
    nameLike: ''
  };
  modalVisible: boolean = false;
  dialogType: number = 1;
  get dialogTitle(): string {
    return this.dialogType === 1 ? "新建" : "编辑";
  };
  carModelForm: any = {
    name: '',
    picUrl: ''
  };
  carModelFormOnEdit: any = {};
  carModelFormRule: Rules = {
    name: [{ required: true, message: '请输入亮点名称', trigger: 'blur' }],
    picUrl: [{ required: true, message: '请上传亮点图片', trigger: 'change' }]
  };
  getHighlightsList(param = {}) {
    return highlightsList(param)
  };
  addHighlight() {
    this.dialogType = 1;
    this.carModelForm = {
      name: '',
      picUrl: ''
    };
    this.modalVisible = true;
    this.$nextTick(() => {
      this.carModelFormRef.clearValidate();
    })
  };
  closeModal() {
    this.carModelForm = {
      name: '',
      picUrl: ''
    }
  };
  modifyHighlight(row: any) {
    this.dialogType = 2;
    this.carModelForm = { ...row };
    this.modalVisible = true;
    this.$nextTick(() => {
      this.carModelFormRef.clearValidate();
    })
  };
  removeHighlight(row: any) {
    this.$confirm("确定要删除该车型亮点？").then(() => {
      highlightsDelete(row.id).then((res: any) => {
        if (res.data) {
          this.showMsg('删除成功');
          this.adminTableRef.goSearch();
        }
      })
    })
  };
  async saveModelForm() {
    let flag = false;
    this.carModelFormRef.validate((v: boolean) => flag = v)
    if (!flag) return;
    try {
      const cf = this.carModelForm
      let params: any = {
        name: cf.name,
        picUrl: cf.picUrl
      }
      this.dialogType === 2 && (params.id = cf.id);
      const fn = this.dialogType === 1
        ? highlightsCreate
        : highlightsEdit;

      const { data } = await fn(params);
      if (data) {
        this.modalVisible = false;
        this.showMsg(`${this.dialogTitle}成功`);
        this.adminTableRef.goSearch();
      }
    } catch (e) {
      this.log(e)
    }
  };
}
</script>
<style lang="scss" scoped>
.trb {
  position: absolute;
  right: 0;
}
.car_form {
  width: 90%;
}
/deep/ {
  .row_img {
    max-width: 80px;
    vertical-align: middle;
  }
}
</style>
