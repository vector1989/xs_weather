<template>
  <!--考勤组管理列表-->
  <div class="app-container container">
    <el-card class="box-card">
      <el-upload
        class="upload-demo"
        :action="url"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="fileSuccess"
        :file-list="fileList">
        <el-button slot="trigger" size="small" type="primary">上传excel</el-button>
        <el-button size="small" type="primary" @click="downloadFile">下载excel</el-button>
      </el-upload>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      url: '',
      fileList: [
      ]
    };
  },
  created(){
    this.url = this.$CONST_BASE_URL.BASE_API + '/excel'
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    downloadFile(){
      location.href = this.url
    },
    fileSuccess(response, file, fileList){
      this.fileList = fileList
      this.$message.success('文件上传成功！')
    }
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  left: 50%;
  top:50%;
  height: 50%;
  width: 800px;
  /*margin: 10px 10px 0 10px;*/
  padding-top: 5px;
  background-color: white;
  border-radius: 6px;
  transform: translate(-50%, -50%);
}

</style>
