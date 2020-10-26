"use strict";

let watermark: any = {};

let setWatermark = (str: any) => {
  let id: string = "1.23452384164.12341415";
  let _element: any = document.getElementById(id);
  if (_element !== null) {
    document.body.removeChild(_element);
  }

  let can = document.createElement("canvas");
  can.width = 160;
  can.height = 180;

  let cans: any = can.getContext("2d");
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = "18px";
  cans.fillStyle = "rgba(200, 200, 200, 0.20)";
  cans.textAlign = "left";
  cans.textBaseline = "Middle";
  cans.fillText(str, can.width / 16, can.height / 2);

  let par = document.createElement("div");
  let div = document.createElement("div");
  par.id = id;
  par.appendChild(div);
  div.style.pointerEvents = "none";
  div.style.top = "70px";
  div.style.left = "240px";
  div.style.position = "fixed";
  div.style.zIndex = "100";
  div.style.width = document.documentElement.clientWidth - 10 + "px";
  div.style.height = document.documentElement.clientHeight - 100 + "px";
  div.style.background = "url(" + can.toDataURL("image/png") + ") left top repeat";
  document.body.appendChild(par);
  return id;
};

// 该方法只允许调用一次
watermark.set = (str: any) => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};
export default watermark;
