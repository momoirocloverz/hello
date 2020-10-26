import dayjs from "dayjs";
const startFormat = 'YYYY-MM-DD 00:00:00';
const endFormat = 'YYYY-MM-DD 23:59:59';

export function currentMonth() {
  const now = new Date()
  const begin = new Date(now.setHours(0, 0, 0, 0))
  const start = begin.setDate(1)
  const end = new Date()
  return [dayjs(start).valueOf(), dayjs(end).valueOf()]
}
export function threeMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = new Date(y, m - 3, now.getDate());
  return [
    dayjs(dayjs(start).format(startFormat)).valueOf(),
    dayjs(dayjs(now).format(endFormat)).valueOf()
  ]
}
export function halfYear() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = new Date(y, m - 6, now.getDate());
  return [
    dayjs(dayjs(start).format(startFormat)).valueOf(),
    dayjs(dayjs(now).format(endFormat)).valueOf()
  ]
}
export function nearYear() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = new Date(y, m - 12, now.getDate());
  return [
    dayjs(dayjs(start).format(startFormat)).valueOf(),
    dayjs(dayjs(now).format(endFormat)).valueOf()
  ]
}

export const pickerOptions = {
  shortcuts: [
    {
      text: "最近三月",
      onClick(picker: any) {
        picker.$emit("pick", threeMonth());
      }
    },
    {
      text: "最近半年",
      onClick(picker: any) {
        picker.$emit("pick", halfYear());
      }
    },
    {
      text: "最近一年",
      onClick(picker: any) {
        picker.$emit("pick", nearYear());
      }
    }
  ]
}