<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div :class="systemLogoClass">
      <img :src="logoUrl" >
      <div>{{ systemName }}</div>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical"
      background-color="#2E3D50"
      text-color="#ADB8C1"
      active-text-color="#FFFFFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      logoUrl: '/images/basicRegistration-logo.png'
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'style'
    ]),
    systemName() {
      if (this.style.systemName) {
        return this.style.systemName
      }
      return this.sidebar.systemName
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    systemLogoClass: function() {
      return this.sidebar.systemLogoClass
    }
  }
}
</script>
<style>
  .systemLogo{
    height: 171px;
    width: 230px;
    background-color: #2E3D50;
    border-bottom: 1px #666666 solid;
    margin: 0 auto;
  }
  .systemLogo img{
    height: 78px;
    width: 78px;
    margin-top: 36px;
    margin-left: 71px;
  }
  .systemLogo div{
    font-size: 16px;
    color: white;
    margin-top: 17px;
    margin-left: -10px;
    text-align: center;
  }

  .systemLogo-small{
    height: 60px;
    background-color: #2E3D50;
  }
  .systemLogo-small img{
    height: 30px;
    width: 30px;
    margin-top: 15px;
    margin-left: 2px;
  }
</style>
