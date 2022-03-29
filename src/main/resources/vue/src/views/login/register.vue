<template>
  <div>
    <div class="register-container">
      <div class="title-container">
        <div class="title">{{ $t('login.sysname') }}</div>
      </div>
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="register-form-div" style="padding-right: 100px;">
              <div class="register-form-container">
                <div class="register-title">免费注册</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item>
                <span class="svg-container">
                  <span class="required"> * </span>医院
                </span>
                <el-select v-model="registerForm.custid" placeholder="请选择医院" @change="getDepts">
                  <el-option v-for="item in select.orgs" :key="item.id" :label="item.orgname" :value="item.orgcode" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item>
                <span class="svg-container">
                  <span class="required"> * </span>所属科室
                </span>
                <select-tree :options="select.depts" v-model="registerForm.deptid" :props="defaultProps" placeholder="请选择科室" clearable class="depts" style="width: 200px;" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="name">
                <span class="svg-container">
                  <span class="required"> * </span>姓名
                </span>
                <el-input v-model="registerForm.name" placeholder="请输入姓名" auto-complete="on" clearable/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="sex">
                <span class="svg-container">
                  <span class="required"> * </span>性别
                </span>
                <el-radio-group v-model="registerForm.sex">
                  <el-radio label="1" >男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="idnumber">
                <span class="svg-container">
                  <span class="required"> * </span>身份证号码
                </span>
                <el-input v-model="registerForm.idnumber" placeholder="请输入身份证号码" maxlength="18" auto-complete="on" clearable/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="edudegreecode">
                <span class="svg-container">
                  <span class="required"> * </span>学位
                </span>
                <el-select v-model="registerForm.edudegreecode" placeholder="请选择学位" clearable>
                  <el-option v-for="item in select.xws" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="proqualificationcode">
                <span class="svg-container">
                  <span class="required"> * </span>职称
                </span>
                <el-select v-model="registerForm.proqualificationcode" placeholder="请选择职称" clearable @change="changeRole">
                  <el-option v-for="item in select.zcs" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="rolecode">
                <span class="svg-container">
                  角色
                </span>
                <el-select v-model="registerForm.rolecode" placeholder="请选择角色" clearable>
                  <el-option v-for="item in select.roles" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="phonenumber">
                <span class="svg-container">
                  <span class="required"> * </span>手机号码
                </span>
                <el-input
                  v-model="registerForm.phonenumber"
                  clearable
                  placeholder="请输入手机号码"
                  type="tel"
                  auto-complete="on" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="nursetag" class="registerInput">
                <span class="svg-container">
                  护士
                </span>
                <el-radio-group v-model="registerForm.nursetag">
                  <el-radio label="1" >是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="password_original">
                <span class="svg-container">
                  <span class="required"> * </span>密码
                </span>
                <el-input
                  v-model="registerForm.password_original"
                  :type="passwordType"
                  clearable
                  placeholder="请输入密码"
                  name="password_original"
                  auto-complete="on" />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon icon-class="eye" />
                </span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="password_original2">
                <span class="svg-container">
                  <span class="required"> * </span>确认密码
                </span>
                <el-input
                  v-model="registerForm.password_original2"
                  :type="passwordType"
                  clearable
                  placeholder="请输入确认密码"
                  auto-complete="on" />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon icon-class="eye" />
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="padding-left: 100px;">
              <el-form-item prop="email">
                <span class="svg-container">
                  <span class="required"> * </span>邮箱
                </span>
                <el-input
                  v-model="registerForm.email"
                  placeholder="请输入邮箱"
                  type="email"
                  clearable
                  auto-complete="on" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="padding-right: 100px;">
              <el-form-item prop="checked" style="border: 0;">
                <span class="svg-container">
                  &nbsp;
                </span>
                <span><el-checkbox v-model="registerForm.checked">同意</el-checkbox></span>
                <a @click="openAgreement">注册协议</a>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6" style="text-align: right">
            <el-button :loading="loading" type="primary" @click="handleRegister">注册</el-button>
          </el-col>
          <el-col :span="6" style="text-align: left">
            <el-button :loading="loading" type="info" @click="backLogin">返回登录</el-button>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </el-form>

      <div class="clearfix" />
      <div class="copyright">copyright@2018-2024 By linksoft 版权所有</div>
    </div>

    <el-dialog
      :visible.sync="agreementVisible"
      title="注册协议"
      width="800px">
      <div style="text-indent: 2rem;">
        同意注册协议
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agreementVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
// import { findOrgsList } from '@/api/jcpt/authorManage'
import { getDeptTree, register } from '@/api/login'
import { detailsByDicCode } from '@/api/baseApi'
import SelectTree from '@/components/SelectTree'
import md5 from 'js-md5'
export default {
  name: 'Register',
  components: { SelectTree },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码！'))
      } else if (value !== this.registerForm.password_original) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 验证手机号
    const isPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码！'))
      }
      var pattern = /^1[345678]\d{9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error('输入的手机号错误！'))
    }
    return {
      defaultProps: {
        children: 'children',
        label: 'nodename',
        parent: 'nodepid',
        value: 'nodeid'
      },
      select: {
        roles: [], // 角色
        orgs: [], // 医院
        xws: [], // 学位
        zcs: [], // 职称
        depts: [] // 科室
      },
      registerForm: {
        name: '',
        password: '',
        password_original: '',
        password_original2: '',
        custid: '',
        needchecktag: 1
      },
      registerRules: {
        name: [{ required: true, trigger: 'blur', message: '姓名不能为空！' }],
        password_original: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位！' }
        ],
        password_original2: [{ required: true, trigger: 'blur', validator: validatePass2 }],
        idnumber: [
          { required: true, trigger: 'blur', message: '身份证号码不能为空！' },
          { type: 'string', min: 18, max: 18, message: '身份证位数不对！', trigger: 'blur' }
        ],
        custid: [{ required: true, trigger: 'blur', message: '请选择医院！' }],
        deptid: [{ required: true, trigger: 'blur', message: '请选择科室！' }],
        edudegreecode: [{ required: true, trigger: 'blur', message: '请选择学位！' }],
        proqualificationcode: [{ required: true, trigger: 'blur', message: '请选择职称！' }],
        phonenumber: [
          { required: true, message: '请输入手机号！', trigger: 'blur' },
          { type: 'string', min: 11, max: 11, message: '手机号位数不对！', trigger: 'blur' },
          { validator: isPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱！', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确！', trigger: 'blur' }
        ],
        checked: [
          { required: true, message: '请同意注册协议！', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false,
      agreementVisible: false,
      roles: {
        kyfzr: [{ rolecode: 'kyfzr', needchecktag: '1' }],
        kyms: [{ rolecode: 'kyfzr', needchecktag: '0' }, { rolecode: 'kyms', needchecktag: '1' }],
        zj: [{ rolecode: 'kyfzr', needchecktag: '0' }, { rolecode: 'zj', needchecktag: '1' }]
      },
      roleCodes: [
        [{ code: 'kyfzr', name: '科研负责人' }, { code: 'kyms', name: '科研秘书' }, { code: 'zj', name: '评审专家' }],
        [{ code: 'kyfzr', name: '科研负责人' }, { code: 'kyms', name: '科研秘书' }]
      ]
    }
  },
  created() {
    this.getOrgList()
    const _this = this
    this.getDic('xw', function(resp) {
      _this.select.xws = resp
    })
    this.getDic('zcdj', function(resp) {
      _this.select.zcs = resp
    })
  },
  methods: {
    getDic(dicCode, fun) {
      detailsByDicCode(dicCode).then(resp => {
        if (resp.code === 0) {
          fun(resp.data)
        } else {
          this.$message({ type: 'error', message: resp.msg })
        }
      })
    },
    getDepts() {
      const custom = this.registerForm.custid
      getDeptTree(custom).then(resp => {
        if (resp.code === 0) {
          this.select.depts = resp.data
        } else {
          this.$message({
            type: 'error',
            message: resp.msg
          })
        }
      })
    },
    getOrgList() {
      /* findOrgsList(null, null, 0).then(response => {
        if (response.code === 0) {
          this.select.orgs = response.data.rows
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })*/
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    changeRole() {
      const zc = this.registerForm.proqualificationcode
      if (zc === 'ZG' || zc === 'FG') {
        this.select.roles = this.roleCodes[0]
      } else {
        this.select.roles = this.roleCodes[1]
      }
    },
    handleRegister() {
      // 注册
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.registerForm)
          data.password = md5(this.registerForm.password_original)
          data.roles = this.roles[this.registerForm.rolecode]
          data.needchecktag = 1

          delete data.password_original
          delete data.password_original2
          delete data.checked
          register(data).then(resp => {
            if (resp.code === 0) {
              this.$message({ type: 'success', message: '注册成功！' })
              this.backLogin()
            } else {
              this.$message({ type: 'error', message: resp.msg })
            }
          })
        }
      })
    },
    backLogin() {
      const loginPath = window.localStorage.getItem(this.$LOGIN_PATH)
      this.$router.push({
        path: loginPath
      })
    },
    openAgreement() {
      this.agreementVisible = true
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss">
  .el-dialog--center .el-dialog__body {
    text-align: center;
    padding: 25px 25px 30px;
  }

  .register-container .el-input input::first-line {
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

  $bg:#FFFFFF;
  $light_gray:#999;
  $cursor: #999;

  * {
    font-family: "Microsoft YaHei" !important;
  }

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
      color: $cursor;

      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .register-container {
    .el-input {
      display: inline-block;
      height: 25px;
      width: 85%;

      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        /*padding: 12px 5px 12px 15px;*/
        color: #999999;
        height: 25px;
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
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#fff;
  $block_gray:#000;

  .register-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("/images/login-bg.png") no-repeat;
    background-position: center;
    background-size: 100% 700px;

    .register-form {
      position: absolute;
      top:45%;
      right: 0;
      width: 1000px;
      height: 660px;
      max-width: 100%;
      margin: -270px auto auto auto;
      background: url("/images/login-login.png") no-repeat;
      background-size: 100% 100%;
      .register-form-div {
        padding: 30px 0 0 100px;
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
      color: $dark_gray;
      vertical-align: middle;
      width: 22%;
      display: inline-block;
      .required {
        color: red;
      }
    }
    .svg-container + * {
      width: 75%;
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

    .register-form-container {
      position: relative;

      .register-title {
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

  }
</style>
<style>
  .el-input__suffix {
    right: -55px !important;
  }
  .depts .el-input{
    width: 200px;
  }
  .el-form-item__content{
    height: 40px !important;
    line-height: normal !important;
  }
</style>
