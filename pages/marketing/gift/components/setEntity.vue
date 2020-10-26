<template>
  <div class="main-container">
    <breadcrumb-group :breadGroup="[{label:'实物奖品',to:'/marketing/gift/entity/index'},{label:pageId?'编辑实物奖品':'新建实物奖品',to:''}]" />

    <el-card class="main-panel">
      <el-form @submit.native.prevent
               ref="form"
               :model="form"
               :rules="rule"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="奖品图片"
                          prop="name">
              <upload-to-ali :multiple="false"
                             :size="3096"
                             :preview="true"
                             :value="form.posterUrl"
                             accept="image/png,image/jpeg,image/bmp"
                             :max="1"
                             @delete="delImage"
                             @loaded="uploadSuccess"></upload-to-ali>
            </el-form-item>
            <el-form-item label="实物奖品名称"
                          prop="name">
              <el-input type="input"
                        maxlength="8"
                        size="small"
                        v-model="form.name"
                        style="width:80%;margin-right:10px;"
                        placeholder="请输入实物奖品名称"></el-input>
              <span>{{form.name.length}}/8</span>
            </el-form-item>
            <el-form-item label="库存"
                          prop="stock">
              <el-input type="input"
                        maxlength="7"
                        size="small"
                        v-model.number="form.stock"
                        @keyup.native="number"
                        style="width:80%;margin-right:10px;"
                        placeholder="请输入实物奖品库存数"></el-input>
            </el-form-item>
            <el-form-item label="领取方式"
                          prop="receiveMeans">
              <el-radio-group v-model="form.receiveMeans">
                <el-radio label="ON_SITE"
                          v-if="sysPlat !== 'factory'">到店</el-radio>
                <el-radio label="EXPRESS"
                          v-if="sysPlat === 'factory'">邮寄</el-radio>
                <el-radio label="ON_SITE"
                          v-if="sysPlat === 'factory'">现场领取</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="使用说明"
                          prop="description">
              <div class="form-textarea">
                <el-input type="textarea"
                          :rows="5"
                          size="small"
                          v-model="form.description"
                          maxlength="1000"
                          placeholder="请输入实物奖品使用说明"></el-input>
                <span class="form-textarea_count">{{form.description.length}}/1000</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="coupon-review">
        <div class="coupon-header">
          <div class="coupon-title">
            <div class="coupon-title_t">{{form.name || '实物奖品名称'}}</div>
            <div class="coupon-title_tag">实物奖品</div>
          </div>
        </div>
        <span class="coupon-expires">{{form.remark || '有效期:2019-05-22~2019-07-22'}}</span>
        <div class="coupon-bottom">
          <span>S30040XWE98</span>
          <div class="fr">
            <a href="javascript:">使用说明</a>
          </div>
        </div>
      </div> -->
      <div class="btn-group">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary"
                   @click="submit('form')">提交</el-button>
      </div>
    </el-card>
  </div>
</template>


<script lang="ts">
import dayjs from "dayjs";
import api from "@/api/restful";
import { Component, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";

enum GET_METHODS {
  ON_SITE = "ON_SITE",
  EXPRESS = "EXPRESS"
}

interface Form {
  name: string;
  stock: number | null;
  posterUrl: string;
  receiveMeans: GET_METHODS;
  description: string;
  url?: string;
}

@Component({
  components: {
    UploadToAli
  }
})
export default class CouponDetail extends Vue {
  private pageId: number | null = null;
  private sysPlat: any = "";
  private form: Form = {
    name: "",
    stock: null,
    description: "",
    posterUrl: "",
    receiveMeans: GET_METHODS["ON_SITE"],
    url: "PRIZE"
  };
  get rule() {
    let rule: any = {
      name: [{ required: true, message: "请输入实物奖品名称" }],
      stock: [{ required: true, message: "请输入库存" }],
      description: [{ required: true, message: "请输入使用说明" }],
      posterUrl: [{ required: true, message: "请选择实物奖品类型" }]
    };
    return rule;
  }
  uploadSuccess(data: string) {
    this.form.posterUrl = data;
  }
  delImage() {
    this.form.posterUrl = "";
  }
  number(e: any) {
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    e.target.value = e.target.value.replace(".", "");
  }
  getDetail(id: number) {
    api.get({ url: "PRIZE_BASEINFO", isAdminApi: true, id: id }).then((data: any) => {
      if (data.code === "000000") {
        data.data.stock = data.data.stockTotal;
        this.form = Object.assign(this.form, data.data);
      }
    });
  }
  submit(form: string) {
    (<any>this.$refs[form]).validate((valid: boolean, params: any) => {
      if (valid) {
        let param: Form = Object.assign({}, this.form);
        this.request(param);
      } else {
        // let message = params[Object.keys(params)[0]][0].message;
        // this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  request(param: Form) {
    let request = api.post;
    if (this.pageId) {
      request = api.put;
    }
    request({ ...param, isAdminApi: true }).then((data: any) => {
      if (data.code === "000000") {
        this.$message({ type: "success", message: this.pageId ? "修改成功" : "创建成功" });
        this.$router.push("/marketing/gift/entity/index");
      }
    });
  }
  created() {
    if (this.$route.params.id) {
      this.pageId = parseInt(this.$route.params.id);
      this.getDetail(this.pageId);
    }
    const { sysPlat } = this.$route.query;
    this.sysPlat = sysPlat;
    if (sysPlat === "factory") {
      this.form.receiveMeans = GET_METHODS["EXPRESS"];
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-list {
  display: block;
  margin-bottom: 10px;
  .el-input {
    width: 40%;
    margin-right: 8px;
  }
}

.coupon-review {
  position: absolute;
  right: 20px;
  top: 30px;
  width: 40%;
  max-width: 400px;
  background: #f0f7fd;
  font-size: 12px;
  border: 1px solid #fff;
  box-sizing: border-box;

  .coupon-header {
    height: 60px;
    padding: 10px;
    margin-bottom: 15px;
  }

  .coupon-expires {
    margin-left: 10px;
    margin-bottom: 10px;
    display: inline-block;
  }

  .coupon-title {
    .coupon-title_t {
      font-size: 18px;
    }
    .coupon-title_tag {
      border: 1px solid #666;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      padding: 0 5px;
    }
  }

  .coupon-price-box {
    position: absolute;
    right: 10px;
    top: 10px;
    text-align: right;

    .coupon-price {
      font-size: 35px;
      font-weight: 500;
      color: red;
      line-height: 1.2em;
    }
    .coupon-rule {
      color: #666;
    }
  }

  .coupon-bottom {
    border-top: 1px solid #fff;
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;

    .fr {
      float: right;
    }

    a {
      color: #666;
    }

    .btn-coupon {
      padding: 0 10px;
      height: 36px;
      background: gray;
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>