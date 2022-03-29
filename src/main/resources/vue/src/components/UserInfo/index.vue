<!--
<template>
  <div>
    <el-dialog :title="userInfoDialogTitle" :visible.sync="userInfoDialogVisible" :before-close="handleClose" :top="userInfoDialogTop" class="userInfoDialogDiv" width="500px">
      <el-form ref="userInfoForm" :rules="userInfoRules" :model="userInfoModel" label-position="right" label-width="120px" style="width: 370px; margin-left:30px;">
        <el-form-item :label="$t('authorManage.phonenumber')" prop="phonenumber">
          <el-input v-model="userInfoModel.phonenumber" class="filter-item"/>
        </el-form-item>
        <el-form-item :label="$t('authorManage.name')" prop="name">
          <el-input v-model="userInfoModel.name" class="filter-item"/>
        </el-form-item>
        <el-form-item :label="$t('authorManage.sex')" prop="sex">
          <el-select v-model="userInfoModel.sex" class="filter-item">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('authorManage.proqualificationcode')" prop="proqualificationcode">
          <el-select v-model="userInfoModel.proqualificationcode" class="filter-item">
            <el-option v-for="item in proqualificationcodeOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('authorManage.edudegreecode')" prop="edudegreecode">
          <el-select v-model="userInfoModel.edudegreecode" class="filter-item">
            <el-option v-for="item in edudegreecodeOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('authorManage.nursetag')" prop="nursetag">
          <el-select v-model="userInfoModel.nursetag" class="filter-item">
            <el-option v-for="item in nurseOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('navbar.electronicSignature')" prop="signfileid" style="margin-bottom: -20px;">
          <el-upload
            :action="fileUploadAction"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :data="fileParam"
            :headers="headers"
            class="sign-uploader"
            accept="image/*"
          >
            <img v-if="userInfoModel.signfileid" :src="signImgUrl" class="sign">
            <i v-else class="el-icon-plus sign-uploader-icon"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-left: -15px;" @click="updateData">{{ $t('navbar.confirm') }}</el-button>
        <el-button style="margin-left: 35px;" @click="handleClose">{{ $t('navbar.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { isValidatePhoneNumber } from '@/utils/validate'
// import { getUser, updateUser, getProqualificationcode, getEdudegreecode } from '@/api/jcpt/authorManage'
import { deleteFile } from '@/api/jcpt/fileManage'
import { getToken } from '@/utils/auth'

export default {
  name: 'UserInfo',
  data() {
    const validatePhoneNumber = (rule, value, callback) => {
      if (!isValidatePhoneNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      currentUser: this.$store.getters.currentUser,
      headers: { 'Authorization': 'Bearer ' + getToken() },
      fileUploadAction: /* this.$CONST_BASE_URL.BASE_API_FILESERVER + */'/file/upload',
      imageRadioPrefix: /* this.$CONST_BASE_URL.BASE_API_FILESERVER + */'/file/{id}/download',
      signImgUrl: '',
      fileParam: {
        type: '99',
        filename: ''
      },
      deleteFile: '',
      sexOptions: [{
        value: '1',
        label: '男'
      }, {
        value: '2',
        label: '女'
      }],
      nurseOptions: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      proqualificationcodeOptions: [],
      edudegreecodeOptions: [],
      userInfoModel: {
        id: '',
        name: '',
        sex: '1',
        phonenumber: '',
        proqualificationcode: '',
        edudegreecode: '',
        nursetag: '0',
        signfileid: ''
      },
      userInfoDialogTop: '5vh',
      userInfoDialogTitle: '个人信息',
      userInfoRules: {
        phonenumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        proqualificationcode: [{ required: true, message: '请选择职称', trigger: 'blur' }],
        edudegreecode: [{ required: true, message: '请选择学位', trigger: 'blur' }],
        nursetag: [{ required: true, message: '请选择是否护理', trigger: 'blur' }]
      }
    }
  },
  computed: {
    userInfoDialogVisible() {
      return this.$store.getters.userInfoDialogVisible
    }
  },
  watch: {
    userInfoDialogVisible: function() {
      if (!this.userInfoDialogVisible) {
        this.$refs['userInfoForm'].resetFields()
      } else {
        this.handleUpdate()
      }
    }
  },
  created() {
    // this.getProqualificationcodeOptions()
    // this.getEdudegreecodeOptions()
  },
  methods: {
    getProqualificationcodeOptions() {
      getProqualificationcode().then(response => {
        if (response.data.code === 0) {
          this.proqualificationcodeOptions = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })
    },
    getEdudegreecodeOptions() {
      getEdudegreecode().then(response => {
        if (response.data.code === 0) {
          this.edudegreecodeOptions = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })
    },
    handleClose() {
      this.removeFile()
      this.$store.dispatch('toggleUserInfoDialog')
    },
    handleUpdate() {
      getUser(this.currentUser.id).then(response => {
        if (response.data.code === 0) {
          const user = response.data.data
          this.userInfoModel.id = user.id
          this.userInfoModel.name = user.name
          this.userInfoModel.sex = user.sex
          this.userInfoModel.phonenumber = user.phonenumber
          this.userInfoModel.proqualificationcode = user.proqualificationcode
          this.userInfoModel.edudegreecode = user.edudegreecode
          this.userInfoModel.nursetag = user.nursetag
          this.userInfoModel.signfileid = user.signfileid
          if (user.signfileid) {
            this.signImgUrl = this.imageRadioPrefix.replace('{id}', user.signfileid)
          }
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })
    },
    updateData() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (valid) {
          updateUser(this.userInfoModel).then(response => {
            if (response.data.code === 0) {
              getUser(this.currentUser.id).then(response => {
                if (response.data.code === 0) {
                  delete response.data.data.password
                  this.$store.dispatch('SetCurrentUser', response.data.data)
                  window.localStorage.setItem('currentUser', JSON.stringify(response.data.data))
                } else {
                  this.$message({
                    type: 'error',
                    message: response.data.msg
                  })
                }
              })
              this.handleClose()
              this.$message({
                message: '更新成功',
                type: 'success'
              })
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
    handleBeforeUpload(file) {
      if (this.userInfoModel.signfileid) {
        this.deleteFile = this.userInfoModel.signfileid
      }
      this.fileParam.filename = file.name
    },
    handleSuccess(resp, file, fileList) {
      if (resp.code === 0) {
        this.signImgUrl = this.imageRadioPrefix.replace('{id}', resp.data.id)
        this.userInfoModel.signfileid = resp.data.id
      } else {
        this.$message({
          type: 'error',
          message: resp.msg
        })
      }
    },
    removeFile() {
      if (this.deleteFile) {
        deleteFile(this.deleteFile)
      }
    }
  }
}
</script>
<style>
  .dialog-footer{
    text-align: center;
  }
  .userInfoDialogDiv div{
    line-height: 20px;
  }
  .userInfoDialogDiv input.el-input__inner {
    width: 250px;
  }
  .userInfoDialogDiv span.el-dialog__title {
    font-size: 20px;
    color: #000033;
  }
  .userInfoDialogDiv label.el-form-item__label {
    font-size: 16px;
    color: #666666;
  }
  .userInfoDialogDiv div.el-upload {
    text-align: left;
  }
  .userInfoDialogDiv ul.el-upload-list {
    width: 50%;
  }

  .sign-uploader .el-upload {
    width: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .sign-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .sign-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .sign {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
-->
