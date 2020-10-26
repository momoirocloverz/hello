<template>
  <div>
    <ul class="userInfo">
      <li>
        <img :src="info.avatar"
             alt="">
        <div class="info">
          <p>
            <b>{{info.name || '—'}}</b>
            <span>{{setSex(info.sex)}}</span>
          </p>
          <div>
            <span>手机号：<label>{{info.phone || '—'}}</label></span>
            <span>意向车型：<label>{{`${info.intentionCarSeries || '—'}—${info.intentionCarModel|| '—'}`}}</label></span>
            <span>注册时间：<label>{{info.registerTime | filterDateTime }}</label></span>
            <span v-if="info.adviserName">最近互动：<label>{{info.contactTime | filterDateTime}}（{{info.adviserName}}）</label></span>
          </div>
        </div>
      </li>
      <li>
        <div v-if="info.adviserName">
          <div class="card">
            <div>
              <b>专属顾问</b>
              <p>
                <b class="text-over">{{info.adviserName}}</b>
                <b>{{info.adviserPhone}}</b>
              </p>
            </div>
            <div id="adviserQR"
                 class="qr-code"></div>
          </div>
          <el-button size="small"
                     v-if="role === '2'"
                     @click="goAdviser">查看顾问详情</el-button>
          <el-button size="small"
                     v-if="role === '2' && this.accessIsOpened('PERM:POSSIBLE_CUSTOMERS:EDIT')"
                     @click="editAdviser">变更顾问</el-button>
        </div>

      </li>
    </ul>
    <select-adviser :memberUserId="id"
                    :visible.sync="adviserDialog"
                    @save="goSearch"
                    :adviserUserId="info.adviserId"></select-adviser>
  </div>

</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
/* eslint-disable-next-line */
import { UserInfo } from "@/@types/custom.ts";
import { roleInfoSetting } from "@/utils/userSetting";
import { member_edit_adviser } from "@/api";
import SelectAdviser from "../component/selectAdviser.vue";
import QRCode from "qrcodejs2";

@Component({
  components: { SelectAdviser }
})
export default class App extends Vue {
  @Prop({
    default: () => {
      return {};
    },
    type: Object
  })
  readonly info: any;
  @Prop({ default: 0, type: Number }) readonly id: number;
  private role = roleInfoSetting.getRole();
  private adviserDialog: boolean = false;
  private qrcode: any;
  private setSex(val: number) {
    return val === 0 ? "女" : val === 1 ? "男" : "未知";
  }
  private goAdviser(row: any) {
    this.$router.push({
      name: "adviser-detail",
      params: {
        id: this.info.adviserId
      }
    });
  }
  @Watch("info")
  userChange() {
    this.qrCode("adviserQR", this.info.adviserQR);
  }

  private qrCode(id: string, url: string) {
    if (!url || this.qrcode) {
      return;
    }
    this.$nextTick(() => {
      this.qrcode = new QRCode(id, {
        width: 90,
        height: 90,
        colorDark: "#000000",
        colorLight: "#ffffff"
      });
      this.qrcode.clear();
      this.qrcode.makeCode(url);
    });
  }

  private async editAdviser() {
    this.adviserDialog = true;
  }
  private goSearch() {
    this.$emit("goSearch");
  }
  created() {
    this.qrCode("adviserQR", this.info.adviserQR);
  }
}
</script>
<style lang='scss' scoped>
.userInfo {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 15px;
  font-size: 12px;
  b {
    font-size: 16px;
    margin-right: 5px;
  }
  li:first-child {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    img {
      width: 180px;
      height: 180px;
      margin-right: 15px;
    }
    .info {
      max-width: 800px;
      width: 500px;
      p {
        margin: 20px 0 10px;
      }
      span {
        display: inline-block;
        width: 230px;
        margin-bottom: 10px;
        color: #999;
        label {
          color: #464444;
        }
      }
    }
  }
  li:last-child {
    text-align: center;
    .card {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 240px;
      height: 130px;
      background: rgba($color: #ff9900, $alpha: 0.85);
      border-radius: 6px;
      margin-bottom: 10px;
      color: #fff;
      padding: 20px 15px;
      div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
        text-align: left;
        b {
          font-size: 15px;
        }
        p {
          display: flex;
          flex-direction: column;

          b:first-child {
            font-size: 23px;
          }
        }
      }
      #adviserQR {
        width: 90px;
      }
    }
  }
  .text-over {
    max-width: 109px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>