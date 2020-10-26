export const DEVIDE_CHAR = "-=-";
export const numReg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
export const waresType: element.Options[] = [
  { label: "车辆精品", value: 1 },
  { label: "普通商品", value: 0 }
]

interface BaseFormRule {
  brand: element.FormRule[];
  coverUrl: element.FormRule[];
  mainImg: element.FormRule[];
  minOrder: element.FormRule[];
  minPack: element.FormRule[];
  name: element.FormRule[];
  text: element.FormRule[];
  // type: 1,
  vehicle?: element.FormRule[];
}
const required = true;
const trigger = ["blur", "change"];
const minOrderValidator = (rules: any, value: any, callback: any) => {
  const num = 99999;
  if (Number(value) > num) {
    return callback(new Error(`最大数字${num}`))
  } else {
    callback()
  }
}
export const baseFormRule2: BaseFormRule = {
  brand: [
    { required, trigger, message: '请输入品牌名称' }
  ],
  coverUrl: [
    { required, trigger, message: '请上传封面图' }
  ],
  mainImg: [
    { required, trigger, message: '请上传主图' }
  ],
  minPack: [
    { required, trigger, message: '请输入最小包装' }
  ],
  minOrder: [
    { required, trigger, message: '请输入最小订购量' },
    { validator: minOrderValidator, trigger }
  ],
  name: [
    { required, trigger, message: '请输入品牌名称' }
  ],
  text: [
    { required, trigger, message: '请输入描述信息' }
  ],
}
export const baseFormRule: BaseFormRule = {
  ...baseFormRule2,
  vehicle: [
    { required, trigger, message: '请选择适用车系' }
  ],
}