<template>
  <div>
    <el-dialog :title="passwordChangeDialogTitle" :visible.sync="passwordChangeDialogVisible" :before-close="handleClose" class="passwordChangeDialogDiv">
      <el-form ref="passwordChangeForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 500px; margin-left:30px;">
        <el-form-item :label="$t('navbar.oldPassword')" prop="oldPassword">
          <el-input v-model="temp.oldPassword" :type="passwordType" auto-complete="off" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item :label="$t('navbar.newPassword')" prop="newPassword">
          <el-input v-model="temp.newPassword" :type="passwordType" auto-complete="off" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmPassword')" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" :type="passwordType" auto-complete="off" placeholder="请再次输入新密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-left: -15px;" @click="changePassword">{{ $t('navbar.confirm') }}</el-button>
        <el-button style="margin-left: 35px;" @click="handleClose">{{ $t('navbar.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { changePassword } from '@/api/welcome'
import md5 from 'js-md5'

export default {
  name: 'PasswordChange',
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      temp: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      passwordChangeDialogTitle: '修改密码',
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    name() {
      return this.$store.getters.name
    },
    passwordChangeDialogVisible() {
      return this.$store.getters.passwordChangeDialogVisible
    }
  },
  watch: {
    passwordChangeDialogVisible: function() {
      if (!this.passwordChangeDialogVisible) {
        this.$refs['passwordChangeForm'].resetFields()
      }
    }
  },
  methods: {
    handleClose() {
      this.$store.dispatch('togglePasswordChangeDialog')
    },
    changePassword() {
      this.$refs['passwordChangeForm'].validate((valid) => {
        if (valid) {
          var data = {
            userid: this.$store.getters.currentUser.id,
            oldpassword: md5(this.temp.oldPassword),
            newpassword: md5(this.temp.newPassword),
            confirmnewpassword: md5(this.temp.confirmPassword)
          }
          changePassword(data).then(response => {
            if (response.data.code === 0) {
              this.reset()
              this.$store.dispatch('togglePasswordChangeDialog')
              this.$message({
                message: '密码修改成功，3秒后将退出，请重新登录',
                type: 'success'
              })
              setTimeout(this.logout, 3000)
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        }
      })
    },
    reset() {
      this.temp = {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      }
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>
<style>
  .dialog-footer{
    text-align: center;
  }
  .passwordChangeDialogDiv div{
    width: 500px;
    line-height: 20px;
  }
  .passwordChangeDialogDiv input.el-input__inner {
    width: 250px;
  }
  .passwordChangeDialogDiv span.el-dialog__title {
    font-size: 20px;
    color: #000033;
  }
  .passwordChangeDialogDiv label.el-form-item__label{
    font-size: 16px;
    color: #666666;
  }
</style>
