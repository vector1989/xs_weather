<template>
  <div class="login-container">
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" title="请选择角色" center @close="close">
      <el-button v-for="item in roles" :key="item.id" type="primary" @click="submitUserAndRole(item)">{{ item.rolename
      }}
      </el-button>
    </el-dialog>
    <div class="title-container">
      <div class="title">{{ $t('login.sysname') }}</div>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">

      <div class="login-form-div">
        <!--<div class="login-form-container" style="text-align: right;">
          <a class="register" @click="register">我要注册</a>
        </div>-->
        <div class="login-form-container">
          <div class="login-title">{{ $t('login.title') }}</div>
        </div>
        <el-form-item>
          <span class="svg-container">
            <img src="/images/login-account.png">
          </span>
          <el-select v-model="loginForm.custid" placeholder="请选择机构" style="width:85%;" @change="changeOrg">
            <el-option v-for="item in orgs" :key="item.id" :label="item.orgname" :value="item.orgcode" />
          </el-select>
        </el-form-item>
        <el-form-item prop="loginname">
          <span class="svg-container">
            <img src="/images/login-account.png">
          </span>
          <el-input
            v-model="loginForm.loginname"
            :placeholder="$t('login.username')"
            name="loginname"
            type="text"
            auto-complete="on"
            unselectable=""/>
        </el-form-item>
        <el-form-item prop="password_original">
          <span class="svg-container">
            <img src="/images/login-pwd.png">
          </span>
          <el-input
            v-model="loginForm.password_original"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password_original"
            auto-complete="on"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
        <el-form-item prop="verificationcode" class="loginInput">
          <span class="svg-container">
            <img src="/images/login-check.png">
          </span>
          <el-input
            v-model="loginForm.verificationcode"
            :placeholder="$t('login.verifyCode')"
            name="verificationcode"
            type="text"
            auto-complete="on"/>
          <a @click="refreshCode"><img :src="verifyUrl" class="verify-img"></a>
          <a type="text" class="change-verify-code" @click="refreshCode">换一张</a>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="btn-submit"
            @click.native.prevent="handleLogin"
            @keyup.enter="handleLogin">{{ $t('login.logIn') }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="clearfix"/>
    <div class="copyright">copyright@2018-2024 By linksoft 版权所有</div>
  </div>
</template>
<script>
import { findOrgsList } from '@/api/login'
import { isvalidUsername } from '@/utils/validate'
import { verificationCode } from '@/api/login'
import { setToken } from '@/utils/auth' // getToken from cookie
import md5 from 'js-md5'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    // 验证码自定义验证规则
    const validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      checkRoleData: {
        custid: '',
        userid: '',
        loginname: '',
        name: '',
        rolecode: '',
        rolename: ''
      },
      dialogFormVisible: false,
      userid: '',
      roles: [],
      orgs: [],
      loginForm: {
        loginname: '',
        password: '',
        password_original: '',
        verificationcode: '',
        temp_token: '',
        custid: ''
      },
      loginRules: {
        loginname: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password_original: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        verificationcode: [{
          required: true,
          trigger: 'blur',
          validator: validateVerifyCode
        }]
      },
      verifyUrl: '',
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    findOrgsList(null, null, 0).then(response => {
      if (response.code === 0) {
        this.orgs = response.data
        if (this.orgs) {
          this.loginForm.custid = this.orgs[0].orgcode
          this.changeOrg(this.loginForm.custid)
        }
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    })
    window.localStorage.clear()
    let loginPathHash = window.location.hash
    loginPathHash = loginPathHash.substring(1)
    window.localStorage.setItem(this.$LOGIN_PATH, loginPathHash)
    this.refreshCode()
  },
  destroyed() {
  },
  mounted() {
    this.refreshCode()
  },
  methods: {
    close() {
      setToken('')
    },
    changeOrg(orgCode) {
      this.orgs.forEach(org => {
        if (org.orgcode === orgCode) {
          localStorage.setItem('orgName', org.orgname)
          // document.getElementsByTagName('title')[0].innerText = org.orgname + '科研管理系统'
        }
      })
    },
    submitUserAndRole(role) {
      const roleid = role.id
      this.checkRoleData.rolecode = role.rolecode
      this.checkRoleData.rolename = role.rolename

      this.$store.dispatch('CheckRole', this.checkRoleData).then((response) => {
        this.$store.dispatch('SetCurrentRole', role)
        window.localStorage.setItem('currentRole', JSON.stringify(role))
        const queryUserInfo = {
          'userid': this.userid,
          'roleid': roleid
        }
        this.$store.dispatch('getTreeByRoleidAndUserid', queryUserInfo).then(() => {
          this.loading = false
          this.changeStyle(this.$store.getters.style)
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
    },
    refreshCode() {
      verificationCode().then(response => {
        if (response.code === 0) {
          var dd = response.data
          this.verifyUrl = 'data:image/jpg;base64,' + dd.image_base64
          this.loginForm.temp_token = dd.temp_token
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = false
          const pass = this.loginForm.password_original
          const formData = Object.assign({}, this.loginForm)
          formData.password = md5(pass)
          this.$store.dispatch('LoginByUsername', formData).then((response) => {
            response = response.data
            if (JSON.stringify(response.user) !== '{}') {
              if (response.roles.length !== 0) {
                this.roles = response.roles
                this.$store.dispatch('SetUserRoles', this.roles)
                window.localStorage.setItem('userRoles', JSON.stringify(this.roles))
                this.userid = response.user.id
                this.checkRoleData.custid = response.user.custid
                this.checkRoleData.userid = response.user.id
                this.checkRoleData.loginname = response.user.loginname
                this.checkRoleData.name = response.user.name
                if (this.roles.length === 1) {
                  this.submitUserAndRole(this.roles[0])
                  return false
                }
                this.dialogFormVisible = true
              } else {
                this.$message({
                  message: '用户存在但并未分配角色',
                  type: 'error'
                })
              }
            } else {
              this.$message({
                message: '用户名或密码不正确',
                type: 'error'
              })
            }
          }).catch((err) => {
            this.$message({
              message: err.msg,
              type: 'error'
            })
            this.refreshCode()
            this.loginForm.verificationcode = ''
            this.loading = false
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
    },
    register() {
      this.$router.push({
        path: './register'
      })
    }

  }
}
</script>
<style ref="stylesheet/scss" lang="scss">
  .el-dialog--center .el-dialog__body {
    text-align: center;
    padding: 25px 25px 30px;
  }

  .login-container .el-input input::first-line {
    color: #999999 !important;
  }

  .btn-submit {
    width: 100%;
    margin-top: 18px;
    border-radius: 24px;
    background: #5753f5;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */

  $bg: #FFFFFF;
  $light_gray: #999;
  $cursor: #999;

  * {
    font-family: "Microsoft YaHei" !important;
  }

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;

      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 35px;
      width: 85%;

      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        /*padding: 12px 5px 12px 15px;*/
        color: #999999;
        height: 35px;
        font-size: 16px;
        caret-color: $cursor;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
          width: 280px;
        }
      }
    }

    .el-form-item {
      border: 0;
      background: rgba(0, 0, 0, 0);
      border-radius: 2px;
      color: #454545;
      border-bottom: 1px solid #dfdfdf;
    }

    .copyright {
      text-align: center;
      position: absolute;
      bottom: 50px;
      left: 50%;
      margin-left: -150px;
      color: #999;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #fff;
  $block_gray: #000;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("/images/login-bg.png") no-repeat;
    background-position: center;
    background-size: 100% 550px;

    .login-form {
      position: absolute;
      left: 50%;
      top: 50%;
      right: 0;
      width: 500px;
      height: 540px;
      max-width: 100%;
      margin: -270px auto auto auto;
      background: url("/images/login-login.png") no-repeat;

      .login-form-div {
        padding: 70px;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      margin-right: 5px;
    }

    .title-container {
      position: relative;

      .title {
        position: absolute;
        left: 73px;
        top: 55px;
        font-size: 40px;
        color: $dark_gray;
        text-align: center;
        font-family: "Microsoft YaHei";
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .login-form-container {
      position: relative;

      .login-title {
        left: 73px;
        top: 55px;
        font-size: 23px;
        color: $block_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-family: "Microsoft YaHei";
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }

    .verify-img {
      position: absolute;
      right: 60px;
      bottom: 0;
      height: 33px;
      width: 90px;
    }

    .change-verify-code {
      position: absolute;
      float: right;
      bottom: 0;
      width: 45px;
      right: 0;
      color: #6bce00;
      line-height: 25px;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .loginInput /deep/ .el-form-item__content {
      line-height: 10px !important;
    }
  }
</style>
<style>
  .el-input__suffix {
    right: -55px !important;
  }
</style>
