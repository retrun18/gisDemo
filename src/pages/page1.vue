<template>
    <q-page>
      <div class="row gutter-xs">
        <transition
          appear
          enter-active-class="animated fadeInLeft"
          leave-active-class="animated fadeOutLeft">
          <div class="col-sm-6 col-xs-12 ">
            <div class="flex flex-center">
              <img class="" style="margin-top: 10px; width: 90%" src="../assets/images/mixed-reality-620x350.jpg"/></div>
          </div>
        </transition>
        <transition
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated bounceOutDown">
          <div class="col-sm-6 col-xs-12 ">
            <div class="flex flex-center">
              <img class="" style="margin-top: 10px;width: 60%" src="../assets/images/15041410551808.jpg"/>
            </div>
          </div>
        </transition>
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated bounceOutDown">
          <div class="col-sm-12 col-md-12">
            <div class="row flex flex-center">
              <div class="col-sm-10 col-xs-12 ">
                <div class="flex flex-center">
                  <img style="width: 60%" src="../assets/images/22092355812906.jpg"/>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </q-page>
</template>
<style>
</style>

<script>
  export default {
    name: 'PageIndex'
  }
</script>
