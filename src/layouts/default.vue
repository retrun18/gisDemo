<template>
  <q-layout class="grad1" view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>
          文档主题
          <div slot="subtitle">演讲者：李菁萍</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>演讲目录</q-list-header>
        <router-link to="/">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="首页" sublabel="封面页"/>
          </q-item>
        </router-link>
        <router-link to="/page1">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="未来" sublabel="现代技术发展趋势"/>
          </q-item>
        </router-link>
        <router-link to="/page2">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="三维GIS" sublabel="GIS三维可视化"/>
          </q-item>
        </router-link>
        <router-link to="/page3">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="倾斜摄影" sublabel="倾斜摄影介绍"/>
          </q-item>
        </router-link>
        <router-link to="/page4">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="倾斜生产流程" sublabel="倾斜摄影数据生产流程介绍"/>
          </q-item>
        </router-link>
        <router-link to="/page5">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="BIM" sublabel="BIM建模技术介绍"/>
          </q-item>
        </router-link>
        <router-link to="/page6">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="WebGL" sublabel="WebGL技术介绍"/>
          </q-item>
        </router-link>
        <router-link to="/page7">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="WebGL" sublabel="WebGL性能优化"/>
          </q-item>
        </router-link>
        <router-link to="/test">
          <q-item>
            <q-item-side icon="school"/>
            <q-item-main label="test" sublabel="canvas"/>
          </q-item>
        </router-link>
        <q-item @click.native="showSTCP()">
          <q-item-side icon="school"/>
          <q-item-main label="STCP" sublabel="三维gis城市"/>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container class="grad1">
      <router-view v-if="!isSTCP"></router-view>
      <keep-alive>
        <STCP v-if="isSTCP"></STCP>
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {openURL} from 'quasar'
  import STCP from '../pages/stcp'

  export default {
    name: 'LayoutDefault',
    components:{
      STCP
    },
    data() {
      return {
        leftDrawerOpen: this.$q.platform.is.desktop,
        isSTCP: false
      }
    },
    beforeRouteUpdate (to,from,next) {
      this.isSTCP=false;
      next();
    },
    methods: {
      openURL,
      showSTCP() {
        this.isSTCP = true
      }
    }
  }
</script>

<style>

</style>
