<template>
    <q-page>
      <transition
        appear
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
      >
          <q-parallax src="../assets/images/wrjcj.jpg">
            <h1 @click="sjcj=true" >影像采集</h1>
          </q-parallax>
      </transition>
      <transition
        appear
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
      <q-parallax src="../assets/images/1510036029809106.jpg">
        <h1 @click="qxjm=true">倾斜建模</h1>
      </q-parallax>
      </transition>
      <transition
        appear
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
      >
      <q-parallax src="../assets/images/14.jpg">
        <h1 @click="dth=true" >单体化处理</h1>
      </q-parallax>
      </transition>
      <transition
        appear
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
      <q-parallax src="../assets/images/case0103.jpg">
        <h1 @click="hyyy=true">行业应用</h1>
      </q-parallax>
      </transition>
      <q-modal v-model="sjcj" maximized>
        <img @click="sjcj=false" class="full-width" src="../assets/images/wrjcj.jpg"/>
      </q-modal>
      <q-modal v-model="qxjm" maximized>
        <img @click="qxjm=false" class="full-width" src="../assets/images/1510036029809106.jpg"/>
      </q-modal>
      <q-modal v-model="dth" maximized>
        <img @click="dth=false" class="full-width" src="../assets/images/14.jpg"/>
      </q-modal>
      <q-modal v-model="hyyy" maximized>
        <img @click="hyyy=false" class="full-width" src="../assets/images/case0103.jpg"/>
      </q-modal>
    </q-page>
</template>

<script>
    export default {
        name: "page4",
      data(){return{
        qxjm:false,
        sjcj:false,
        dth:false,
        hyyy:false
      }}
    }
</script>

<style scoped>
h1,img{
  cursor:pointer;
}
</style>
