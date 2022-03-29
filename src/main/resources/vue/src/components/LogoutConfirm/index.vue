<template>
  <div>
    <el-dialog :title="logoutConfirmDialogTitle" :visible.sync="logoutConfirmDialogVisible" :before-close="handleClose" class="logoutConfirmDialogDiv">
      <el-form ref="logoutConfirmForm" label-position="left" label-width="120px" style="width: 500px; margin-left:30px;">
        <el-form-item>
          <img :src="logoutImgUrl" class="logoutConfirmDialogImg"><span class="logoutConfirmDialogSpan">是否注销登录？</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-left: -15px;" @click="logout">{{ $t('navbar.confirm') }}</el-button>
        <el-button style="margin-left: 35px;" @click="handleClose">{{ $t('navbar.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import waves from '@/directive/waves' // Waves directive

export default {
  name: 'LogoutConfirm',
  directives: { waves },
  data() {
    return {
      temp: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      logoutImgUrl: '/images/logout-img.png',
      logoutConfirmDialogTitle: '注销登录'
    }
  },
  computed: {
    logoutConfirmDialogVisible() {
      return this.$store.getters.logoutConfirmDialogVisible
    }
  },
  methods: {
    handleClose() {
      this.$store.dispatch('toggleLogoutConfirmDialog')
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
  .logoutConfirmDialogDiv div{
    width: 500px;
    line-height: 20px;
  }
  .logoutConfirmDialogDiv input.el-input__inner {
    width: 250px;
  }
  .logoutConfirmDialogDiv span.el-dialog__title {
    font-size: 20px;
    color: #000033;
  }
  .logoutConfirmDialogDiv label.el-form-item__label{
    font-size: 16px;
    color: #666666;
    text-align: right;
  }
  .logoutConfirmDialogSpan{
    margin-left: 11px;
    font-size: 20px;
    color: #333333;
    vertical-align:middle;
  }
  .logoutConfirmDialogImg{
    width: 36px;
    height: 36px;
    vertical-align:middle;
  }
</style>
