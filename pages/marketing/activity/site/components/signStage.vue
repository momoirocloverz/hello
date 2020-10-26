<template>
  <div id="container" class="sign-stage" ref="signStageRef"></div>
</template>

<script lang="ts">
import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import "three/examples/js/renderers/CSS3DRenderer.js";
import "three/examples/js/controls/TrackballControls.js";
import _ from "lodash";
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
const ROTATE_SPEED = 0.5;
const MIN_DISTANCE = 500;
const MAX_DISTANCE = 6000;
@Component({
  name: "signInStage",
  components: {}
})
export default class extends Vue {
  @Ref() signStageRef: HTMLElement;
  @Prop({ default: () => [] }) signArr: Array<any>;
  stageWidth: number;
  stageHeight: number;
  renderer: any;
  camera: any;
  scene: any;
  controls: any;
  first: boolean = true;
  objectsArr: Array<{}> = [];
  // tableSource: Array<any> = [];
  targets: any = _.cloneDeep({ table: [], sphere: [], helix: [], grid: [] });
  get tableSource() {
    return this.signArr;
  }

  @Watch("signArr")
  onSignArr() {
    this.createSceneEle();

    this.toTable();
    // sphere
    this.toSphere();
    // helix
    this.toHelix();
    // grid
    this.toGrid();
    this.transform(this.targets.table, 2000);
  }
  createSceneEle() {
    // this.objectsArr = [];
    for (let i = 0; i < this.signArr.length; i++) {
      let element: any;
      this.scene.remove(`table${i}`);
      if (this.first || this.tableSource.length < 1) {
        element = document.createElement("div");
        element.className = `imgItem table${i}`;
        element.style.backgroundColor = "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
        let img = document.createElement("img");
        img.src = this.tableSource[i].avatar;
        element.appendChild(img);
        let object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        object.name = `table${i}`;
        this.scene.add(object);
        this.objectsArr.push(object);
      } else {
        let _obj: any = this.objectsArr[i];
        element = _obj && _obj.element;
        let img = document.createElement("img");
        img.src = this.tableSource[i].avatar;
        element.innerHTML = "";
        element.appendChild(img);
      }
    }
    this.first = false;
  }
  private init(): void {
    this.camera = new THREE.PerspectiveCamera(40, this.stageWidth / this.stageHeight, 1, 10000);
    this.camera.position.z = 3000;
    this.scene = new THREE.Scene();
    // // sphere
    // this.toSphere();
    // // table
    // this.toTable();
    // // helix
    // this.toHelix();
    // // grid
    // this.toGrid();
    // 渲染
    this.renderer = new THREE.CSS3DRenderer(this.signStageRef);
    this.renderer.setSize(this.stageWidth, this.stageHeight);
    this.renderer.domElement.style.position = "absolute";
    this.signStageRef.appendChild(this.renderer.domElement);
    // 鼠标控制
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = ROTATE_SPEED;
    this.controls.minDistance = MIN_DISTANCE;
    this.controls.maxDistance = MAX_DISTANCE;
    // this.transform(this.targets.table, 2000);
    this.autoChange();
  }

  private toTable(): void {
    let _table = [];
    this.targets.table = [];

    for (var i = 0; i < this.tableSource.length; i++) {
      // 表格需要坐标进行排序的
      let item: any = new THREE.Object3D();
      item.position.x = this.tableSource[i].p_x * 140 - 1330;
      item.position.y = -(this.tableSource[i].p_y * 180) + 990;
      _table.push(item);
    }
    this.targets.table = _.cloneDeep(_table);
  }
  private toSphere(): void {
    let vector = new THREE.Vector3();
    let spherical = new THREE.Spherical();
    let _arr = [];
    this.targets.sphere = [];
    for (let i: any = 0, l = this.objectsArr.length; i < l; i++) {
      let phi = Math.acos(-1 + (2 * i) / l);
      let theta = Math.sqrt(l * Math.PI) * phi;
      let object = new THREE.Object3D();
      spherical.set(800, phi, theta);
      object.position.setFromSpherical(spherical);
      // vector.copy(object.position).multipliedByScalar(2);
      object.lookAt(vector);
      _arr.push(object);
    }
    this.targets.sphere = _.cloneDeep(_arr);
  }
  private toHelix(): void {
    let vector1 = new THREE.Vector3();
    let cylindrical = new THREE.Cylindrical();
    let _arr = [];
    this.targets.helix = [];

    for (let i: any = 0, l = this.objectsArr.length; i < l; i++) {
      let theta = i * 0.175 + Math.PI;
      let y = -(i * 5) + 450;
      let object = new THREE.Object3D();
      // 参数一 圈的大小 参数二 左右间距 参数三 上下间距
      cylindrical.set(900, theta, y);
      object.position.setFromCylindrical(cylindrical);
      vector1.x = object.position.x * 2;
      vector1.y = object.position.y;
      vector1.z = object.position.z * 2;
      object.lookAt(vector1);
      _arr.push(object);
    }
    this.targets.helix = _.cloneDeep(_arr);
  }
  private toGrid(): void {
    let _arr = [];
    this.targets.grid = [];

    for (let i: any = 0; i < this.objectsArr.length; i++) {
      let object = new THREE.Object3D();
      object.position.x = (i % 5) * 400 - 800; // 400 图片的左右间距  800 x轴中心店
      object.position.y = -(Math.floor(i / 5) % 5) * 300 + 500; // 500 y轴中心店
      object.position.z = Math.floor(i / 25) * 200 - 800; // 300调整 片间距 800z轴中心店
      _arr.push(object);
    }
    this.targets.grid = _.cloneDeep(_arr);
  }
  private autoChange() {
    // 自动更换
    let ini = 0;
    setInterval(() => {
      ini = ini >= 3 ? 0 : ini;
      ++ini;
      switch (ini) {
        case 1:
          this.transform(this.targets.sphere, 1000);
          break;
        case 2:
          this.transform(this.targets.helix, 1000);
          break;
        case 3:
          this.transform(this.targets.grid, 1000);
          break;
      }
    }, 8000);
  }
  private transform(targets: any, duration: number) {
    TWEEN.removeAll();
    for (var i = 0; i < this.objectsArr.length; i++) {
      var item: any = this.objectsArr[i];
      var target = targets[i];
      new TWEEN.Tween(item.position)
        .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
      new TWEEN.Tween(item.rotation)
        .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }
    new TWEEN.Tween(this).to({}, duration * 2).update(this.renderer);
  }
  private animate(): void {
    // 让场景通过x轴或者y轴旋转  & z
    // scene.rotation.x += 0.011;
    this.scene.rotation.y += 0.008;
    requestAnimationFrame(this.animate);
    TWEEN.update();
    this.controls.update();
    // 渲染循环
    this.renderer.render(this.scene, this.camera);
  }
  private onWindowResize() {
    this.stageWidth = this.signStageRef.offsetWidth;
    this.stageHeight = this.signStageRef.offsetHeight;
    this.camera.aspect = this.stageWidth / this.stageHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.stageWidth, this.stageHeight);
    this.renderer.render(this.scene, this.camera);
  }
  mounted() {
    this.stageWidth = this.signStageRef.offsetWidth;
    this.stageHeight = this.signStageRef.offsetHeight;
    this.init();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
  }
}
</script>

<style lang="scss">
.sign-stage {
  position: absolute;
  left: 0;
  top: 0;
  right: 620px;
  height: 100%;
  overflow: hidden;
}
.imgItem {
  width: 120px;
  height: 120px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
