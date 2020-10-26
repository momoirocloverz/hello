<template>
  <router-view :is="curComponent" @submit="submit"></router-view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import setFactoryArticle from "./components/setFactoryArticle.vue";
import setCompanyArticle from "./components/setCompanyArticle.vue";
import setAgentArticle from "./components/setAgentArticle.vue";

@Component({
  components: {
    setFactoryArticle,
    setCompanyArticle,
    setAgentArticle
  }
})
export default class createArticle extends Vue {
  private role: string = "";
  private curComponent: string = "";
  private isSubmit: boolean = false;
  created() {
    this.role = (<any>this.$route.query).sysPlat;
    switch (this.role) {
      case "factory":
        this.curComponent = "setFactoryArticle";
        break;
      case "company":
        this.curComponent = "setCompanyArticle";
        break;
      case "agent":
        this.curComponent = "setAgentArticle";
        break;
      default:
        this.curComponent = "";
        break;
    }
  }
  submit(data: boolean) {
    if (data) {
      this.isSubmit = true;
    }
  }
  // private beforeRouteLeaveCount: number = 0;
  // async beforeRouteLeave(to: any, from: any, next: any) {
  //   // bug:beforeRouteLeave会走两次
  //   if (this.beforeRouteLeaveCount === 0 && !this.isSubmit && to.path !== "/marketing/tweets/source/create") {
  //     this.beforeRouteLeaveCount++;
  //     const h = this.$createElement;
  //     const message: any = h("p", {}, [h("p", { style: "color: #333" }, "编辑信息未保存，确定要离开吗？ ")]);
  //     try {
  //       let res = await this.$confirm(message, "提示");
  //       if (res) {
  //         next();
  //       }
  //     } catch (err) {
  //       this.beforeRouteLeaveCount = 0;
  //       next(false);
  //     }
  //   } else {
  //     next();
  //   }
  // }
}
</script>
