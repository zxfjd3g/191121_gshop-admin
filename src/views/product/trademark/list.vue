<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAdd">添加</el-button>

    <el-table
      style="margin: 20px 0"
      border
      v-loading="loading"
      :data="trademarks">
      
       <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center">
      </el-table-column>
      <!-- 指定prop当前列就显示prop对应的属性值文本 -->
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="180">
      </el-table-column>
      <!-- 如果要显示的是标签结构, 使用作用域插槽传入标签结构 -->
      <el-table-column
        label="品牌LOGO">
         <template slot-scope="{row, $index}">
          <img :src="row.logoUrl" alt="" style="width: 100px;height:60px">
        </template>
      </el-table-column>

      <el-table-column label="操作">
      <template slot-scope="{row, $index}">
        <el-button size="small" type="warning" icon="el-icon-edit">编辑</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
    </el-table>

    <el-pagination
      background
      style="textAlign:center"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChage">
    </el-pagination>

    <el-dialog title="添加" :visible.sync="isShowDialog">
      <el-form :model="form" label-width="120px" style="width: 80%">
        <el-form-item label="品牌名称">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO">
          <!-- 
            action: 用来指定上传图片的接口地址   指定动态的代理前缀路径
            on-success: 指定上传成功后的回调函数
            before-upload: 指定发送上传请求前的回调函数 => 如果函数返回false不提交请求
           -->
          <el-upload
            class="avatar-uploader"
            :action="$BASE_PATH + '/admin/product/fileUpload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过50kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowDialog = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Trademark',

  data() {
    return {
      trademarks:  [], // 当前页品牌数组
      total: 0, // 总数量
      page: 1, // 当前第几页
      limit: 3, // 每页数量
      loading: false, // 是否显示loading

      isShowDialog: false, // 是否显示添加/更新的界面
      form: { // 用于收集添加和更新的品牌信息对象
        tmName: '', // 品牌名称
        logoUrl: '', // 品牌图上url
      },
    }
  },

  async mounted () {
    this.getTrademarks(1)
  },

  methods: {

    /* 
    显示添加界面
    */
    showAdd () {
      this.isShowDialog = true
    },

    /* 
     on-success: 指定上传成功后的回调函数
     res: 请求返回的响应体
     file: 上传的图片文件对象
    */
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res, file)
      // 读取响应数据对象中的图片url数据保存到form对象
      this.form.logoUrl = res.data
    },

    /* 
    指定发送上传请求前的回调函数 => 如果函数返回false不提交请求
    专门用来对要上传文件进行检查限制: 
    大小: <50K
    类型: jpg/png
    */
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type==='image/png'
      const isLt50K = file.size / 1024 <= 50

      if (!isJPGOrPNG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt50K) {
        this.$message.error('上传头像图片大小不能超过 50K!')
      }
      return isJPGOrPNG && isLt50K
    },

    /* 
    异步获取指定页码的分页数据显示
    */
    async getTrademarks (page) {
      // 保存指定页码
      this.page = page
      this.loading = true // 显示loading
      // ajax请求获取分页列表
      const result = await this.$API.trademark.getList(page, this.limit)
      this.loading = false //隐藏loading
      // 取出records和total数据
      const {records, total} = result.data
      // 更新数据
      this.trademarks = records
      this.total = total
    },

    /* 
    当每页数量发生改变的监听回调
    */
    handleSizeChage (pageSize) {
      // 更新每页数量
      this.limit = pageSize
      // 重新获取第1页显示
      this.getTrademarks(1)
    }

    /* 
    当分页的当前页码改变的事件监听回调
    */
    // handleCurrentChange (page) {
    //   // 更新当前页码
    //   // 重新获取列表数据显示
    //   this.getTrademarks(page)
    // }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
