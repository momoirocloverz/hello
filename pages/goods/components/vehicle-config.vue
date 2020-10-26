<template>
  <section class="param_box"
           v-loading="loading">
    <div class="content">
      <span v-for="(btn, i) in configOrigin"
            :key="i"
            class="el-button  el-button--mini"
            :class="currentBtn===i?'el-button--primary':''"
            @click.stop="scrollToList(i)">
        {{btn.name}}（{{btn.switchValueInPage ? '显示' : '不显示'}}）
      </span>
      <span class="switch_btn">
        <el-switch v-model="listSwitchAll"
                   active-text="全部显示"
                   :disabled="disabled" />
        <el-tooltip content="可设置车型配置在微信端商城车型详情页是否显示"
                    placement="top">
          <i class="el-icon-question" />
        </el-tooltip>
      </span>
    </div>

    <div id="scroll_box">
      <div class="inner_content"
           v-for="(paramBox, i) in configOrigin"
           :key="i"
           :id="`${idPrefix}${i}`">
        <el-row class="title">
          <el-col :span="leftCol+3">
            <b>{{paramBox.name}}</b>
          </el-col>
          <el-col :span="12">
            <div v-if="paramBox.hasRadioGroup">
              <el-radio-group v-model="paramBox.radioGroupValue"
                              size="small"
                              :disabled="disabled">
                <el-radio v-for="option in modelConfigOptionsInPage"
                          :key="option.value"
                          :label="option.value"
                          @click.native="selectGroupReverse(i, option.value)"
                          border>
                  {{option.label}}
                </el-radio>
              </el-radio-group>
            </div>
          </el-col>
          <el-switch v-model="paramBox.switchValueInPage"
                     class="switch_btn"
                     active-text="显示"
                     :disabled="disabled" />
        </el-row>

        <div class="divider" />

        <el-row :gutter="40"
                class="content_detail"
                v-for="(param, j) in paramBox.modelConfigWithOptions"
                :key="j">
          <el-col :span="leftCol"
                  :offset="3">{{param.name}}</el-col>
          <el-col :span="rightCol">
            <template v-if="!param.modelConfigOptions || param.modelConfigOptions.length === 0">
              <el-input v-model="param.value"
                        :disabled="disabled"
                        maxlength="100">
                <template slot="suffix">
                  <span v-if="!disabled">{{param.value ? param.value.length : 0}}/100</span>
                </template>
              </el-input>
            </template>
            <template v-if="param.modelConfigOptions && param.modelConfigOptions.length > 0">
              <el-radio-group v-model="param.codeArr"
                              size="small"
                              :disabled="disabled">
                <el-radio v-for="option in param.modelConfigOptions"
                          :key="option.code"
                          :label="option.code"
                          @click.native="selectConfigReverse(i, j, option.code)"
                          border>
                  {{option.name}}
                </el-radio>
              </el-radio-group>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
    <slot name="footer">
      <div class="tecenter">
        <el-button class="step_btn"
                   size="small"
                   @click.stop="backWithoutSave">
          {{disabled?"返回":"取消"}}
        </el-button>
        <el-button class="step_btn"
                   size="small"
                   @click.stop="_stepWalk='0'">上一步</el-button>
        <el-button class="step_btn"
                   type="primary"
                   size="small"
                   v-if="!disabled"
                   @click="onlySave">保存</el-button>
        <el-button class="step_btn"
                   type="primary"
                   size="small"
                   v-if="operationType==='add'"
                   @click="publish">保存并上架</el-button>
      </div>
    </slot>
  </section>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { mixins } from "vue-class-component";
import GoodsDetailMixin from "../mixin/goods-detail.mixin";
import deepClone from "@/utils/deepClone";
import {
  vehicleConfig,
  vehicleConfigByModel,
  modifyConfigByModel,
  saveModelConfigGroups
} from "@/api";
const timerOutLimit = 16; // 延迟一会处理所有的全选，不想做过多的队列判断了

@Component({
  inheritAttrs: false
})
export default class GoodsParams extends mixins(GoodsDetailMixin) {
  @PropSync('configForSubmit', { type: Object }) _configForSubmit: vehicleConfig.ConfigSub;
  readonly idPrefix: string = "id_";
  readonly leftCol: number = 5;
  readonly rightCol: number = 12;
  readonly modelConfigOptionsInPage: element.Options[] = [
    { label: '全有', value: 0 },
    { label: '全无', value: 1 },
    { label: '全选装', value: 2 },
  ]
  loading: boolean = true;
  offsetTopList: number[] = [];
  configOrigin: any = [];
  // 原始配置 origin 被占用了
  configOriginStatic: any = {};
  get listSwitchAll() {
    return this.configOrigin.every((e: any) => e.switchValueInPage)
  }
  set listSwitchAll(val: boolean) {
    this.configOrigin.forEach((ele: any) => ele.switchValueInPage = val)
  }
  currentBtn: number = 0;
  /**
   * @description 滚动到对应的配置详情
   * @param i 参数对象索引
   */
  scrollToList(i: number) {
    this.currentBtn = i;
    const dom = <HTMLDivElement>document.querySelector(`#${this.idPrefix}${i}`);
    const winDom = <HTMLDivElement>document.querySelector("#theme-container-main");
    winDom.scrollTo(0, dom.offsetTop - 80);
  }
  get scrollBox(): any {
    return document.querySelector('#theme-container-main')
  }
  /**
   * @description 单击配置反选
   */
  selectConfigReverse(i: number, j: number, code: string) {
    let { codeArr } = this.configOrigin[i].modelConfigWithOptions[j];
    if (codeArr === code) {
      setTimeout(() => {
        this.configOrigin[i].modelConfigWithOptions[j].codeArr = '';
      })
    }
    let indexList: number[] = []; // 所有 isChoosed 都在一个Index
    // configOrigin[i].radioGroupValue  // 全选按钮的值
    setTimeout(() => {
      this.configOrigin[i].radioGroupValue = "";
      let list = this.configOrigin[i].modelConfigWithOptions;
      list.forEach((ele: any) => {
        if (ele.type === 2) {
          if (ele.codeArr) {
            let ind = ele.modelConfigOptions
              .findIndex((tar: any) => tar.code === ele.codeArr);
            indexList.indexOf(ind) < 0 && indexList.push(ind);
          } else {
            indexList.push(-1);
          }
        }
      });
      if (indexList.length === 1) {
        this.configOrigin[i].radioGroupValue = Number(indexList[0])
      }
    }, timerOutLimit)
  }
  /**
   * @description 单击组合反选
   */
  selectGroupReverse(i: number, val: number) {
    let cur = this.configOrigin[i].radioGroupValue;
    if (cur === val) {
      setTimeout(() => {
        this.configOrigin[i].radioGroupValue = '';
      })
    }
    setTimeout(() => {
      let index = this.configOrigin[i].radioGroupValue; // 0,1,2, ''
      this.configOrigin[i].modelConfigWithOptions.forEach((ele: any) => {
        ele.codeArr = "";
        if (
          String(index).length > 0
          && ele.modelConfigOptions
          && ele.modelConfigOptions.length > 0
        ) {
          ele.codeArr = ele.modelConfigOptions[Number(index)].code;
        }
      });
    }, timerOutLimit)
  }
  async onlySave() {
    await this.nextStep()
    if (this.operationType === 'edit') {
      this.$router.replace({
        name: "goods-list-factory"
      })
    }
    this.$emit('onlySave', true);
  };
  async publish() {
    await this.nextStep()
    this.$emit('publish', true);
  };
  async nextStep() {
    await this.formatConfigValue();
    if (this.operationType === 'edit') {
      const [v1, v2] = await Promise.all([
        this.modifyConfigByModel(),
        this.saveModelConfigGroups()
      ])
      if (!v1 || !v2) return;
      this.showMsg('修改成功');
    }
    this.configOriginStatic = deepClone(this.configOrigin);
    return Promise.resolve();
    // this._stepWalk = "3";
  }
  /**
   * @description 保存配置详细
   */
  async modifyConfigByModel() {
    try {
      const params = {
        modelCode: this.modelCode,
        configValues: this._configForSubmit.configValues
      }
      const { data } = await modifyConfigByModel(params);
      return Promise.resolve(data);
    } catch (e) {
      this.log(e)
    }
  }
  /**
   * @description 保存配置组显示情况
   */
  async saveModelConfigGroups() {
    try {
      const params = {
        modelCode: this.modelCode,
        modelConfigGroups: this._configForSubmit.modelConfigGroups
      }
      const { data } = await saveModelConfigGroups(params);
      return Promise.resolve(data);
    } catch (e) {
      this.log(e)
    }
  }
  /**
   * @description 获取配置列表数据
   */
  async getVehicleConfig() {
    try {
      let res = [];
      if (this.modelCode) {
        const { data } = await vehicleConfigByModel(this.modelCode);
        res = data || [];
      } else {
        const { data } = await vehicleConfig();
        res = data || [];
      }
      this.loading = false;
      res.forEach((ele: any) => {
        ele.switchValueInPage = (ele.showFlag === "DISPLAY" || ele.showFlag === 1);
        let wo = ele.modelConfigWithOptions;
        let indexList: number[] = []; // 所有 isChoosed 都在一个Index
        let everyHasOneChoosen = true; // 所有选择框都有一个 isChoosed = true
        for (let x = 0; x < wo.length; x++) {
          let e = wo[x]
          if (e.type === 2) {
            // 增加一个全选按钮
            ele.hasRadioGroup = true;
            ele.radioGroupValue = '';
            // 增加变量给 radio 用
            let t: string = '';
            e.modelConfigOptions.forEach((tar: any, ind: number) => {
              if (tar.isChoosed) {
                t = tar.code;
                indexList.indexOf(ind) < 0 && indexList.push(ind);
              }
            });
            e.codeArr = t;
            if (everyHasOneChoosen) {
              everyHasOneChoosen = e.modelConfigOptions.some((tar: any) => tar.isChoosed)
            }
          }
          if (everyHasOneChoosen && indexList.length === 1) {
            ele.radioGroupValue = Number(indexList[0]);
          }
        }
      });
      this.$set(this, 'configOrigin', res);
      this.$nextTick(() => {
        this.configOriginStatic = deepClone(this.configOrigin);
        this.setScrollListener();
      })
    } catch (e) {
      this.loading = false;
      this.log(e)
    }
  };
  setScrollListener() {
    const domArr = document.querySelectorAll('.inner_content');
    domArr.forEach((e: any) => {
      this.offsetTopList.push(e.offsetTop)
    })
    this.scrollBox.addEventListener('scroll', this.scrollHandler);
  }
  scrollHandler() {
    let st = this.scrollBox.scrollTop + 40;
    let t = [...this.offsetTopList, st].sort((a, b) => a - b);
    this.currentBtn = t.indexOf(st) - 1;
  }
  /**
   * @description 格式化需要提交的数据
   */
  async formatConfigValue() {
    let configValues: vehicleConfig.ConfigValue[] = [];
    let modelConfigGroups: vehicleConfig.ModelConfigGroups[] = []
    this.configOrigin.forEach((ele: any) => {
      modelConfigGroups.push({
        groupCode: ele.code,
        showFlag: ele.switchValueInPage ? 'DISPLAY' : 'NO_DISPLAY'
      })
      let wo = ele.modelConfigWithOptions
      for (let x = 0; x < wo.length; x++) {
        let e = wo[x]
        if (e.modelConfigOptions && e.modelConfigOptions.length > 0) {
          // e.codeArr.length > 0 &&  checkbox数组的时候用
          e.codeArr && e.codeArr.length > 0 && configValues.push({
            configCode: e.code,
            configOptionCode: e.codeArr || ''
          })
        } else {
          e.value && configValues.push({
            configCode: e.code,
            configValue: e.value
          })
        }
      }
    })
    this._configForSubmit = {
      configValues,
      modelConfigGroups
    }
    return Promise.resolve()
  }
  /**
   * @description 退出之前判断是否有修改
   */
  backWithoutSave(self = true) {
    let origin = JSON.stringify(this.configOriginStatic)
    let current = JSON.stringify(this.configOrigin)
    if (this.operationType === 'add') {
      return this.notEdited(origin === current, self);
    } else {
      return this.notEdited(origin === current, self);
    }
  };
  created() {
    this.getVehicleConfig();
  };
  activated() {
    this.scrollBox && this.scrollBox.addEventListener('scroll', this.scrollHandler);
  };
  deactivated() {
    this.scrollBox && this.scrollBox.removeEventListener('scroll', this.scrollHandler);
  }
}
</script>
<style lang="scss" scoped>
.param_box .content {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  position: sticky;
  top: 40px;
  z-index: 3;
  box-shadow: 0 1px 0 rgba($color: #000000, $alpha: 0.03);
  .el-button--mini {
    padding-left: 6px;
    padding-right: 6px;
  }
}
.divider {
  height: 1px;
  background: rgba($color: #000000, $alpha: 0.03);
}
.switch_btn {
  float: right;
  display: inline-flex;
  flex-direction: row-reverse;
}
/deep/ {
  .el-switch__core {
    margin-left: 10px;
  }
  .el-input__suffix {
    line-height: 40px;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    color: #444;
  }
  .el-input__inner {
    padding-right: 60px;
  }
}
.content_detail {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}
.inner_content {
  background: #fff;
  border-radius: 2px;
  position: relative;
  .title {
    z-index: 2;
    background-color: #f8f8f8;
    padding: 15px 20px;
    position: sticky;
    top: 80px;
  }
  & + & {
    margin-top: 20px;
  }
}
.tecenter {
  background: #fff;
  padding: 20px;
  position: sticky;
  bottom: 0;
  z-index: 3;
}
.el-icon-question {
  font-size: 20px;
}
</style>
