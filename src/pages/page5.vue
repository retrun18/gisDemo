<template>
  <q-page ref="page">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOutLeft"
    >
      <q-parallax src="../assets/images/BIM.jpg" :height="height">
        <div class="flex flex-center" style="padding: 10px">
          <h1>BIM</h1>
          <h3>
            建筑信息化模型（BIM）的英文全称是Building Information Modeling，是一个完备的信息模型，能够将工程项目在全寿命周期中各个不同阶段的工程信息、过程和资源集成在一个模型中，方便的被工程各参与方使用。通过三维数字技术模拟建筑物所具有的真实信息，为工程设计和施工提供相互协调、内部一致的信息模型，使该模型达到设计施工的一体化，各专业协同工作，从而降低了工程生产成本，保障工程按时按质完成。
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
