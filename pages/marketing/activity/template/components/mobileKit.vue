<template>
  <div class="kit"
       :style="{transform:'scale('+scale+')'}">
    <div class="gameContent"
         ref="mobileKitRef">
      <NINEBLOCKBOX :tmplCfg="tmplCfg"
                    v-if="type === 'NINE_BLOCK_BOX'"></NINEBLOCKBOX>
      <SCRATCHTICKETS :tmplCfg="tmplCfg"
                      v-else-if="type === 'SCRATCH_TICKETS'"></SCRATCHTICKETS>
      <TURNTABLE :tmplCfg="tmplCfg"
                 v-else>
      </TURNTABLE>
    </div>
  </div>
</template>

<script>
import NINEBLOCKBOX from './gamesTMPL/gridsOfNine';
import SCRATCHTICKETS from './gamesTMPL/scratchCard';
import TURNTABLE from './gamesTMPL/turntable';
export default {
  components: { NINEBLOCKBOX, SCRATCHTICKETS, TURNTABLE },
  name: 'mobileKit',
  props: ['scale', 'tmplCfg', 'type']
}
</script>

<style lang="scss" scoped>
.kit {
  background-image: url("../../../../../assets/images/game/mobile.png");
  background-size: 100% 100%;
  width: fit-content;
  padding: 210px 49px 210px 57px;
  height: fit-content;

  .gameContent {
    position: relative;
    background: #fff;
    width: 750px;
    height: 1334px;
    overflow-x: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* webkit内核 */
  .gameContent::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  /* o内核 */
  .gameContent .-o-scrollbar {
    -moz-appearance: none !important;
    background: rgba(0, 255, 0, 0) !important;
  }

  /* IE10,IE11,IE12 */
  .gameContent {
    -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
    overflow: auto;
  }
  .empty {
    font-size: 30px;
    margin-top: 100px;
  }
}
</style>
