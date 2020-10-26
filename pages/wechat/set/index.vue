<template>
  <div class="chat-set">
    <breadcrumb-group :breadGroup="[{ label: '公众号', to: '' }, { label: '公众号设置', to: '/wechat/set/index' }]" />
    <el-card class="card-item mb-15">
      <div class="icon el-icon-chat-dot-round"></div>
      <div class="item-info">
        <div>为保证所有功能的正常使用，</div>
        <div>授权时请把所有权限统一授权，</div>
      </div>
      <el-button type="primary"
                 size="small"
                 @click="goBind">已有公众号，立即绑定</el-button>
    </el-card>
    <el-card class="card-item">
      <div class="icon el-icon-edit-outline"></div>
      <div>
        <p>为保证所有功能的正常使用，</p>
        <p>授权时请把所有权限统一授权，</p>
      </div>
      <el-button type="primary"
                 size="small"
                 @click="toPath">没有公众号，立即申请</el-button>
    </el-card>
    <dialog-auth :showDialog="dialogVisible"
                 :url="url"
                 @close="dialogVisible = false"> </dialog-auth>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/api/restful";
import { storeInfoSetting } from "@/utils/userSetting";
import dialogAuth from "./components/dialogAuth.vue";

interface DialogInter {
  title: string;
  show: boolean;
}
@Component({
  name: "chatSet",
  components: {
    dialogAuth
  }
})
export default class extends Vue {
  private url: string = "";
  private type: number = 0;
  private dialogVisible: boolean = false;
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  private toPath() {
    window.open("https://mp.weixin.qq.com");
  }
  // 获取授权url
  private async goBind() {
    try {
      let req = await api.get({ url: "GET_WX_AUTH_URL" });
      let url = req.data;
      this.url = url.replace(
        "REDIRECT_URI",
        window.location.origin + "/wechat/set/index?sysPlat=" + this.$route.query.sysPlat
      );
      this.dialogVisible = true;
    } catch (err) {
      console.log(err);
    }
  }
  // 保存authCode
  private async saveAuthCode(code: string | (string | null)[]) {
    try {
      let req = await api.get({
        url: "SAVE_AUTH_CODE",
        auth_code: code,
        organId: this.organId
      });

      if (req) {
        this.$router.push({
          path: "/wechat/set/bindWechat"
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  private async created() {
    const code: string | (string | null)[] = this.$route.query.auth_code;
    // 如果存在authCode说明是授权回调返回
    if (code) {
      return this.saveAuthCode(code);
    }
    // let info = await api.get({ url: "GET_AUTH_INFO", organId: this.organId });
    // if (info.data) {
    //   // type=1重新授权
    //   if (!type) {
    //     this.$message({
    //       type: "success",
    //       message: "已授权公众号，正在为您跳转"
    //     });
    //     this.$router.push({
    //       path: "/wechat/set/bindWechat"
    //     });
    //   }
    // }
  }
  async beforeRouteEnter(to: any, from: any, next: any) {
    // safari和IE不支持referrerpolicy属性，需要修改meta头
    let viewport: any = document.querySelector("meta[name=referrer]");
    if (viewport) {
      viewport.setAttribute("content", "always");
    }

    const code: string | (string | null)[] = to.query.auth_code;
    const type: string | (string | null)[] = to.query.type;
    if (!code) {
      let info = await api.get({ url: "GET_AUTH_INFO", organId: storeInfoSetting.getInfo().organId });

      next((vm: Vue) => {
        if (info.data) {
          localStorage.setItem("wx_auth_info", JSON.stringify(info));
          // type=1重新授权
          if (!type) {
            vm.$router.push({
              path: "/wechat/set/bindWechat"
            });
          }
        }
      });
    } else {
      next();
    }
  }
}
</script>

<style scoped lang="scss">
.chat-set {
  .card-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 40vh;
    .item-info {
      margin: 30px 20px;
      color: #999;
    }
    .icon {
      color: $primary-color;
      font-size: 76px;
    }
  }
}
.el-button--primary {
  a {
    display: block;
    color: #fff;
    text-decoration: none;
  }
}
</style>
