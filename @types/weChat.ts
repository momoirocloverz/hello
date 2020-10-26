interface MenuInter {
  buttons: Array<any>;
  [propName: string]: any;
}
interface SelectedMenuInter {
  subButtons: Array<{}>;
  [propName: string]: any;
}

interface NewsInfoList {
  loading: boolean;
  data: object;
  [propName: string]: any;
}
interface MaterialsInfo {
  loading: boolean;
  [propName: string]: any;
}
interface TagList {
  loading: boolean;
  list: Array<any>;
}

interface WeChatState {
  chatMenu: MenuInter;
  selectedMenu: SelectedMenuInter;
  newsInfoList: NewsInfoList;
  materialsInfo: MaterialsInfo;
  tagList: TagList;
  organId: any;
  level: Number;
  menuIdx: Number;
  subIdx: Number;
}

export { WeChatState, MaterialsInfo, NewsInfoList, SelectedMenuInter, MenuInter };
