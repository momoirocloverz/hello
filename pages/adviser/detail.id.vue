<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'顾问管理',to:'/adviser/manage'},{label:'顾问详情',to:''}]" />
    <el-card v-loading="detailLoading">
      <div class="account_box">
        <div class="head-img">
          <i class="el-icon-edit"
             @click="upLoadImg"
             v-if="accessIsOpened('PERM:ADVISER:EDIT')"></i>
          <img :src="adviserInfo.avatar"
               class="avatar">
          <upload-to-ali class="up-img"
                         @input="getUrl"
                         v-model="adviserHead"
                         :size="1024 * 10"
                         ref="upLoad"></upload-to-ali>
        </div>
        <div class="account_text_box">
          <div class="account_text">
            <b>{{adviserInfo.name}}</b>
            <span class="stars">
              <i class="el-icon-star-on"></i>
              {{typeof adviserInfo.star === "number" ? adviserInfo.star+'星顾问' : ''}}
            </span>
            <i class="el-icon-female"
               v-if="adviserInfo.sex==0"></i>
            <i class="el-icon-male"
               v-if="adviserInfo.sex==1"></i>
          </div>
          <div class="account_text">
            <el-tag size="mini"
                    v-for="(tag,i) in adviserInfo.labelList"
                    :key="i">{{tag}}</el-tag>
          </div>
          <div class="account_text">
            <span class="lables">
              手机号：
              <em>{{adviserInfo.phone}}</em>
            </span>
          </div>
          <div>
            <!-- <el-button size="small">编辑</el-button> -->
            <el-button size="small"
                       v-if="accessIsOpened('PERM:ADVISER:EDIT') && adviserInfo.enabled === 'FREEZE'"
                       @click="changeStatus(true)">启用</el-button>
            <el-button size="small"
                       v-if="accessIsOpened('PERM:ADVISER:EDIT') && adviserInfo.enabled === 'ENABLE'"
                       @click="changeStatus(false)">冻结</el-button>
            <el-button size="small"
                       v-if="accessIsOpened('PERM:ADVISER:EDIT') && adviserInfo.enabled === 'ENABLE'"
                       @click="openMemberDialog">转移潜客</el-button>
          </div>
        </div>

        <div class="rank_info">
          <b>{{adviserInfo.rank || '12'}}</b>
          <div>顾问排名</div>
        </div>
      </div>
    </el-card>

    <el-card class="pt0">
      <el-tabs v-model="currentTab">
        <el-tab-pane v-for="(tab, i) in componentList"
                     :key="i"
                     :label="tab.label"
                     :name="''+i"></el-tab-pane>
      </el-tabs>

      <potentialGuest ref="potentialGuestRef"
                      v-show="currentTab==='potentialGuest'" />
      <keep-alive v-show="currentTab!=='potentialGuest'">
        <component :is="currentComponent" />
      </keep-alive>
    </el-card>

    <move-member ref="dialog"
                 @successful="moveSuccess" />
  </div>
</template>

<script lang='ts'>
import { Component, Ref, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";
import MoveMember from "./components/move-member.vue";
import potentialGuest from "./components/potential-guest.vue";
import commentOnAdvise from "./components/comment-on-adviser.vue";
import goodsShare from "./components/goods-share.vue";
import activityShare from "./components/activity-share.vue";
import articleShare from "./components/article-share.vue";
import { getAdviserDetail, consultantSet, consultantMod } from "@/api";

@Component({
  components: {
    MoveMember,
    potentialGuest,
    commentOnAdvise,
    goodsShare,
    activityShare,
    articleShare,
    UploadToAli
  }
})
export default class AdviserDetail extends Vue {
  @Ref() readonly dialog: any;
  @Ref() readonly potentialGuestRef: any;
  @Ref() readonly upLoad: any;
  readonly componentList: element.Tabs[] = [
    { label: "潜客", name: "potentialGuest" },
    { label: "顾问评价", name: "commentOnAdvise" },
    { label: "商品分享", name: "goodsShare" },
    { label: "活动分享", name: "activityShare" },
    { label: "文章分享", name: "articleShare" }
  ];
  adviserHead: string = "";
  currentTab: string = "0";
  detailLoading: boolean = false;
  adviserInfo: any = {};
  get currentComponent() {
    return this.componentList[+this.currentTab].name;
  }
  get adviseId() {
    return this.$route.params.id || "";
  }
  async getAdviserDetail() {
    try {
      this.detailLoading = true;
      const id: any = this.adviseId;
      const { data } = await getAdviserDetail(id);
      this.adviserInfo = data || {};
      this.detailLoading = false;
    } catch (e) {
      this.detailLoading = false;
      this.log(e);
    }
  }
  async consultantSet(id: number, enabled: boolean) {
    try {
      await consultantSet(id, enabled);
      this.showMsg("操作成功");
      this.getAdviserDetail();
    } catch (e) {
      this.log(e);
    }
  }
  async consultantMod(avatar: string) {
    // 修改顾问头像
    let param = {
      avatar,
      id: this.adviserInfo.adviserUserId
    };
    let { msg } = await consultantMod(param);
    if (msg === "SUCCESS") {
      this.adviserInfo.avatar = avatar;
    }
    this.adviserHead = "";
  }
  getUrl(e: any) {
    if (e) {
      this.consultantMod(e);
    }
  }
  upLoadImg() {
    this.upLoad.selectFiles();
  }
  changeStatus(option: boolean) {
    let msg1 = "冻结顾问";
    let msg2 = "确定要冻结该顾问？冻结后该顾问将无法登录顾问端";
    if (option) {
      msg1 = "启用顾问";
      msg2 = "确定要启用该顾问？";
    }
    this.$confirm(msg2, msg1).then(() => {
      this.consultantSet(this.adviserInfo.adviserUserId, option);
    });
  }
  moveSuccess() {
    this.$router.go(0);
  }
  openMemberDialog(row: any) {
    // const { adviserUserId } = this.adviserInfo;
    this.dialog.open(this.adviserInfo);
  }
  created() {
    this.getAdviserDetail();
  }
}
</script>
<style lang="scss" scoped>
.account_box {
  display: flex;
  align-items: center;
}
.head-img {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    width: 95%;
    position: absolute;
    z-index: 2;
  }
  .up-img {
    position: absolute;
    z-index: 1;
    opacity: 0;
  }
  .el-icon-edit {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 5;
    font-size: 25px;
    color: #6399f1;
    cursor: pointer;
  }
}
.account_text_box {
  padding: 0 10px 10px;
  width: 300px;
  b {
    font-size: 19px;
    margin-right: 20px;
  }
}
.account_text {
  display: flex;
  align-items: center;
  padding: 10px;
}
.stars {
  font-size: 12px;
  padding: 1px 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-right: 15px;
  i {
    color: #d88c0e;
  }
}
.el-icon-female {
  color: #da378d;
}
.el-icon-male {
  color: #105fe2;
}
.rank_info {
  width: 140px;
  height: 90px;
  background-color: rgba($color: #ff9900, $alpha: 0.85);
  border-radius: 6px;
  padding: 20px 15px;
  color: #fff;
  margin-left: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  b {
    font-size: 22px;
  }
}
.lables {
  color: #777;
  font-size: 14px;
  & + & {
    margin-left: 20px;
  }
  em {
    font-style: normal;
    color: #333;
  }
}
.el-card + .el-card {
  margin-top: 20px;
}
.pt0 {
  /deep/ {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
