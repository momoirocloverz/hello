<template>
  <div class="content">
    <el-form @submit.native.prevent
             :model="_basisForm"
             ref="subFormRef"
             :rules="subFormRules"
             size="small"
             label-width="160px">
      <el-form-item label="封面图："
                    prop="logo"
                    class="minw">
        <uploadToAli v-model="_basisForm.logo"
                     accept='image/png,image/jpg,image/jpeg'
                     :size="1024 * 3"
                     :disabled="disabled" />
        <div class="gray_txt">支持格式：jpg、png、jpeg，单个文件不能超过3MB，建议尺寸300*220px（或相同比例）</div>
      </el-form-item>
      <el-form-item label="车型名称："
                    prop="name"
                    class="minw">
        <el-input v-model.trim="_basisForm.name"
                  :disabled="disabled"
                  @keyup.native="readyCheck"
                  :maxlength="20"
                  clearable>
          <template slot="suffix">{{_basisForm.name.length}}/20</template>
        </el-input>
      </el-form-item>
      <el-form-item label="厂家指导价(万元)："
                    prop="guidePrice"
                    class="minw">
        <el-input v-model.trim="_basisForm.guidePrice"
                  v-formatNum:2="_basisForm.guidePrice"
                  :disabled="disabled"
                  clearable>
          <template slot="suffix"></template>
        </el-input>
      </el-form-item>
      <el-form-item label="上市日期："
                    prop="listingDate"
                    class="minw">
        <el-date-picker v-model="_basisForm.listingDate"
                        :disabled="disabled"
                        value-format="timestamp"
                        clearable />
      </el-form-item>
      <!-- <el-form-item label="车型介绍："
                    prop="introduction">
        <vueQuillEditor :disabled="disabled"
                        :content.sync="_basisForm.introduction" />
      </el-form-item> -->
      <el-form-item class="tecenter">
        <el-button class="step_btn"
                   @click.stop="backWithoutSave">
          {{disabled?"返回":"取消"}}
        </el-button>
        <el-button class="step_btn"
                   type="primary"
                   :loading="repeatChecking"
                   @click="nextStep">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Ref } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import GoodsDetailMixin from "../mixin/goods-detail.mixin";
import vueQuillEditor from "@/components/vue-quill-editor";
import { getModelBase, dealerModelBase, modifyModelBase, isRepeatModelName } from "@/api";
import uploadToAli from "@/components/upload-to-ali/src/index.ts";
import deepClone from "@/utils/deepClone";
const BigNumber = require('bignumber.js');
interface SubForm {
  logo: element.FormRule[],
  name: element.FormRule[],
  guidePrice: element.FormRule[],
  // introduction: element.FormRule[],
  listingDate?: element.FormRule[],
}
const validatePass = (rule: any, value: string, callback: any) => {
  if (Number(value) > 2000) {
    callback(new Error('金额不能超过2000万元'));
  } else if (Number(value) <= 0) {
    callback(new Error("指导价不可为0"));
  } else {
    callback();
  }
};
const introductionValidatePass = (rule: any, value: string, callback: any) => {
  if (value.length > 6000) {
    callback(new Error('内容已超过最大限制，请简化内容或样式'));
  } else {
    callback();
  }
};

@Component({
  inheritAttrs: false,
  components: { uploadToAli }
})
export default class ModelBasis extends mixins(GoodsDetailMixin) {
  @Ref() readonly subFormRef: element.Refs;
  @PropSync('basisForm', {
    type: Object, default: () => {
      return {}
    }
  }) _basisForm: any;
  // 基础详情数据
  @PropSync('modelData', { type: Object }) _modelData: any;
  focusedInput: boolean = false;
  timerX: any = 0;
  repeatChecking: boolean = false;
  isRepeat: boolean = false;
  get subFormRules(): SubForm {
    const nameValidatePass = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('请输入车型名称'));
      } else if (this.isRepeat) {
        callback(new Error("车型名称重复"));
      } else {
        callback();
      }
    };
    return {
      logo: [{ required: true, message: '请选择封面图', trigger: 'change' }],
      name: [
        { required: true, message: '请输入车型名称', trigger: 'change' },
        { validator: nameValidatePass, trigger: ['change', 'blur'] }
      ],
      guidePrice: [
        { required: true, message: '请输入指导价', trigger: 'change' },
        { validator: validatePass, trigger: ['change', 'blur'] }
      ],
      // listingDate: [{ required: true, message: '请选择上市日期', trigger: 'change' }],
      // introduction: [
      //   { required: true, message: '请输入车型介绍', trigger: 'change' },
      //   { validator: introductionValidatePass, trigger: ['change', 'blur'] }
      // ]
    }
  };
  basisModelName: string = '';
  // 检查编辑
  basisFormOrigin: any = {
    logo: '',
    name: '',
    guidePrice: '',
    // listingDate: new Date(new Date().toDateString()),
    listingDate: '',
    // introduction: '',
  };
  async nextStep() {
    let flag = false;
    this.subFormRef.validate((v: boolean) => flag = v);
    if (!flag || this.repeatChecking) return;
    if (this.operationType === 'edit') {
      const res = await this.modifyModelBase();
      if (!res) return;
    }
    this._stepWalk = "1";
  };
  beforeCheckRepeat() {
    this.focusedInput = true;
    this.isRepeat = false;
    if (this._basisForm.name) {
      this.repeatChecking = true;
    }
  };
  readyCheck() {
    clearTimeout(this.timerX)
    this.timerX = setTimeout(() => {
      this.isRepeatModelName()
    }, 100);
  }
  /**
   * @description 检查是否重复 true=重复
   */
  async isRepeatModelName() {
    const { name } = this._basisForm;
    if (!name) return;
    if (this.basisModelName === name) {
      this.isRepeat = false;
      this.repeatChecking = false;
      return
    }
    try {
      this.repeatChecking = true;
      const params = {
        modelName: name,
        seriesCode: this.$route.query.serie,
      }
      const { data } = await isRepeatModelName(params);
      this.isRepeat = data || false;
      this.repeatChecking = false;
      // this.subFormRef.validate();
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 编辑状态下提交修改的数据
   */
  async modifyModelBase() {
    try {
      const params = {
        ...this._basisForm,
        guidePrice: Number(BigNumber(this._basisForm.guidePrice).multipliedBy(10000)),
        code: this.modelCode,
        id: this._modelData.id,
        seriesCode: this.$route.query.serie,
        // distributorCount: 0,
        // status: 0
      }
      const { data } = await modifyModelBase(params);
      if (data) {
        this.showMsg('修改成功');
        this.basisFormOrigin = deepClone(this._basisForm);
      }
      return Promise.resolve(data);
    } catch (e) {
      this.log(e)
    }
  };
  async getModelBase() {
    if (this.operationType === 'add') return;
    try {
      const modelCode = this.modelCode;
      let fn = this.sysPlat === 'agent' ? dealerModelBase : getModelBase
      const { data } = await fn(modelCode);
      this._modelData = data;
      this.basisModelName = data.name
      this._basisForm = {
        logo: data.logo,
        name: data.name,
        guidePrice: Number(BigNumber(data.guidePrice).dividedBy(10000)),
        listingDate: data.listingDate,
        // introduction: data.introduction,
      }
      this.$nextTick(() => {
        this.basisFormOrigin = deepClone(this._basisForm);
      })
    } catch (e) {
      this.log(e)
    }
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.basisFormOrigin);
    let current = JSON.stringify(this._basisForm);
    return this.notEdited(origin === current, self);
  };
  created() {
    this.getModelBase();
  };
}
</script>
<style lang="scss" scoped>
.minw {
  /deep/ .el-input {
    width: 30%;
  }
}
.logo_pic {
  max-width: 100px;
}
/deep/ {
  .el-date-editor {
    width: 100%;
  }
  .el-input__inner {
    padding-right: 50px;
  }
}
</style>
