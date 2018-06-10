<template>
  <q-page>
    <div class="AbsFull">
      <q-page-sticky  position="top-right" style="z-index: 99" :offset="[10,10]">
        <q-btn round icon="settings" color="primary" size="sm">
          <q-popover>
            <q-list>
              <q-collapsible popup  group="sceneControl" icon="explore" label="模型操作">
                <q-btn>
                </q-btn>
              </q-collapsible>
              <q-collapsible popup group="sceneControl" icon="explore" label="First">
                first
              </q-collapsible>
              <q-collapsible popup group="sceneControl" icon="explore" label="First">
                first
              </q-collapsible>
            </q-list>
          </q-popover>
        </q-btn>
      </q-page-sticky>
      <div ref="sceneDiv" style="overflow: hidden" class="AbsFull">
        <q-resize-observable @resize="Resize" />
      </div>
    </div>
  </q-page>
</template>
<script>
  import AppCore from "../api/AppCore"
    export default {
        name: "stcp",
      data(){
          return{
          }
      },
      mounted(){
          AppCore.StartUp(this.$refs.sceneDiv);
      },
      methods:{
          Resize:function () {
            AppCore.Resize();
          }
      }
    }
</script>

<style scoped>

</style>
