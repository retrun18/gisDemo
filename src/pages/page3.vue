<template>
  <q-page ref="page">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOutLeft"
    >
    <q-parallax src="../assets/images/20170104024846256.jpg" :height="height">
      <div style="padding: 10px">
        <h1>倾斜摄影</h1>
        <h3>
          倾斜摄影技术是国际摄影测量领域近十几年发展起来的一项高新技术，该技术通过从一个垂直、四个倾斜、五个不同的视角同步采集影像，获取到丰富的建筑物顶面及侧视的高分辨率纹理。它不仅能够真实地反映地物情况，高精度地获取物方纹理信息，还可通过先进的定位、融合、建模等技术，生成真实的三维城市模型。
        </h3>
      </div>
    </q-parallax>
    </transition>
  </q-page>

</template>

<script>
  export default {
    name: "page3",
    data(){
      return{
        height:500
      }
    },
    mounted(){
      this.height=this.$refs.page.$el.clientHeight*1.5;
    }
  }
</script>

<style scoped>

</style>
