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

            <div class="space"></div>
            <el-form-item label="主机厂发布范围：" prop="toUserIds">
              <el-button size="mini" @click="showDialog(0)">选择用户</el-button>
              <span class="mgl-sm">已选：{{ form.toUserIds.length }}</span>
            </el-form-item>
            <el-form-item label="指定经销商：" prop="toDealerCodes">
              <el-button size="mini" @click="showDialog(1)">选择经销商</el-button>
              <span class="mgl-sm">已选：{{ form.toDealerCodes.length }}</span>
            </el-form-item>
            <el-form-item label="指定集团：" prop="toBlocIds">
              <el-button size="mini" @click="showDialog(2)">选择集团</el-button>
              <span class="mgl-sm">已选：{{ form.toBlocIds.length }}</span>
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
      :showDialog="dialogVisible[0]"
      :info="curItem"
      @selected="usersChange"
      @close="dialogVisible[0] = false"
    >
    </dialog-users>

    <!-- 经销商弹窗 -->
    <dialog-agent
      :showDialog="dialogVisible[1]"
      :info="curItem"
      @selected="agentChange"
      @close="dialogVisible[1] = false"
    >
    </dialog-agent>
    <!-- 集团弹窗 -->
    <dialog-company
      :showDialog="dialogVisible[2]"
      :info="curItem"
      @selected="companyChange"
      @close="dialogVisible[2] = false"
    >
    </dialog-company>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import reviewArticles from "./reviewArticles.vue";
import dialogAgent from "./dialogSelectAgent.vue";
import dialogUsers from "./dialogSelectUsers.vue";
import dialogCompany from "./dialogSelectCompany.vue";
import api from "@/api/restful";
import { Config, Item, ArticleItem, expendItem } from "../../const/config";

interface Form {
  materialArticleId: number | null;
  publisher: string;
  articleColumnId: number | null;
  toInternalAll: number;
  toInternal: number;
  toUserIds: number[];
  toBlocIds: number[];
  toDealerCodes: string[];
}

@Component({
  components: {
    reviewArticles,
    dialogAgent,
    dialogUsers,
    dialogCompany
  }
})
export default class CouponDetail extends Vue {
  private form: Form = {
    materialArticleId: null,
    publisher: "",
    articleColumnId: null,
    toInternalAll: 0,
    toInternal: 1,
    toUserIds: [],
    toBlocIds: [],
    toDealerCodes: []
  };
  private role: string = "";
  private editMode: boolean = false;
  private curItem: object = {};
  private rule: object = {
    materialArticleId: [{ required: true, message: "请选择文章" }]
    // toUserIds: [{ required: true, message: "请选择内部资讯发布范围" }],
    // toBlocIds: [{ required: true, message: "请选择集团" }],
    // toDealerCodes: [{ required: true, message: "请选择经销商" }]
  };
  private columns: any[] = [];
  private dialogVisible: any = {
    0: false,
    1: false,
    2: false
  };
  showDialog(i: number) {
    if (i === 0) {
      this.curItem = {
        role: this.role,
        selectList: this.form.toUserIds
      };
    } else if (i === 1) {
      this.curItem = {
        role: this.role,
        selectList: this.form.toDealerCodes
      };
    } else if (i === 2) {
      this.curItem = {
        role: this.role,
        selectList: this.form.toBlocIds
      };
    }
    this.dialogVisible[i] = true;
  }
  articleChange(id: number) {
    this.form.materialArticleId = id;
  }
  agentChange(codes: string[]) {
    this.form.toDealerCodes = codes;
  }
  companyChange(ids: number[]) {
    this.form.toBlocIds = ids;
  }
  usersChange(val: number[]) {
    this.form.toUserIds = val;
  }
  submit(form: string) {
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
    if (!this.form.materialArticleId) {
      return this.$message({ type: "error", message: "请选择文章" });
    }
    if (this.form.toUserIds.length === 0 && this.form.toBlocIds.length === 0 && this.form.toDealerCodes.length === 0) {
      return this.$message({ type: "error", message: "至少选择一个发布范围" });
    }
    try {
      let form: any = Object.assign({}, this.form);
      form.toDealerCodes = form.toDealerCodes.join(",");
      form.toBlocIds = form.toBlocIds.join(",");
      form.toUserIds = form.toUserIds.join(",");
      form.toShop = form.toShop ? 1 : 0;
      form.toInternal = form.toInternal ? 1 : 0;
      if (form.toUserIds) {
        form.toInternal = 1;
        form.toInternalAll = 0;
      } else {
        form.toInternal = 0;
        delete form.toInternalAll;
      }

      let res = await api.post({ url: "FACTORY_PUBLISH_ARTICLE", isAdminApi: true, ...form });
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
