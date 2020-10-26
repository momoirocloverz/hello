<template>
  <div class="appointmentDetail">
    <el-card class="form_card">
      <template slot="header">
        <span>客户信息</span>
      </template>
      <el-row type="flex"
              class="flex-row">
        <img class="head"
             src="https://via.placeholder.com/120x120.png">
        <el-col :span="20">
          <div class="flex-item">
            <p>客户姓名: 1111</p>
            <p>联系电话: 1223455667</p>
            <p>提车地址: 四川省成都市吉利4s点</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="form_card">
      <template slot="header">
        <span>专属顾问</span>
      </template>
      <el-row type="flex"
              class="flex-row">
        <img class="head"
             src="https://via.placeholder.com/120x120.png">
        <el-col :span="8">
          <div class="flex-item">
            <div class="consultant">
              <span class="name">陈红丽</span>
              <p class="el-icon-star-on border">4星顾问</p>
              <i class="el-icon-female color"></i>
            </div>
            <p><span class="point">吉利成都特约服务站</span></p>
            <p>手机号: 1223455667</p>
          </div>
        </el-col>
        <el-col :span="8">
          <img src="https://via.placeholder.com/80x80.png">
          <div>专属二维码</div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="form_card">
      <template slot="header">
        <span>订单信息</span>
      </template>
      <el-row type="flex"
              class="flex-row">
        <img class="head"
             src="https://via.placeholder.com/140x100.png">
        <el-col :span="7">
          <div class="flex-item">
            <p>预约车系: 1111</p>
            <p>预约车型: 1223455667</p>
            <p>颜色: 黑色</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="flex-item">
            <p>是否试乘: 是</p>
            <p>是否按揭: 是</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="flex-item">
            <p>订单编号: 1111</p>
            <p>下单时间: 1223455667</p>
            <p>订单来源: 黑色</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class appointmentDetail extends Vue {
  @Prop({ default: "appointmentDetail -> defaultName" }) name: string;

  created() {
    console.log(this.name);
  }
}
</script>
<style lang="scss" scoped>
.form_card {
  margin-bottom: 20px;
}
.flex-row {
  align-items: center;
  .head {
    margin-right: 20px;
  }
}
.flex-item {
  display: flex;
  flex-direction: column;
  height: 100px;
  justify-content: space-around;
  p {
    margin: 0;
  }
  .point {
    padding: 4px;
    border-radius: 5px;
    background-color: #e2e2e2;
    color: #127dd7;
  }
  .consultant {
    display: flex;
    align-items: center;
    .name {
      font-size: 18px;
      margin-right: 5px;
      font-weight: bold;
    }
    .el-icon-star-on:before {
      color: #e0e053;
    }
    .border {
      font-size: 14px;
      padding: 2px 5px;
      border-radius: 9px;
      border: 1px solid #e2e2e2;
      margin-right: 5px;
    }
    .color {
      padding: 3px;
      border-radius: 50%;
      background-color: #f190cc;
    }
    .color:before {
      color: #fff;
    }
  }
}
</style>

