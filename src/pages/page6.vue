<template>
  <q-page ref="page">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOutLeft"
    >
      <q-parallax src="../assets/images/atf-3.jpg" :height="height">
        <div class="flex flex-center" style="padding: 10px">
          <h1>WebGL</h1>
          <h3>
            WebGL（全写Web Graphics Library）是一种3D绘图协议，这种绘图技术标准允许把JavaScript和OpenGL ES 3.0结合在一起，通过增加OpenGL ES 3.0的一个JavaScript绑定，WebGL可以为HTML5 Canvas提供硬件3D加速渲染，这样Web开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型了，还能创建复杂的导航和数据视觉化。显然，WebGL技术标准免去了开发网页专用渲染插件的麻烦，可被用于创建具有复杂3D结构的网站页面，甚至可以用来设计3D网页游戏等等。
          </h3>
        </div>
      </q-parallax>
    </transition>
  </q-page>

</template>

<script>
  export default {
    name: "page3",
    data() {
      return {
        height: 500
      }
    },
    mounted() {
      this.height=this.$refs.page.$el.clientHeight*1.5;
    }
  }
</script>

<style scoped>

</style>
