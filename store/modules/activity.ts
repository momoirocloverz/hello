import { MutationTree, ActionTree } from "vuex";
import { ActivityState, LotteryForm, ShareForm, SiteForm, SalesForm } from "@/@types/activity";
import _ from "lodash";
import { getPriceList } from "@/api";
import { toMultipliedBy } from "@/utils/";
import dayjs from "dayjs";
interface RootState {}
const startSuffix = " 00:00";
const endSuffix = " 23:59";
let statTime = dayjs(Date.now() + 24 * 60 * 60 * 1000).format("YYYY-MM-DD") + startSuffix;
let endTime = dayjs(Date.now() + 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD") + endSuffix;
// 抽奖活动form
const initLotteryForm: LotteryForm = {
  marketingToolType: null, // 活动类型
  marketingToolStyle: null, // 活动模板
  thumbnail: "",
  activeTime: [new Date(statTime).getTime(), new Date(endTime).getTime()], // 活动时间
  posterUrl: "", // 活动图片
  name: "", // 活动名称
  isHot: false,
  chanceTime: [1], // 抽奖次数
  freeChanceTimes: 3, // 免费抽奖次数
  freeChanceMode: "ALL_TIMES", // 免费次数模式
  chanceLimit: 1, // 任务次数限制
  chanceMode: "ALL_TIMES", // 任务次数模式
  prizeValidityPeriod: 0, // 奖品领取时限
  taskTypes: [], //  抽奖任务
  description: "",
  dayNum: null
};
const iniSiteForm: SiteForm = {
  posterUrl: "",
  name: "",
  description: "",
  requireMobile: true,
  requireName: true,
  isHot: false,
  latitude: null, // 活动地点的纬度
  location: "",
  luckydrawEnabled: true, // 是否开启大屏抽奖
  messageBoardEnabled: true, // 是否开启留言墙
  signinEnabled: true, // 是否开启现场签到
  signinValidFrom: true, // 活动签到开始时间
  signinValidTo: true, // 活动签到结束时间
  memberLimit: -1, // 活动人数限制
  limitPerson: null,
  information: [1, 2],
  tool: [1],
  activeTime: [new Date(statTime).getTime(), new Date(endTime).getTime()], // 活动时间
  regTime: [],
  tempPic: require("@/assets/images/activity/site.png")
};
const iniSalesForm: SalesForm = {
  limitPerson: null,
  campaignImageUrl: "",
  name: "",
  isHot: false,
  hasExpectTime: false,
  information: [1, 2],
  reletedGoods: [],
  campaignStartTime: "",
  campaignEndTime: "",
  campaignPeopleLimit: -1,
  activeTime: [new Date(statTime).getTime(), new Date(endTime).getTime()], // 活动时间
  tempPic: require("@/assets/images/activity/sales.png")
};
const initShareForm: ShareForm = {
  title: "",
  content: "",
  image: ""
};
const initPriceList = [
  {
    prizeId: -1,
    id: -1,
    type: 2,
    name: "谢谢参与",
    perValid: true,
    numValid: true,
    quantity: 1,
    posterUrl: require("@/assets/images/activity/thank.png")
  }
];
const state: ActivityState = {
  actDetailInfo: JSON.stringify(localStorage.getItem("actDetailInfo") || "") || {},
  relationContent: {},
  lotteryForm: _.cloneDeep(initLotteryForm),
  siteForm: _.cloneDeep(iniSiteForm),
  salesForm: _.cloneDeep(iniSalesForm),
  priceSetList: _.cloneDeep(initPriceList),
  shareForm: _.cloneDeep(initShareForm),
  activeType: "lottery",
  activeItem: "agent"
};

const mutations: MutationTree<ActivityState> = {
  SET_ACT_DETAIL_INFO(state, data) {
    state.actDetailInfo = data;
  },
  SET_RELATION(state, data) {
    state.relationContent = {
      ...state.relationContent,
      ...data
    };
  },
  SET_LOTTERY_FORM(state, data) {
    state.lotteryForm = {
      ...state.lotteryForm,
      ...data
    };
  },
  SET_SITE_FORM(state, data) {
    state.siteForm = {
      ...state.siteForm,
      ...data
    };
  },
  SET_SALES_FORM(state, data) {
    state.salesForm = {
      ...state.salesForm,
      ...data
    };
  },
  SET_PRICE_LIST(state, data) {
    state.priceSetList = data || _.cloneDeep(initPriceList);
  },
  SET_SHARE_FORM(state, data) {
    state.shareForm = data;
  },
  SET_ACTIVE_TYPE(state, data) {
    state.activeType = data;
  },
  SET_ACTIVE_ITEM(state, data) {
    state.activeItem = data;
  }
};
const actions: ActionTree<ActivityState, RootState> = {
  /**
   * 设置活动那个详情
   * @param commit
   * @param data
   */
  setActDetailInfo({ commit }, data) {
    if (data && data.shareSetting) {
      commit("SET_SHARE_FORM", data.shareSetting);
    }
    if (data && data.prizeSettings) {
      let prizeSettings: Array<any> = data.prizeSettings.map((item: any) => {
        item.probability = toMultipliedBy(item.probability, 100);
        item.perValid = true;
        item.numValid = true;
        return item;
      });
      commit("SET_PRICE_LIST", prizeSettings);
    }
    localStorage.setItem(`actDetailInfo`, JSON.stringify(data));
    commit("SET_ACT_DETAIL_INFO", data);
  },
  /**
   * 获取详情
   * @param commit
   */
  getActDetailInfo({ commit }) {
    let data = JSON.parse(localStorage.getItem("actDetailInfo") || "") || {};
    commit("SET_ACT_DETAIL_INFO", data);
  },
  /**
   * 设置关联
   * @param commit
   * @param data
   */
  setRelation({ commit }, data) {
    commit("SET_RELATION", data);
  },
  /**
   * 设置抽奖form
   * @param commit
   * @param data
   */
  setLotteryForm({ commit }, data) {
    commit("SET_LOTTERY_FORM", data);
  },
  setSiteForm({ commit }, data) {
    commit("SET_SITE_FORM", data);
  },
  setSalesForm({ commit }, data) {
    commit("SET_SALES_FORM", data);
  },
  /**
   * 重置form
   * @param commit
   */
  resetActiveForm({ commit }) {
    commit("SET_LOTTERY_FORM", _.cloneDeep(initLotteryForm));
    commit("SET_SITE_FORM", _.cloneDeep(iniSiteForm));
    commit("SET_SALES_FORM", _.cloneDeep(iniSalesForm));
    commit("SET_PRICE_LIST", []);
    commit("SET_SHARE_FORM", _.cloneDeep(initShareForm));
  },
  /**
   * 设置奖项
   * @param commit
   * @param data
   */
  setPriceList({ commit }, data) {
    commit("SET_PRICE_LIST", data);
  },
  /**
   * 获取奖品列表
   * @param commit
   * @param state
   * @param data
   */
  async getAwardList({ commit, state }, data) {
    try {
      let res = await getPriceList(data);
      res.data = res.data.map((item: any) => {
        let { type } = item;
        item.probability = toMultipliedBy(item.probability, 100);
        item.type = type === 0 ? "实物奖品" : type === 1 ? "优惠券" : "无奖品";
        item.perValid = true;
        item.numValid = true;
        return item;
      });
      commit("SET_PRICE_LIST", res.data);
    } catch (e) {
      console.log(e);
    }
  },
  resetPriceList({ commit }) {
    commit("SET_PRICE_LIST", _.cloneDeep(initPriceList));
  },
  async setShareContent({ commit, state }, data) {
    commit("SET_SHARE_FORM", data);
  },
  setActiveType({ commit, state }, data) {
    commit("SET_ACTIVE_TYPE", data);
  },
  setActiveItem({ commit, state }, data) {
    commit("SET_ACTIVE_ITEM", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
