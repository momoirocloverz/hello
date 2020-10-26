export default function(val: number | string, fixed: number = 0) {
  val = Number(val).toFixed(fixed);
  let [pre, end] = val.split(".");

  if (pre.length <= 3) {
    return val;
  } else {
    if (!end) val = val + ".0";
    let res = val.replace(/(\d)(?=(\d{3})+\.)/g, "$1,").split(".")[0];
    if (end && fixed < end.length) {
      end = end.substr(0, fixed);
    }
    return fixed > 0 ? `${res}.${(end || "").padEnd(fixed, "0")}` : res;
  }
}
