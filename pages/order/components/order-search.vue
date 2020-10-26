<template>
  <span>
    <el-form-item>
      <el-input v-model="_formData.orderNos[0]"
                placeholder="订单编号"
                maxlength="30"
                clearable />
    </el-form-item>
    <el-form-item>
      <el-input v-model="_formData.userName"
                placeholder="客户姓名"
                maxlength="20"
                clearable />
    </el-form-item>
    <el-form-item>
      <el-input v-model="_formData.phone"
                placeholder="客户手机号"
                v-formatTel="_formData.phone"
                clearable />
    </el-form-item>
    <el-form-item>
      <el-select v-model="_formData.statusList[0]"
                 placeholder="订单状态">
        <el-option v-for="(item,x) in orderStatusList"
                   :key="x"
                   :value="item.value"
                   :label="item.label" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-date-picker ref="dateRangeRef"
                      v-model="_daterange"
                      :clearable="false"
                      type="daterange"
                      value-format="timestamp"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions" />
    </el-form-item>
  </span>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import { shopOrderStatusList, mailOrderStatusList } from "../const";
import { pickerOptions } from "../const/date-selection";
import dayjs from "dayjs";
interface _formData {
  orderNos: string,
  userName: string,
  phone: string,
  status: string,
  startDate: string,
  endDate: string
}

@Component
export default class OrderSearch extends Vue {
  @Prop({ type: Boolean, default: false }) isMail: boolean;
  get orderStatusList() {
    return this.isMail ? mailOrderStatusList : shopOrderStatusList
  };
  readonly pickerOptions = pickerOptions;
  @PropSync('daterange', { type: Array, default: () => [] }) _daterange: any;
  @PropSync('formData', {
    type: Object,
    default: () => {
      return {
        orderNos: [''],
        userName: '',
        phone: '',
        statusList: [''],
        startTime: '',
        endTime: ''
      }
    }
  }) _formData: any;
  @Watch('_daterange', { immediate: true, deep: true })
  valueChange(val: string[]) {
    this._formData.startTime = val[0]
    this._formData.endTime = val[1]
  }
}
</script>