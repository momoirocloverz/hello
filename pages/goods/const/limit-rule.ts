const BigNumber = require('bignumber.js');
export const listColumn = [
  {
    prop: "name",
    label: "分组名称"
  },
  {
    prop: "maxDiscount",
    label: "最高优惠金额(万元)",
    formatter: (row: any) => row.discountType === 0 ? BigNumber(row.maxDiscount).dividedBy(10000) : "—"
  },
  {
    prop: "maxDiscount",
    label: "最高优惠百分比",
    formatter: (row: any) => row.discountType === 1 ? `${BigNumber(row.maxDiscount).multipliedBy(100)} %` : "—"
  },
  {
    prop: "models",
    label: "限价车型",
    formatter: (row: any) => {
      let t: string[] = [];
      row.models.forEach((ele: any) => {
        t.push(ele.name)
      });
      // return t.length > 0 ? t.join("；") : "—"
      return row.models ? row.models.length : 0
    }
  },
  {
    prop: "regions",
    label: "限价区域",
    formatter: (row: any) => {
      let t: string[] = [];
      row.regions.forEach((ele: any) => {
        t.push(ele.regionName)
      });
      // return t.length > 0 ? t.join("；") : "—"
      return row.regions ? row.regions.length : 0
    }
  }
]