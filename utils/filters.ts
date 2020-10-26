import Vue from "vue";
import dayjs from "dayjs";
const FILTERS: any = {
  momentTime: (value: string, formatString: string) => {
    formatString = formatString || " YYYY.MM.DD HH:mm ";
    return value ? dayjs(value).format(formatString) : "-";
  }
};
Object.keys(FILTERS).forEach(name => {
  Vue.filter(name, FILTERS[name]);
});
