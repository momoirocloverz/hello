import dayjs from "dayjs";
import type = Mocha.utils.type;

const BigNumber = require("bignumber.js");

export const arrToObject = (arr: Array<{}>): object => {
  let _obj: any = {};
  arr.forEach((item: any) => {
    _obj[item.value] = item.label;
  });
  return _obj;
};
/**
 * 数字转汉字
 * @param num
 */
export const numToUppercase = (num: any) => {
  const numMap: Array<string> = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  let len = String(num).length;
  let _str: string = "";
  if (len === 1) {
    _str = numMap[num];
  } else if (len === 2) {
    if (num === 10) {
      _str = numMap[num];
    } else if (num > 10 && num < 20) {
      let _at0: number = Number(String(num).charAt(1));
      _str = "十" + numMap[_at0];
    } else {
      let _at0: number = Number(String(num).charAt(0));
      let _at1: number = Number(String(num).charAt(1));

      _str = numMap[_at0] + "十" + numMap[_at1].replace("零", "");
    }
  }
  return _str;
};

export const toMillion = (val: any): any => {
  return val
    ? BigNumber(val)
        .dividedBy(10000)
        .decimalPlaces(2) - 0
    : "-";
};
/**
 * 减法
 * @param val
 * @param val1
 */
export const toMinus = (val: number, val1: number): any => {
  return val ? BigNumber(val).minus(val1) - 0 : "-";
};
export const toPercent = (val: any): any => {
  return val
    ? BigNumber(val)
        .multipliedBy(100)
        .decimalPlaces(2) + "%"
    : "-";
};
export const toCent = (val: any): any => {
  return val
    ? BigNumber(val)
        .multipliedBy(10000)
        .decimalPlaces(2) - 0
    : "-";
};
export const toDivide = (val: any, val1: any): any => {
  if (val && val1) {
    let x = new BigNumber(val);
    let y = new BigNumber(val1);
    return x.dividedBy(y) - 0;
  } else {
    return "";
  }
};

export const toMultipliedBy = (val: any, val1: any): any => {
  if (val && val1) {
    let x = new BigNumber(val);
    return x.multipliedBy(val1) - 0;
  } else {
    return "";
  }
};
export const toPlus = (val: number, val1: number): any => {
  let x = new BigNumber(val);
  let y = new BigNumber(val1);

  return Number(x.plus(y).decimalPlaces(5));
};

export const generateUuid = () => {
  return "geely" + new Date().getTime() + Math.round(Math.random() * 100000);
};

export const getAllDate = (start: any, end: any) => {
  let dateArr = [];
  let stamp: any;
  let isDate = Object.prototype.toString.call(start) === "[object Date]";
  start = isDate ? new Date(start).getTime() : start;
  end = isDate ? new Date(end).getTime() : end;
  const oneDay = 24 * 60 * 60 * 1000;
  for (stamp = start; stamp <= end; ) {
    dateArr.push(dayjs(parseInt(stamp)).format("YYYY-MM-DD"));
    stamp = stamp + oneDay;
  }
  return dateArr;
};

/**
 * @description DateTime 转换成时间戳
 * @param 时间
 * @param 结束时间还是开始时间 - 默认开始时间
 */
export const dateToTamp = (dataTime: string, isStart: boolean = true): number => {
  let tmp: number;
  tmp = isStart
    ? new Date(dataTime).getTime() - 8 * 60 * 60 * 1000
    : new Date(dataTime).getTime() + 16 * 60 * 60 * 1000 - 1;
  return tmp;
};
export const formatDate = (val: any) => {
  return dayjs(val).format("YYYY-MM-DD HH:mm");
};
