<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <!--    <user-info/>-->
    <password-change/>
    <logout-confirm/>
    <div style="float: left;">
      {{ orgname }}
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <span
              v-for="item in styleList"
              v-if="item.code === style.code"
              :key="item.code"
              style="margin-left: 14px;display:inline-block;">{{ item.name }}</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in styleList" :key="item.code">
              <span style="display: inline-block;" @click="changeStyle(item)">{{ item.name }}</span>
            </el-dropdown-item>
            <!--<el-dropdown-item>
              <span style="display: inline-block;" @click="changeStyle(1)">简约模式</span>
            </el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <span style="margin-left: 14px;display:inline-block;">{{ currentRole.rolename }}</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in userRoles" :key="item.id">
              <span style="display: inline-block;" @click="changeUserRole(item)">{{ item.rolename }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img src="/images/admin-nav.png" style="width: 30px; height: 30px;vertical-align:middle;" class="user-avatar">
            <span style="margin-left: 14px;display:inline-block;">{{ currentUser.name }}<span v-if="currentUser.deptname">({{ currentUser.deptname }})</span></span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <!--<router-link to="/">-->
            <el-dropdown-item>
              <img src="/images/user-info.png" style="width: 16px; height: 16px;vertical-align:middle; display: inline-block;" class="user-avatar">
              <span style="display: inline-block; margin-left: 7px;" @click="toggleUserInfoDialog">{{ $t('navbar.userInfo') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <img src="/images/password-change.png" style="width: 16px; height: 16px;vertical-align:middle; display: inline-block;" class="user-avatar">
              <span style="display: inline-block; margin-left: 7px;" @click="togglePasswordChangeDialog">{{ $t('navbar.changePassword') }}</span>
            </el-dropdown-item>
            <!--</router-link>-->
            <el-dropdown-item divided>
              <img src="/images/logout-drop-down-list.png" style="width: 16px; height: 16px;vertical-align:middle; display: inline-block;" class="user-avatar">
              <span style="display: inline-block; margin-left: 7px;" @click="toggleLogoutConfirmDialog">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-if="!style.loadRouter" style="float: right;" class="right-menu-item">
          <a href="javascript:void(0)" @click="changeStyle(style)">
            <img src="/images/close.png" style="width: 22px; height: 24px;">
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import UserInfo from '@/components/UserInfo'
import PasswordChange from '@/components/PasswordChange'
import LogoutConfirm from '@/components/LogoutConfirm'

export default {
  components: {
    Hamburger,
    UserInfo,
    PasswordChange,
    LogoutConfirm
  },
  data() {
    return {
      userInfoDialogVisible: false,
      passwordChangeDialogVisible: false,
      checkRoleData: {
        custid: this.$store.getters.currentUser.custid,
        userid: this.$store.getters.currentUser.id,
        loginname: this.$store.getters.currentUser.loginname,
        name: this.$store.getters.currentUser.name,
        rolecode: '',
        rolename: ''
      },
      orgname: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device',
      'currentRole',
      'userRoles',
      'style',
      'styleList',
      'currentUser'
    ])
  },
  created() {
    this.orgname = localStorage.getItem('orgName')
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // logout() {
    //   this.$store.dispatch('LogOut').then(() => {
    //     location.reload()// In order to re-instantiate the vue-router object to avoid bugs
    //   })
    // },
    toggleUserInfoDialog() {
      this.$store.dispatch('toggleUserInfoDialog')
    },
    togglePasswordChangeDialog() {
      this.$store.dispatch('togglePasswordChangeDialog')
    },
    toggleLogoutConfirmDialog() {
      this.$store.dispatch('toggleLogoutConfirmDialog')
    },
    changeUserRole(role) {
      const roleid = role.id
      this.checkRoleData.rolecode = role.rolecode
      this.checkRoleData.rolename = role.rolename
      this.$store.dispatch('CheckRole', this.checkRoleData).then((response) => {
        this.$store.dispatch('SetCurrentRole', role)
        window.localStorage.setItem('currentRole', JSON.stringify(role))
        const queryUserInfo = {
          'userid': this.$store.getters.currentUser.id,
          'roleid': roleid
        }
        this.$store.dispatch('getTreeByRoleidAndUserid', queryUserInfo).then(() => {
          this.changeStyle(this.style)
        })
      })
    },
    async changeStyle(item) {
      const _that = this
      this.$store.dispatch('SetStyle', item)
      window.localStorage.setItem('style', JSON.stringify(item))
      let src = '/' + item.code
      if (item.loadRouter) { // 需要重新加载路由
        await this.$store.dispatch('GetUserInfo').then(async res => { // 拉取user_info
          const roles = res // note: roles must be a array! such as: ['editor','develop']
          const resources = this.$store.getters.resources
          await this.$store.dispatch('GenerateRoutes', { roles, resources }).then(async() => {
            await this.$router.addRoutes(this.$store.getters.addRouters)
            const routers = this.$store.getters.addRouters
            if (routers[0] && routers[0].path) {
              src = routers[0].path
            }
            try {
              _that.getChildRouters(routers)
            } catch (e) {
              src = e.message
            }
          })
        })
      }
      this.$router.push({
        path: src,
        query: {
          t: +new Date() // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      })
    },
    getChildRouters(routers) {
      const _that = this
      routers.forEach((node) => {
        if (node.children && node.children.length > 0) {
          _that.getChildRouters(node.children)
        } else {
          throw new Error(node.path)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 60px;
    float: left;
    padding: 5px 10px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    /*width: 15%;*/
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 5px 8px;
      float: left;
    }
    .avatar-container {
      height: 60px;
      margin-right: 30px;
      .avatar-wrapper {
        vertical-align:middle;
        cursor: pointer;
        margin-top: -6px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
