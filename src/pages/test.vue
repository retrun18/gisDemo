<template>
  <q-page>
    <div class="AbsFull">
      <div id="from" class="container">
        <div class="ts" style="margin: 20px"></div>
      </div>
      <canvas ref="canvas" width="200" height="200" class="container"></canvas>
    </div>
  </q-page>
</template>

<script>
  import html2canvas from "html2canvas"

  export default {
    name: "test",
    data() {
      return {
        canvas: undefined,
        ctx: undefined,
        from: undefined
      }
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.from = document.getElementById("from");
      let scope = this;
      function  render() {
        requestAnimationFrame(render);
        html2canvas(document.getElementById("from"), {backgroundColor: null}).then(function (canvas) {
          let ctx = canvas.getContext("2d");
          scope.ctx.drawImage(canvas,0,0,200,200);
        });
      }render();
    },
    method: {}
  }
</script>

<style scoped>
  .container {
    width: 50%;
    height: 100px;
    float: left;;
  }

  .ts {
    background: red;
    width: 20px;
    height: 20px;
    transition: 1s;
  }

  .ts:hover {
    width: 40px;
    height: 40px;
  }
</style>
