interface FansList {
  allList: FansListContent;
  blacklist: FansListContent;
}
interface FansListContent {
  title: string;
  total: number;
  list: FansListContentList[];
}
interface FansListContentList {
  id: number | string;
  tag: string;
  number: number;
  select: boolean;
  disabled?: boolean;
}

// 潜客管理 用户信息
interface UserInfo {
  name: string;
  header: string;
  sex: string;
  tel: number;
  car: string;
  registrationTime: number; // 注册时间
  source?: string; // 来源
  followTime: number; // 最近跟进时间
  followUser: string; // 跟进人
}

// 主机厂-粉丝列表和潜客列表里的item数据
interface FactoryTableList {
  memberUserId: number;
  avatar: string;
  name: string;
  phone: string;
  intentionCarModel: string;
  adviserName: string;
  label: Array<string>;
  time: number;
}

export { FansList, FansListContentList, FansListContent, UserInfo, FactoryTableList };
