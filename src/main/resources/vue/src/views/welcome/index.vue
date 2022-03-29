<template>
  <div class="container">
    <!--    <user-info/>-->
    <password-change/>
    <logout-confirm/>
    <div class="el-row up">
      <div class="admin-option">
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
              <span style="display: inline-block;" @click="changeStyle(0)">经典模式</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display: inline-block;" @click="changeStyle(1)">简约模式</span>
            </el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <a>{{ currentRole.rolename }}</a>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in userRoles" :key="item.id">
              <span style="display: inline-block;" @click="changeUserRole(item)">{{ item.rolename }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div>
          <img src="/images/admin.png" >
          <a>{{ name }}</a>
        </div>-->

        <div>
          <el-dropdown class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
              <img src="/images/admin.png" style="width: 30px; height: 30px;vertical-align:middle;" class="user-avatar">
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
        </div>
      </div>
      <div class="up-title">
        <div class="platform-title pull-center">{{ $t('login.sysname') }}</div>
        <div class="title-table-div">
          <el-row :gutter="20" class="displaySlogan">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12"><div class="fast">更方便&nbsp;&nbsp;&nbsp;更快捷</div></el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12"><div class="data">数据分析—高效管理—规范科学</div></el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
        </div>
      </div>
      <div class="nav-div">
        <div class="nav-tabs">
          <a :class="index > 0 ? 'show' : 'hide'" class="tab arrow" @click="prev()">
            <div class="title"><img src="/images/left.png" width="24" height="44" style="margin-top: 46px;"></div>
          </a>
          <a v-for="(p,index) in tempTabList" :key="index" :class="index === currentIndex ? 'active' : ''" class="tab" @click="changeActive(index)">
            <div class="title">{{ p.nodename }}</div>
            <!--<div class="subtitle">{{ p.subtitle }}</div>-->
          </a>
          <a :class="index < tabLists.length ? 'show' : 'hide'" class="tab arrow" @click="next()">
            <div class="title"><img src="/images/right.png" width="24" height="44" style="margin-top: 46px;"></div>
          </a>
        </div>
      </div>
    </div>
    <div class="el-row down" style="overflow:scroll">
      <div v-for="(parent,pIndex) in tempTabList" :key="pIndex" :class="pIndex === currentIndex ? 'show' : 'hide'" class="parent">
        <a v-for="(child,childIndex) in parent.children" :key="childIndex" class="child" @click="redirect(child.nodeattr.path,pIndex,childIndex)">
          <div class="img">
            <img :src="'/images/'+child.nodeicon+'.png'" width="150" height="150">&nbsp;
          </div>
          <div class="tb-title">{{ child.nodename }}&nbsp;</div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import UserInfo from '@/components/UserInfo'
import PasswordChange from '@/components/PasswordChange'
import LogoutConfirm from '@/components/LogoutConfirm'
// import { getResourceTreeByUserId } from '@/api/welcome'

export default {
  name: 'Welcome',
  components: {
    UserInfo,
    PasswordChange,
    LogoutConfirm
  },
  data() {
    return {
      currentIndex: 0,
      currentPIndex: 0,
      passwordChangeDialogVisible: false,
      tabLists: [],
      index: 0,
      tempSize: 4,
      tempTabList: [],
      checkRoleData: {
        custid: this.$store.getters.currentUser.custid,
        userid: this.$store.getters.currentUser.id,
        loginname: this.$store.getters.currentUser.loginname,
        name: this.$store.getters.currentUser.name,
        rolecode: '',
        rolename: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'currentRole',
      'userRoles',
      'currentUser',
      'style',
      'styleList'
    ])
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    // this.tabLists = this.$store.getters.resources
    // this.getResourceByUserId()
    if (location.hash.indexOf(this.style.code) === -1) {
      this.changeStyle(this.style)
    }
    this.getResourceByRoleidAndUserid()
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  mounted() {
    //
  },
  methods: {
    changeActive(index, cIndex) {
      this.currentIndex = index
      let selectNode = this.tempTabList[index]
      const platformNodeId = selectNode.nodeid // 平台id
      if (cIndex !== undefined) {
        selectNode = selectNode.children[cIndex]
      }

      const children = selectNode.children
      const roles = []

      if (selectNode.nodeattr.path) {
        roles.push(selectNode.nodeattr.path)
      }
      this.getRoles(roles, children)
      this.$store.dispatch('setSystemName', selectNode.nodename)
      this.$store.dispatch('SetChildResources', selectNode)
      this.$store.dispatch('SetSubPlatformId', platformNodeId)
      window.localStorage.setItem('userChildResources', JSON.stringify(selectNode))
      window.localStorage.setItem('systemName', JSON.stringify(selectNode.nodename))
      window.localStorage.setItem('subPlatformId', platformNodeId)
      const resources = this.$store.getters.resources
      this.$store.dispatch('ChangeRoles', { roles, resources }).then(() => { // 根据roles权限生成可访问的路由表
        const routerData = this.$store.getters.addRouters
        this.$router.addRoutes(routerData) // 动态添加可访问路由表
      })
    },
    getRoles: function(roles, children) {
      children.forEach((item) => {
        const path = item.nodeattr.path
        roles.push(path)
        if (item.children && item.children.length > 0) {
          this.getRoles(roles, item.children)
        }
      })
    },
    redirect: function(url, pIndex, cIndex) {
      this.changeActive(pIndex, cIndex)
      let selectNode = this.tempTabList[pIndex]
      if (cIndex !== undefined) {
        selectNode = selectNode.children[cIndex]
      }

      // 宗盈增加，如果path是http开头的绝对路径，直接open window，科研暂时这么处理，为了兼容老系统，后面更新到新系统后，这段会删除
      const selectNodePath = selectNode.nodeattr.path
      if (selectNodePath.startsWith('http://') || selectNodePath.startsWith('https://')) {
        window.open(selectNodePath, '_blank')
        return
      }

      const children = selectNode.children
      if (children && children.length > 0) {
        const uri = children[0].nodeattr.path
        this.$router.push({ path: uri })
      } else {
        this.$message({ message: '该应用下无菜单', type: 'error' })
      }
    },
    toggleUserInfoDialog() {
      this.$store.dispatch('toggleUserInfoDialog')
    },
    togglePasswordChangeDialog() {
      this.$store.dispatch('togglePasswordChangeDialog')
    },
    toggleLogoutConfirmDialog() {
      this.$store.dispatch('toggleLogoutConfirmDialog')
    },
    getResourceByRoleidAndUserid() {
      // 直接给资源
      this.tabLists = this.$store.state.user.resources
      this.tabLists.forEach((item, i) => {
        if (item.nodename === '首页') {
          this.tabLists.splice(i, 1)
        }
      })
      this.getTempTabList(1)
    },
    getTempTabList(isLoad) {
      this.tempTabList = []
      this.tabLists.forEach((item, i) => {
        if (i >= this.index && this.tempTabList.length < this.tempSize) {
          if (this.tempTabList.indexOf(item) === -1) {
            this.tempTabList.push(item)
          }
        }
      })
      if (this.tempTabList.length < this.tempSize) {
        this.tabLists.forEach((item) => {
          if (this.tempTabList.length < this.tempSize) {
            if (this.tempTabList.indexOf(item) === -1) {
              this.tempTabList.push(item)
            }
          }
        })
      }
      const subPlatformId = this.$store.getters.subPlatformId
      if (isLoad && subPlatformId) {
        // 判断上次打开的平台是否已存在
        let preIndex = -1
        this.tempTabList.forEach((item, i) => {
          if (item.nodeid + '' === subPlatformId) {
            preIndex = i
          }
        })
        if (preIndex === -1) {
          // 如果数据不存在 进行翻页
          this.next()
        } else {
          this.changeActive(preIndex)
        }
      } else {
        this.changeActive(0)
      }
    },
    prev() {
      //
      if (this.index > 0) {
        this.index--
      } else {
        this.index = this.tabLists.length - 1
      }
      this.getTempTabList()
    },
    next() {
      //
      if (this.index < this.tabLists.length - 1) {
        this.index++
      } else {
        this.index = 0
      }
      this.getTempTabList()
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
  body{font-family: "Microsoft YaHei"}

  .container{
    height: 100%;
    overflow: hidden;
    .up{
      height: 60%;
      min-height: 60%;
      background-image: url("/images/up-bg.png");
      background-size:100% 100%;
      .admin-option{
        text-align: right;
        color: #ffffff;
        font-size: 14px;
        position: absolute;
        top: 20px;
        right: 30px;
        div{
          float: left;
          line-height: 50px;
          margin-right: 20px;
          display:flex;
          align-items: center;//子元素垂直居中
          justify-content: center;//子元素水平居中
          img{
            margin: 10px;
          }
        }
      }
      .nav-div{
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(120, 113, 253, 0.8);
        height: 135px;
      }
      .nav-tabs{
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 1200px;
        color: #ffffff;
        margin-left: -600px;
        .tab{
          float: left;
          width: 250px;
          text-align: center;
          background: transparent;
          height: 135px;
          border-right: 1px solid #979bcd;
          .title{
            /*margin-top: 15px;*/
            font-size: 25px;
            line-height: 135px;
            text-align: center !important;
          }
          /* .subtitle{
            font-size: 18px;
          } */
        }
        /*.tab:fist-child{
          border-left: 1px solid #979bcd;
        }*/
        .tab:last-child{
          border-right: 0;
        }
        .arrow{width: 100px;}
        .tab.active{
          background: #ffffff;
          color: #706bf9;
        }
      }
      .up-title{
        color: #ffffff;
        line-height: 100px;
        letter-spacing: 7px;
        .pull-center{text-align: center;}
        .platform-title{
          font-size: 60px;
          line-height: 60px;
          margin-top: 100px;
          margin-right: 50px;
          font-family: 微软雅黑;
          text-shadow: black 0px 4px 3px;
        }
        .title-table-div{
          margin-top: 2%;
          .displaySlogan{
            display: block;
          }
          @media screen and (max-width: 1600px) {
            .displaySlogan{
              display: none;
            }
          }
        }
        .fast{
          font-size: 56px;
          font-family: CTZhongYuanSJ;
        }
        .data{
          font-size: 35px;
          font-family: CTZhongYuanSJ;
        }
      }
    }
    .down{
      height: 40%;
      min-height: 40%;
      .show{
        display: block;
      }
      .hide{
        display: none;
      }
      .parent{
        margin-left: 105px;
        .child{
          width: 150px;
          margin-left: 120px;
          margin-top: 50px;
          float: left;
          text-align: center;
        }
      }
    }
    .right-menu-item {
      display: inline-block;
      margin: 5px;
      float: left;
    }
    .avatar-container {
      color: #ffffff;
      .avatar-wrapper {
        vertical-align:middle;
        cursor: pointer;
        margin-top: -6px;
        position: relative;
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          font-size: 12px;
        }
      }
    }
  }
  .el-dropdown-menu.el-popper.el-dropdown-menu--Small{
    top: 52px !important;
  }
  .el-row {
    margin-top: 0!important;
  }
</style>
