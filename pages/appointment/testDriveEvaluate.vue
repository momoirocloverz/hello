<template>
  <div class="appointmentTestDrive">
    <el-form @submit.native.prevent
             :inline="true"
             size="small"
             class="search-form-inline">
      <el-form-item :model="formData">
        <el-select placeholder="时间"
                   v-model="formData.time">
          <el-option v-for="item in time"
                     :key="item.value"
                     :label="item.text"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input placeholder="顾问姓名"></el-input>
      </el-form-item>
      <el-form-item :model="formData">
        <el-select placeholder="星级"
                   v-model="formData.time">
          <el-option v-for="item in time"
                     :key="item.value"
                     :label="item.text"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="info">重置</el-button>
      </el-form-item>
    </el-form>
    <d2-crud :loading="loading"
             :pagination="pagination"
             :columns="columns"
             :data="dataSource"
             :rowHandle="rowHandle"
             :options="options">
    </d2-crud>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import D2Crud from "@d2-projects/d2-crud";

@Component({
  components: {
    "d2-crud": D2Crud
  }
})
export default class testDriveEvaluate extends Vue {
  @Prop({ default: "testDriveEvaluate -> defaultName" }) name: string;
  time: Object[] = [
    { text: "最近一周", value: "0" },
    { text: "最近一个月", value: "1" },
    { text: "最近三个月", value: "2" }
  ];
  formData: Object = {
    time: "",
    clientName: "",
    carSeries: "",
    carModel: "",
    consultant: ""
  };
  loading: boolean = false;
  dataSource: Object[] = [
    {
      clientName: "123",
      carModel: "宝马1",
      status: 0,
      score: 4.5,
      comments: "要不起",
      creatTime: "2018-01-12 12:23:09"
    },
    {
      clientName: "456",
      carModel: "奥迪1",
      status: 1,
      score: 4.6,
      comments: "要不起",
      creatTime: "2018-01-12 12:23:09"
    },
    { clientName: "789", carModel: "保时捷", status: 2, score: 4.7, comments: "过！", creatTime: "2018-01-12 12:23:09" }
  ];
  pagination: Object = {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [5, 10, 20, 30, 50],
    layout: "total, slot, sizes, prev, pager, next, jumper, ->",
    total: 0
  };
  options: Object = {
    stripe: true
  };
  columns: Object[] = [
    {
      title: "客户姓名",
      key: "clientName"
    },
    {
      title: "试驾车型",
      key: "carModel"
    },
    {
      title: "评分",
      key: "score"
    },
    {
      title: "评论内容",
      key: "comments"
    },
    {
      title: "评论时间",
      key: "creatTime"
    },
    {
      title: "审核状态",
      key: "status",
      formatter: (row: any) => {
        return row.status === 0 ? "待审核" : row.status === 1 ? "通过" : "不通过";
      }
    }
  ];
  rowHandle: Object = {
    fixed: "right",
    align: "left",
    width: 150,
    custom: [
      {
        text: "通过",
        type: "text",
        size: "small",
        emit: "carDetail-emit",
        show: (row: any) => {
          return row === 0 ? true : false;
        }
      },
      {
        text: "不通过",
        type: "text",
        size: "small",
        emit: "carDetail-emit",
        show: (row: any) => {
          return row === 0 ? true : false;
        }
      },
      {
        text: "删除",
        type: "text",
        size: "small",
        emit: "carDetail-emit",
        show: (row: any) => {
          return row === 2 ? true : false;
        }
      }
    ]
  };
  onSubmit() {
    // 查询
    console.log(1);
  }
  onReset() {
    // 重置
    console.log(1);
  }
  created() {
    this.loading = false;
  }
}
</script>
<style lang="scss" scoped>
</style>

