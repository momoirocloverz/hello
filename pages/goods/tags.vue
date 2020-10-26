<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'车辆标签管理'}]" />
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getTagList"
                    ref="adminTableRef"
                    :formData.sync="searchData">
      <template slot="search">
        <el-form-item prop="type">
          <el-select v-model="searchData.type"
                     placeholder="选择类型"
                     clearable>
            <el-option v-for="item in tagsType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
      <template slot="right-btns">
        <el-form-item class="trb">
          <el-button size="small"
                     type="primary"
                     v-if='accessIsOpened("PERM:MODEL_LABEL:EDIT")'
                     @click="addTagInDialog">新建车辆标签</el-button>
        </el-form-item>
      </template>
    </el-admin-table>

    <elBtnDialog :visible.sync="modalVisible"
                 :title="`${dialogTitle}车辆标签`"
                 :saveAutoClose="false"
                 @close="tagsForSubmit=[]"
                 @save="saveTagForm">
      <el-form @submit.native.prevent
               :model="tagForm"
               ref="tagFormRef"
               :rules="tagFormRule"
               class="car_form"
               label-width="150px">
        <el-form-item prop="name"
                      label="标签名称：">
          <el-input maxlength="10"
                    v-model.trim="tagForm.name"
                    @keyup.native="readyCheck"
                    placeholder="请输入标签名称">
            <template slot="prepend">
              <el-select v-model="tagTypeForDialog"
                         @change="changeType"
                         class="tag__prepend">
                <el-option v-for="item in tagsType"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </template>
            <template slot="suffix">
              <span class="leng_spa">{{tagForm.name.length}}/10</span>
            </template>
            <template slot="append">
              <span @click="stashTag"
                    class="el-link el-link--primary">添加</span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="tag_group"
                      label="以下标签将被添加："></el-form-item>
        <el-form-item v-for="item in tagsType"
                      :key="item.value"
                      class="tag_group"
                      :label="`${item.label}：`">
          <el-tag type="info"
                  v-for="tag in tagsForSubmit.filter(e => e.type==item.value)"
                  :key="tag.name">
            {{tag.name}}
            <i class="el-icon-delete"
               @click.stop="removeUnitTag(tag)" />
          </el-tag>
        </el-form-item>
      </el-form>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref } from "vue-property-decorator";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { tagsFilter, tagsType } from "./const/filters";
import { tagList, tagCreate, tagEdit, tagDelete, checkIsRepeat } from "@/api";
interface Rules {
  name: element.FormRule[];
}
interface Tag {
  name: string;
  type: string | number;
}

@Component({
  components: {
    elBtnDialog
  }
})
export default class Highlight extends Vue {
  @Ref() readonly tagFormRef: element.Refs;
  @Ref() readonly adminTableRef: any;
  readonly tagsType = tagsType;
  timerX: any = 0;
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        prop: "type",
        label: "标签分类",
        formatter: (row: any) => {
          return tagsFilter(row.type);
        }
      },
      {
        prop: "name",
        label: "标签名称"
        // render: (h: any, row: any) =>
        //   h(
        //     "el-tooltip",
        //     {
        //       props: {
        //         content: row.name
        //       }
        //     },
        //     [h("span", row.name)]
        //   )
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
            show: (row: any) => this.accessIsOpened("PERM:MODEL_LABEL:EDIT"),
            text: "删除",
            atClick: (row: any) => this.removeTag(row)
          }
        ]
      }
    ]
  };
  get dialogTitle(): string {
    return this.dialogType === 1 ? "新建" : "编辑";
  }
  searchData: any = {
    type: ""
  };
  tagTypeForDialog: string | number = tagsType[0].value;
  modalVisible: boolean = false;
  dialogType: number = 1;
  tagForm: any = {
    name: "",
    picUrl: ""
  };
  tagFormOnEdit: any = {};
  isRepeat: boolean = false;
  repeatChecking: boolean = false;
  get tagFormRule(): Rules {
    const validatePass = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error("请输入标签名称"));
      } else if (this.isRepeat) {
        callback(new Error("标签名称重复"));
      } else {
        callback();
      }
    };
    return {
      name: [{ required: true, validator: validatePass, trigger: "change" }]
    };
  }
  tagsForSubmit: Tag[] = [];
  changeType() {
    this.$nextTick(() => this.tagFormRef.clearValidate())
  }
  getTagList(param = {}) {
    return tagList(param);
  }
  addTagInDialog() {
    this.dialogType = 1;
    this.modalVisible = true;
    this.$nextTick(() => {
      this.tagFormRef.resetFields();
    });
  }
  removeTag(row: any) {
    const textStyle = "color:#777;font-size:13px";
    this.$confirm(
      `确定要删除该车辆标签？
      <p style='${textStyle}'>删除后无法恢复</p>
      `,
      "提示",
      {
        dangerouslyUseHTMLString: true
      }
    ).then(() => {
      tagDelete([row.id]).then((res: any) => {
        if (res.data) {
          this.showMsg("删除成功");
          this.adminTableRef.goSearch();
        }
      });
    });
  }
  async saveTagForm() {
    try {
      if (this.tagsForSubmit.length < 1) {
        this.showMsg("没有新增的标签", "warning");
        return;
      }
      const { data } = await tagCreate(this.tagsForSubmit);
      this.tagsForSubmit = [];
      if (data) {
        this.modalVisible = false;
        this.showMsg(`${this.dialogTitle}成功`);
        this.adminTableRef.goSearch();
      }
    } catch (e) {
      this.log(e);
    }
  }
  readyCheck() {
    clearTimeout(this.timerX);
    this.timerX = setTimeout(() => {
      this.checkIsRepeat();
    }, 100);
  }
  /**
   * @description 检查是否重复 true=重复
   */
  async checkIsRepeat() {
    if (!this.tagForm.name) {
      this.isRepeat = false;
      return;
    }
    try {
      this.repeatChecking = true;
      const params = { tagName: this.tagForm.name };
      const { data } = await checkIsRepeat(params);
      this.isRepeat = data || false;
      this.repeatChecking = false;
      this.tagFormRef.validate();
    } catch (e) {
      this.log(e);
    }
  }
  /**
   * @description 弹窗临时暂存标签
   */
  stashTag() {
    if (this.repeatChecking || this.isRepeat) return;
    this.tagFormRef.validate((v: boolean) => {
      if (v) {
        let unit: Tag = {
          type: this.tagTypeForDialog,
          name: this.tagForm.name
        };
        let valid = this.tagsForSubmit.find(e => e.name === unit.name);
        if (valid) {
          return this.showMsg("请勿重复添加", "warning");
        }
        this.tagsForSubmit.push(unit);
        this.tagForm = {
          name: "",
          picUrl: ""
        };
        this.$nextTick(() => {
          this.tagFormRef.clearValidate();
        });
      }
    });
  }
  removeUnitTag(tag: Tag) {
    let ind = this.tagsForSubmit.findIndex(e => e.name === tag.name);
    this.tagsForSubmit.splice(ind, 1);
    this.tagFormRef.clearValidate();
  }
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
.tag__prepend {
  width: 120px;
}
.leng_spa {
  line-height: 40px;
}
.tag_group {
  margin-bottom: 0;
  .el-tag {
    margin: 0 5px;
  }
}
.el-icon-delete {
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    opacity: 0.8;
  }
}
/deep/ {
  .el-input-group__append {
    padding: 0;
  }
}
.el-link--primary {
  width: 70px;
  text-align: center;
  line-height: 36px;
}
</style>
