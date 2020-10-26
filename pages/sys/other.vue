<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'设置',to:''},{label:'其他设置',to:'/sys/other'}]" />

    <el-card class="content">
      <el-form @submit.native.prevent
               ref="ruleFormRef"
               :model="form"
               :rules="formRule"
               size="small"
               label-width="260px">
        <el-form-item prop="scale"
                      label="资讯文章浏览量显示倍率：">
          <el-input-number v-model="form.multipleArticleViews"
                           :step="1"
                           :min="0"
                           :disabled="editorStatus"
                           :max="50" />
          <span class="end_tag">倍</span>
          <span class="tips">(根据实际浏览量*倍率在用户商城端显示)</span>
        </el-form-item>
        <el-form-item prop="activityInitWinnersEnd"
                      label="抽奖活动累计中奖人数：">
          <el-input v-model.number="form.activityInitWinners"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <i class="labels">~</i>
          <el-input v-model.number="form.activityInitWinnersEnd"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <span class="end_tag">人次已中奖</span>
          <span class="tips">(范围内随机生成初始值在用户商城端显示)</span>
        </el-form-item>
        <el-form-item prop="groupPurchaseNumberEnd"
                      label="限时团购初始报名人数：">
          <el-input v-model.number="form.groupPurchaseNumber"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <i class="labels">~</i>
          <el-input v-model.number="form.groupPurchaseNumberEnd"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <span class="end_tag">人已报名</span>
          <span class="tips">(范围内随机生成初始值在用户商城端显示)</span>
        </el-form-item>
        <el-form-item prop="offlineEventsNumberEnd"
                      label="线下活动初始报名人数：">
          <el-input v-model.number="form.offlineEventsNumber"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <i class="labels">~</i>
          <el-input v-model.number="form.offlineEventsNumberEnd"
                    placeholder="请输入内容"
                    maxlength="5"
                    :disabled="editorStatus"
                    style="width:100px;"></el-input>
          <span class="end_tag">人已报名</span>
          <span class="tips">(范围内随机生成初始值在用户商城端显示)</span>
        </el-form-item>
        <el-form-item>
          <el-button class="btn_box"
                     type="primary"
                     v-if="!editorStatus"
                     @click="submitForm">保存</el-button>
          <el-button class="btn_box"
                     type="primary"
                     v-if="accessIsOpened('PERM:OTHER_OPTIONS:EDIT') && editorStatus"
                     @click="editorStatus = false">编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang='ts'>
import { mapState } from "vuex";
import { Component, Vue, Ref } from "vue-property-decorator";
import api from "@/api/restful";

interface Item {
  activityInitWinners: number;
  activityInitWinnersEnd: number;
  groupPurchaseNumber: number;
  groupPurchaseNumberEnd: number;
  multipleArticleViews: number;
  offlineEventsNumber: number;
  offlineEventsNumberEnd: number;
}
interface Rules {
  activityInitWinnersEnd: element.FormRule[];
  groupPurchaseNumberEnd: element.FormRule[];
  offlineEventsNumberEnd: element.FormRule[];
}

@Component
export default class Other extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  readonly formRule: Rules = {
    activityInitWinnersEnd: [{ validator: this.contrastSize, required: false, trigger: "blur" }],
    groupPurchaseNumberEnd: [{ validator: this.contrastSize, required: false, trigger: "blur" }],
    offlineEventsNumberEnd: [{ validator: this.contrastSize, required: false, trigger: "blur" }]
  };
  contrastSize(firstNum: any, secondNum: any, callback: Function) {
    let startNmu = this.form[firstNum.field.substr(0, firstNum.field.length - 3)];
    if (startNmu === "" || startNmu === null) {
      callback(new Error("请输入开始值"));
    } else if (secondNum === "" || secondNum === null) {
      callback(new Error("请输入结束值"));
    } else if (startNmu > secondNum) {
      callback(new Error("开始值不能大于结束值"));
    } else {
      callback();
    }
  }
  private form: any = {
    activityInitWinners: 0,
    activityInitWinnersEnd: 0,
    groupPurchaseNumber: 0,
    groupPurchaseNumberEnd: 0,
    multipleArticleViews: 0,
    offlineEventsNumber: 0,
    offlineEventsNumberEnd: 0
  };
  editorStatus: boolean = true;
  async getData() {
    let data = await api.get({ url: "SAVE_SYS_OTHER_SETTING", isAdminApi: true });
    if (data.data) {
      this.form = data.data;
    }
  }
  submitForm() {
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        this.submit();
      }
    });
  }
  async submit() {
    let {
      activityInitWinners,
      activityInitWinnersEnd,
      groupPurchaseNumber,
      groupPurchaseNumberEnd,
      multipleArticleViews,
      offlineEventsNumber,
      offlineEventsNumberEnd
    } = this.form;
    let param = {
      activityInitWinners,
      activityInitWinnersEnd,
      groupPurchaseNumber,
      groupPurchaseNumberEnd,
      multipleArticleViews,
      offlineEventsNumber,
      offlineEventsNumberEnd
    };

    let data = await api.post({ url: "SAVE_SYS_OTHER_SETTING", isAdminApi: true, ...param });
    if (data) {
      this.editorStatus = true;
      this.$message({
        type: "success",
        message: "保存成功"
      });
    }
  }
  created() {
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
.content {
  min-height: 400px;
  background-color: #fff;
}
.btn_box {
  margin-top: 50px;
  padding-left: 30px;
  padding-right: 30px;
}
.labels {
  padding: 0 15px;
}
.end_tag {
  margin-left: 15px;
}
.tips {
  margin-left: 15px;
  color: #ccc;
}
</style>
