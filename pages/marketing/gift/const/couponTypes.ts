export enum Type {
  CASH = "CASH",
  DISCOUNT = "DISCOUNT"
}

export enum Rule {
  CAMPAIGN = "CAMPAIGN",
  INDIVIDUAL = "INDIVIDUAL"
}

export enum ExpireStatus {
  NOT_ALLOW = "NOT_ALLOW",
  ALLOW = "ALLOW",
  EXPIRE = "EXPIRE"
}

export enum GoodsType {
  MODEL_GOODS = "MODEL_GOODS",
  ORDINARY_GOODS = "ORDINARY_GOODS"
}

export enum GoodsScope {
  UNIVERSAL = "UNIVERSAL",
  SPECIFIED = "SPECIFIED"
}

export interface Coupon {
  id?: number;
  type: Type;
  name: string;
  validFrom: string;
  validTo: string;
  stock: number | null;
  discountValue: number | null;
  discountRatio: number | null;
  discountBase: number | null;
  discountUpperLimit: number | null;
  releaseChannel: Rule[];
  description: string;
  modelCodes: string[];
  // range: number;
  goodsType: GoodsType;
  goodsScope: GoodsScope;
  timeRange: string[]; // 用于时间选择
  url: string; // 请求地址
  goodsIds: number[];
}

export interface Model {
  id: number;
  name: string;
  code: string;
  checked?: boolean;
  seriesCode?: string;
}

export interface Goods {
  id: number;
  name: string;
  code: string;
  checked?: boolean;
}

export interface TableItem {
  id: number;
}