<!--救援设置-->
<template>
  <div class="rescue-page">
    <breadcrumb-group :breadGroup="[{ label: '救援设置', to: '' }]" />
    <div class="rescue-container" v-loading="loading">
      <div class="rescue-content">
        <div v-if="rescueSet.length > 0">
          <div class="rescue-list" v-for="(set, idx) in rescueSet" :key="idx">
            <div class="top">
              <strong>救援类型{{ idx + 1 }}</strong>
              <span class="el-icon-delete cursor" @click="deleteSet(idx)" v-if="isEdit"></span>
            </div>
            <div class="form-content">
              <common-form
                :props="formProp"
                ref="setFormRef"
                :form="set.rescueForm"
                :rules="rescueRules"
                size="small"
                label-width="140px"
              >
                <el-input
                  slot="rescue"
                  @change="val => changeRescue(val, idx)"
                  v-model="set.rescueForm.rescue"
                  placeholder="救援类型"
                  type="text"
                  show-word-limit
                  :disabled="!isEdit"
                  maxlength="20"
                ></el-input>
              </common-form>
            </div>
          </div>
        </div>
        <div class="no-data" v-else>
          <div class="top">救援设置</div>
          <div class="form-content ">
            <div class="iconfont  iconzanwujilu"></div>
            <div class="common_tip">暂未设置任何救援类型，点击编辑进行添加</div>
          </div>
        </div>
        <div class="tip-wrap" v-if="isEdit">
          <span class="primary-text cursor" v-if="rescueSet.length < 50" @click="addRescueSet">
            <i class="el-icon-plus"></i>
            添加
          </span>
          <span class="common_tip">最多支持添加50个救援类型</span>
        </div>
      </div>

      <div class="rescue-bottom"  v-if="hasEditPer">
        <el-button size="small" @click="handleCancel" v-if="isEdit">取消</el-button>
        <el-button type="primary" size="small" @click="handleSave" :disabled="loading">{{
          isEdit ? "保存" : "编辑"
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CommonForm from "@/components/common-form/index.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import _ from "lodash";
import { storeInfoSetting } from "@/utils/userSetting";
import { getRescue, createRescue } from "@/api";

interface RescueForm {
  id?: number;
  rescue: string;
  rescueMobile: number | null;
  rescueDescription?: string;
  dealerCode?: string;
}
interface SetItem {
  rescueForm: RescueForm;
}
@Component({
  name: "bannerSet",
  components: {
    CommonForm
  }
})
export default class extends Vue {
  @Prop({ default: "mall" }) private bannerType: string;
  readonly rescueForm: RescueForm = {
    id: 0,
    rescue: "",
    rescueMobile: null,
    rescueDescription: "string",
    dealerCode: ""
  };
  repeat: boolean = false;
  loading: boolean = false;
  initItem: SetItem = {
    rescueForm: {
      rescue: "",
      rescueMobile: null,
      rescueDescription: "",
      dealerCode: ""
    }
  };
  rescueSet: SetItem[] = [_.cloneDeep(this.initItem)];
  isEdit: boolean = false;
  get hasEditPer(): boolean {
    return this.accessIsOpened('PERM:RESCUE_OPTION:EDIT');
  }
  get rescueRules(): any {
    return {
      rescue: [
        { required: true, message: "请输入救援类型", trigger: "blur" },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (this.repeat) {
              callback(new Error("救援类型已存在,请重新输入"));
            } else {
              callback();
            }
          }
        }
      ],
      rescueMobile: {
        required: true,
        message: "请输入客服电话",
        trigger: "blur",
        pattern: /(^(([0+]\d{2,3}-?)?(0\d{2,3})-?)(\d{7,8})(-?(\d{3,}))?$)|(^0{0,1}1[3-9][0-9]{9}$)/
      },
      rescueDescription: { required: true, message: "请输入救援说明", trigger: "blur" }
    };
  }
  get dealerCode(): string {
    return storeInfoSetting.getInfo().dealerCode;
  }
  get formProp() {
    return [
      {
        label: "救援类型",
        prop: "rescue",
        placeholder: "救援类型",
        maxLength: 20,
        disabled: !this.isEdit
      },
      {
        label: "客服电话",
        tag: "input",
        prop: "rescueMobile",
        placeholder: "客服电话",
        maxLength: 20,
        disabled: !this.isEdit
      },
      {
        label: "救援说明",
        tag: "input",
        type: "textarea",
        row: 10,
        prop: "rescueDescription",
        placeholder: "救援说明",
        maxLength: 500,
        disabled: !this.isEdit
      }
    ];
  }
  changeRescue(value: string, idx: number) {
    let _obj: any = this.rescueSet.find((item: any, i) => item.rescueForm.rescue === value && idx !== i);
    this.repeat = !!_obj;
  }
  addRescueSet() {
    if (this.rescueSet.length < 50) {
      this.rescueSet.push(_.cloneDeep(this.initItem));
    }
  }
  deleteSet(idx: number) {
    this.rescueSet.splice(idx, 1);
  }
  async getList() {
    this.loading = true;
    try {
      let _arr: SetItem[] = [];
      let res = await getRescue({
        page: 1,
        size: 50
      });
      this.loading = false;
      let resData: Array<any> = res.data || [];
      resData.forEach((item: any) => {
        let { rescue, rescueDescription, rescueMobile } = item;
        _arr.push({
          rescueForm: { rescue, rescueDescription, rescueMobile }
        });
      });
      this.rescueSet = _arr;
    } catch (e) {
      this.loading = false;
    }
  }
  async saveRescueSet() {
    let data: Array<RescueForm> = [];
    this.rescueSet.forEach((item: any) => {
      data.push(item.rescueForm);
    });
    try {
      this.loading = true;
      await createRescue(data);
      this.loading = false;
      this.$message.success("保存成功");
      this.getList();
      this.isEdit = false;
    } catch (e) {
      this.loading = false;
    }
  }
  handleCancel() {
    this.$confirm("编辑信息未保存，确定要离开？", "提示").then(() => {
      this.isEdit = false;
      let $setFormRefs: any = this.$refs.setFormRef;
      $setFormRefs.forEach((ref: HTMLFormElement) => {
        ref.formRef.clearValidate();
      });
      this.getList();
    });
  }
  handleSave() {
    if (this.isEdit) {
      let results: Array<Promise<any>> = [];
      let $setFormRefs: any = this.$refs.setFormRef;
      $setFormRefs.forEach((ref: HTMLFormElement) => {
        let pro = ref.formRef.validate();
        results.push(pro);
      });
      Promise.all(results).then(() => {
        this.saveRescueSet();
      });
    } else {
      this.rescueSet = this.rescueSet.length > 0 ? this.rescueSet : [_.cloneDeep(this.initItem)];
    }
    this.isEdit = true;
  }
  created() {
    this.getList();
  }
}
</script>

<style lang="scss">
.rescue-page {
  .rescue-container {
    background: #fff;
    padding: 15px;
  }
  .rescue-content {
    .top {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      border: 1px solid #f5f5f5;
      .el-icon-delete {
        font-size: 18px;
        color: $primary-color;
      }
    }

    .form-content {
      padding: 15px 0;
      border: 1px solid #f5f5f5;
      border-top: none;
      .el-input,
      .el-select,
      .el-textarea {
        width: 60%;
      }
    }
    .tip-wrap {
      border-top: 1px solid #f5f5f5;
      padding: 15px;
    }
  }
  .no-data {
    .form-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .iconfont {
        font-size: 120px;
        color: #bfbfbf;
      }
    }
  }
  .rescue-bottom {
    padding-left: 135px;
    padding-top: 15px;
    border-top: 1px solid #f5f5f5;
  }
}
</style>
