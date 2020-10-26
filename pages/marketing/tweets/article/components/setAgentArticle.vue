<template>
  <div class="main-container">
    <breadcrumb-group
      :breadGroup="[{ label: '文章列表', to: '' }, { label: '发布文章', to: '/marketing/tweets/article/create' }]"
    />

    <el-card class="main-panel">
      <el-form @submit.native.prevent ref="form" :model="form" :rules="rule" label-width="150px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="发布文章：" prop="materialArticleId">
              <review-articles :id="form.materialArticleId" @articleChange="articleChange"></review-articles>
            </el-form-item>
            <div class="space"></div>
            <el-form-item label="发布人：" prop="publisher">
              <el-input
                type="input"
                maxlength="10"
                size="small"
                v-model="form.publisher"
                style="width:20%;margin-right:10px;"
                placeholder="不输入发布人默认为自己"
              ></el-input>
              <span>{{ form.publisher.length }}/10</span>
            </el-form-item>
            <el-form-item label="栏目：" prop="articleColumnId">
              <el-select placeholder="请选择" size="small" v-model="form.articleColumnId">
                <el-option v-for="item in columns" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布渠道：" prop="pubChannel">
              <el-checkbox :label="0" v-model="form.toShop">商城资讯</el-checkbox>
              <!-- <el-checkbox :label="1">微信公众号（您今天还能群发1次消息）</el-checkbox> -->
              <el-checkbox :label="2" v-model="form.toInternal">内部资讯</el-checkbox>
            </el-form-item>
            <!-- <el-form-item label="公众号发布范围："
                          prop="range">
              <el-select placeholder="请选择"
                         size="small"
                         v-model="form.cat">
                <el-option label="全部用户"
                           :value="0">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="内部资讯发布范围：" prop="toUserIds" v-if="form.toInternal">
              <el-button size="mini" @click="showDialog(1)">选择用户</el-button>
              <span class="mgl-sm">已选：{{ form.toUserIds.length }}</span>
            </el-form-item>
            <div class="space"></div>
            <el-form-item label="关联车辆：" prop="relatedCarSeriesCodes">
              <el-button size="mini" @click="showDialog(2)">选择车系</el-button>
              <span class="mgl-sm">已选：{{ form.relatedCarSeriesCodes.length }}</span>
            </el-form-item>
            <el-form-item label="关联活动：" prop="relatedActivityIds">
              <el-button size="mini" @click="showDialog(3)">选择活动</el-button>
              <span class="mgl-sm">已选：{{ form.relatedActivityIds.length }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn-group">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="submit('form')">发布</el-button>
      </div>
    </el-card>

    <!-- 用户弹窗 -->
    <dialog-users
      :showDialog="dialogVisible[1]"
      :info="curItem"
      @selected="usersChange"
      @close="dialogVisible[1] = false"
    >
    </dialog-users>
    <!-- 车系弹窗 -->
    <dialog-carseries
      :showDialog="dialogVisible[2]"
      :info="curItem"
      @selected="carseriesChange"
      @close="dialogVisible[2] = false"
    >
    </dialog-carseries>
    <!-- 活动弹窗 -->
    <dialog-activity
      :showDialog="dialogVisible[3]"
      :info="curItem"
      @selected="activityChange"
      @close="dialogVisible[3] = false"
    >
    </dialog-activity>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import reviewArticles from "./reviewArticles.vue";
import dialogUsers from "./dialogSelectUsers.vue";
import dialogCarseries from "./dialogSelectCarseries.vue";
import dialogActivity from "./dialogSelectActivity.vue";
import api from "@/api/restful";
import { Config, Item, ArticleItem, expendItem } from "../../const/config";

interface Form {
  materialArticleId: number | null;
  publisher: string;
  articleColumnId: number | null;
  toShop: number;
  toInternal: number;
  relatedCarSeriesCodes: string[];
  relatedActivityIds: number[];
  toInternalAll: number;
  toUserIds: number[];
  toWechat: number; // TODO 对接
  toWechatAll: number; // TODO 对接
  toTagId: number | null; // TODO 对接
}

let vm: Vue;

let validator = (rule: any, value: any, callback: Function) => {
  if (!(<any>vm).form.toShop && !(<any>vm).form.toWechat && !(<any>vm).form.toInternal) {
    callback(new Error("请选择发布渠道"));
  } else {
    callback();
  }
};

@Component({
  components: {
    reviewArticles,
    dialogUsers,
    dialogCarseries,
    dialogActivity
  }
})
export default class CouponDetail extends Vue {
  private form: Form = {
    materialArticleId: null,
    publisher: "",
    articleColumnId: null,
    toShop: 0,
    toInternal: 0,
    relatedCarSeriesCodes: [],
    relatedActivityIds: [],
    toInternalAll: 0,
    toUserIds: [],
    toWechat: 0,
    toWechatAll: 0,
    toTagId: null
  };
  private role: string = "";
  private editMode: boolean = false;
  private curItem: object = {};
  private rule: object = {
    materialArticleId: [{ required: true, message: "请选择文章", trigger: "blur" }],
    toUserIds: [{ required: true, message: "请选择内部资讯发布范围", trigger: "blur" }],
    toTagId: [{ required: true, message: "请选择公众号发布范围", trigger: "blur" }],
    pubChannel: [{ validator: validator, trigger: "blur", required: true }]
  };
  private columns: any[] = [];
  private dialogVisible: any = {
    1: false,
    2: false,
    3: false
  };
  showDialog(i: number) {
    if (i === 1) {
      this.curItem = {
        role: this.role,
        selectList: this.form.toUserIds
      };
    } else if (i === 2) {
      this.curItem = {
        list: this.form.relatedCarSeriesCodes
      };
    } else if (i === 3) {
      this.curItem = {
        list: this.form.relatedActivityIds
      };
    }
    this.dialogVisible[i] = true;
  }
  articleChange(id: number) {
    this.form.materialArticleId = id;
  }
  usersChange(val: number[]) {
    this.form.toUserIds = val;
  }
  carseriesChange(val: string[]) {
    this.form.relatedCarSeriesCodes = val;
  }
  activityChange(val: number[]) {
    this.form.relatedActivityIds = val;
  }
  submit(form: string) {
    if (!this.form.materialArticleId) {
      return this.$message({ type: "error", message: "请选择文章" });
    }
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        this.request();
      } else {
        // let message = params[Object.keys(params)[0]][0].message;
        // this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  async request() {
    try {
      let form: any = Object.assign({}, this.form);
      form.relatedCarSeriesCodes = form.relatedCarSeriesCodes.join(",");
      form.relatedActivityIds = form.relatedActivityIds.join(",");
      form.toUserIds = form.toUserIds.join(",");
      form.toShop = form.toShop ? 1 : 0;
      form.toInternal = form.toInternal ? 1 : 0;

      let res = await api.post({ url: "AGENT_PUBLISH_ARTICLE", isAdminApi: true, ...form });
      this.$emit("submit", true);
      this.$message({
        type: "success",
        message: "发布成功"
      });
      this.$router.go(-1);
    } catch (err) {
      console.log(err);
    }
  }
  async getColumns() {
    try {
      let res = await api.get({ url: "COLUMNS", isAdminApi: true, page: 1, size: 1000 });
      this.columns = res.data;
    } catch (err) {
      console.log(err);
    }
  }
  created() {
    vm = this;
    this.role = (<any>this.$route.query).sysPlat;
    this.getColumns();
  }
}
</script>

<style lang="scss" scoped>
.mgl-sm {
  margin-left: 10px;
}

hr {
  border: 1px solid #d1d1d1;
}
.el-tag {
  margin-right: 10px;
}
.space {
  height: 20px;
  width: 100%;
}
</style>
