<template>
    <q-page class="flex flex-center">
      <transition
        appear
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutRight">
        <img class="full-height" src="../assets/images/1.jpg"/>
      </transition>
      <transition
        appear
        enter-active-class="animated rotateInDownLeft"
        leave-active-class="animated rotateOutUpRight"
      >
      <q-page-sticky position="top" :offset="[18, 18]">
        <div style="padding:35px;color:#ffffff;background: rgba(41,144,207,0.35)" class=" shadow-24">
          <h1 class="text-weight-bold text-center">三维GIS主题分享</h1>
          <h4>分享人:李菁萍</h4>
        </div>
      </q-page-sticky>
  </transition>
    </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
