interface DialogInfo {
  show: boolean;
  title: string;
  type?: string;
  info?: any;
}
interface RelationContent {
  [propName: string]: any;
}
interface LotteryForm {
  marketingToolType: number | string | null;
  marketingToolStyle: number | null;
  thumbnail: string;
  posterUrl: string;
  name: string;
  isHot: boolean;
  chanceTime?: any;
  freeChanceTimes: number | null; // 免费抽奖次数
  freeChanceMode: string | null; // 免费次数模式
  chanceLimit?: number | null; // 任务次数限制
  chanceMode?: string | null; // 任务次数模式
  taskTypes?: Array<any>; //  抽奖任务
  prizeValidityPeriod: any;
  description: string; // 活动规则
  [propName: string]: any;
}
interface SiteForm {
  posterUrl: string;
  name: string;
  description: string; // 活动规则
  requireMobile: boolean;
  requireName: boolean;
  [propName: string]: any;
}
interface SalesForm {
  campaignImageUrl: string;
  name: string;
  isHot: boolean;
  [propName: string]: any;
}
interface ShareForm {
  content: string;
  image: string;
  title: string;
}
interface PutForm {
  isHot: boolean;
  location?: string;
  memberLimit: number;
  regTime: Array<number>;
  tool: Array<any>;
  reletedGoods: Array<any>;
}
interface FilterInter {
  page: number;
  size: number;
}
interface ActivityState {
  actDetailInfo: any;
  relationContent: RelationContent;
  lotteryForm: LotteryForm;
  siteForm: SiteForm;
  salesForm: SalesForm;
  priceSetList: Array<any>;
  shareForm: ShareForm;
  activeType: string;
  activeItem: string;
}
interface ActiveStatistics {
  name: string;
  type: string;
  total: number;
  key?: string;
  id: string;
  data: Array<any>;
  color: Array<string>;
}
interface HostedActiveModeItem {
  icon: string;
  mode: string;
  label: string;
  desc: string;
}
export {
  DialogInfo,
  ActivityState,
  LotteryForm,
  ShareForm,
  SiteForm,
  SalesForm,
  FilterInter,
  ActiveStatistics,
  HostedActiveModeItem
};
