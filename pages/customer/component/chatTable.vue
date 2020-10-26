<template>
  <!-- 沟通记录 -->
  <div v-loading="loading">
    <el-collapse accordion
                 v-if="chatTimeList.length > 0 ">
      <el-collapse-item v-for="(t,index) of chatTimeList"
                        :key="index">
        <template slot="title">
          <div @click="checkLineTime(t)"
               class="title">
            <span class="radius"></span>
            <span class="time">{{t.time}}</span>
          </div>
        </template>
        <content v-if="t.select">
          <!-- 客户最近浏览 -->
          <article v-if="browseName">
            <span>客户最近浏览页面：{{browseName}}</span>
          </article>
          <ul class="content-info"
              v-infinite-scroll="scrollLoad"
              :infinite-scroll-disabled="scorllDisable">
            <li v-for="item of chatContentList"
                :key="item.id">
              <!-- 时间和姓名 -->
              <div class="default">
                {{item.msgTimestamp  | filterTmpDateTime}}
                <span class="green"
                      v-if="item.fromChannal === MEMBER">【客户：{{item.fromName}}】</span>
                <span class="yellow"
                      v-else-if="item.fromChannal === ADVISER">【顾问：{{item.fromName}}】</span>
              </div>
              <!-- 文字消息 -->
              <div class="contxt"
                   v-if="item.msgType === IMTXT ">{{item.msgContents.contxt}}</div>
              <!-- 自定义消息 -->
              <div v-else-if="item.msgType === IMCUST"
                   class="customer">
                <div class="info">
                  <img :src="item.msgContents.Data.logo" />
                  <div>
                    <span>{{item.msgContents.Data.name || '—'}}</span>
                    <!-- 车型和车系 -->
                    <span v-if="item.msgContents.Data.isSeriesType"
                          class="price">{{item.msgContents.Data.minUnitPrice | formatPrice}} - {{item.msgContents.Data.maxUnitPrice | formatPrice}}万</span>
                    <span v-else
                          class="price">{{item.msgContents.Data.unitPrice | formatPrice}}万</span>
                    <span class="intro">{{item.msgContents.Data.performanceTags}}</span>
                    <span v-if="item.msgContents.Data.marketingTag"
                          class="marketingTag"><span>{{item.msgContents.Data.marketingTags[0].name}}</span></span>
                  </div>
                </div>
              </div>
              <!-- 图片消息 -->
              <div v-else-if="item.msgType === IMCOMB || item.msgType === IMCOMBONE "
                   class="customer">
                <div class="info">
                  <viewer :images="item.msgContents.logo.split(',')">
                    <img :src="item.msgContents.logo" />
                  </viewer>
                </div>
              </div>
            </li>
            <p v-if="scorllLoading"
               class="more">
              <i class="el-icon-loading"></i>
              加载中...
            </p>
            <p v-if="noMore"
               class="more">-没有更多记录-</p>
          </ul>
        </content>
      </el-collapse-item>
    </el-collapse>
    <p v-else
       class="more nodata">暂无数据</p>
  </div>

</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { im_history_date_api, im_history_list_api } from "@/api/index";
import { dateToTamp } from "@/utils";

interface SearchParam {
  account: string | number;
  endTime: number;
  startTime: number;
  page: number;
  size: number;
}
interface ChatTimeList {
  time: string;
  select: boolean;
}

@Component
export default class App extends Vue {
  private MEMBER: string = "3"; // 客户
  private ADVISER: string = "4"; // 顾问
  private IMTXT = "TIMTextElem"; // 文字聊天
  private IMCUST = "TIMCustomElem"; // 自定义聊天
  private IMCOMB = "TIMCombinationElem"; // 客户图片聊天
  private IMCOMBONE = "TIMImageElem"; // 顾问图片义聊天

  private loading: boolean = false;
  private isCheck: boolean = false; // 是否展开
  private chatContentList: any = []; // 聊天记录
  private browseName: string = ""; // 最近了浏览页面
  private scorllLoading: boolean = false; // 滚动加载-等待状态
  private noMore: boolean = false; // 滚动加载-是否还有更多数据
  private chatTimeList: Array<ChatTimeList> = []; // 时间
  private checkTime: string = ""; // 选中的时间
  private searchParam: SearchParam = { account: "", endTime: 0, startTime: 0, page: 0, size: 15 }; // chan
  get accountId() {
    let account = this.$route.params.id;
    this.searchParam.account = account;
    return account;
  }
  get scorllDisable() {
    return this.scorllLoading || this.noMore;
  }

  /**
   * @description 点击时间 请求聊天记录
   * @param 是否需要重置数据并从第一页开始-默认不需要重置
   */
  // 点击时间
  private checkLineTime(item: ChatTimeList) {
    this.chatTimeList.map((t: any) => {
      t.select = false;
    });
    item.select = !item.select;
    this.searchParam.endTime = parseInt(String(dateToTamp(item.time, false) / 1000));
    this.searchParam.startTime = parseInt(String(dateToTamp(item.time) / 1000));
    this.searchParam.page = 0;
    this.noMore = false;
    this.isCheck = !this.isCheck;
    this.chatContentList = [];
  }
  /**
   * @description 获取数据
   */
  private async _getChatListApi() {
    this.scorllLoading = true;
    try {
      let { data,totalCount } = await im_history_list_api(this.searchParam);
      /**
       * @description 整理列表数据
       */
      data.map((val: any) => {
        let _msgContents = val.msgContents && JSON.parse(val.msgContents);
        if (_msgContents.length === 1) {
          val.msgContents = _msgContents = _msgContents[0];
          // 如果是客户-自定义聊天
          if (val.fromChannal === this.MEMBER && val.msgType === this.IMCUST) {
            val.msgContents.Data = JSON.parse(_msgContents.Data);
          }
          // 如果是客户-文字聊天
          if (val.fromChannal === this.MEMBER && val.msgType === this.IMTXT) {
            let _contxt = _msgContents.Text;
            let isSysIndex = _contxt.indexOf("&_&_");
            val.msgContents.contxt = isSysIndex === -1 ? _contxt : _contxt.substring(0, isSysIndex);
          }
          // 如果是顾问-文字聊天
          if (val.fromChannal === this.ADVISER) {
            val.msgContents.contxt = _msgContents.Text;
          }
          // 如果是顾问的图片聊天
          if (val.msgType === this.IMCOMBONE) {
            val.msgContents.logo = _msgContents.ImageInfoArray[0].URL;
          }
        } else if (_msgContents.length === 2 && val.msgType === this.IMCOMB) {
          // 如果是客户的图片聊天
          val.msgContents = _msgContents[1];
          val.msgContents.logo = _msgContents[1].ImageInfoArray[0].URL;
          val.msgContents.Text = _msgContents[0].Ext;
        }
      });

      /**
       * @description 顶部客户的最近浏览数据
       */
      // 找到第一个客户的文字或者图片聊天记录
      let firstMemberIndex = data.findIndex(
        (val: any) =>
          (val.fromChannal === this.MEMBER && val.msgType === this.IMTXT) ||
          (val.fromChannal === this.MEMBER && val.msgType === this.IMCOMB)
      );
      // 如果客户的最近浏览不存在，且找到了第一个客户聊天记录
      if (!this.browseName && firstMemberIndex !== -1) {
        let _data = data[firstMemberIndex].msgContents;
        let isTextChat = !_data.ImageInfoArray; // 是文字聊天
        this.browseName = _data.Text;
        if (isTextChat) {
          this.browseName = this.browseName.substring(this.browseName.indexOf("&_&_") + 4, this.browseName.length);
        }
      }
      if (data.length > 0) {
        this.chatContentList.push(...data);
      }
      // 如果没有数据了就禁用滚动事件
      if (data.length < this.searchParam.size || totalCount === this.searchParam.size * this.searchParam.page) {
        this.noMore = true;
      }
      this.scorllLoading = false;
    } catch (error) {
      this.log(error);
    }
  }

  /**
   * @description 滚动加载
   */
  private scrollLoad() {
    this.searchParam.page++;
    this._getChatListApi();
  }

  // 请求聊天时间
  private async getDateTime() {
    this.loading = true;
    try {
      let { data } = await im_history_date_api({ account: this.accountId });
      data.map((time: string) => {
        this.chatTimeList.push({
          time,
          select: false
        });
      });
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.log(error);
    }
  }

  created() {
    this.getDateTime();
  }
}
</script>
<style lang='scss' scoped>
.title {
  padding-left: 10px;
  width: 100%;
  .radius {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 2px solid #409eff;
    border-radius: 50%;
    margin-right: 10px;
  }
  .time {
    font-weight: bold;
    font-size: 14px;
  }
}
article {
  padding-left: 10px;
  margin-bottom: 10px;
  span {
    display: inline-block;
    background-color: #eee;
    padding: 5px 10px;
    color: #999;
    font-size: 14px;
    border-radius: 6px;
  }
}
.yellow {
  color: #ff9900;
}
.green {
  color: #00cc00;
}
.default {
  color: #999;
}
.more {
  text-align: center;
  font-size: 9px;
  color: #444;
  margin-top: 20px;
}
.nodata {
  font-size: 13px;
  color: #909399;
}
.content-info {
  max-height: 400px;
  overflow: auto;
  padding: 10px 20px;
  .default,
  .contxt,
  .customer {
    margin-bottom: 10px;
  }
  .customer {
    display: flex;
    background: #fff;
    .info {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 6px 0px rgba(204, 204, 204, 0.5);
      border-radius: 4px;
      div {
        display: flex;
        flex-direction: column;
        span:first-child {
          color: #444;
          font-size: 13px;
        }
        .price {
          color: #f74d4d;
          font-size: 10px;
        }
        .intro {
          font-size: 9px;
          color: #444;
        }
        .marketingTag {
          span {
            border-radius: 3px;
            color: #4798de;
            font-size: 9px;
            background: #4798de59;
            display: inline-block;
            padding: 0px 8px;
          }
        }
      }
    }
    img {
      height: 70px;
      margin-right: 5px;
    }
  }
}
</style>
