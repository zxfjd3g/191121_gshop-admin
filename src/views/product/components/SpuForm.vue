<template>
  <el-form label-width="120px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        :file-list="spuImageList"
        :action="$BASE_PATH + '/admin/product/fileUpload'"
        list-type="picture-card"
        :on-success="handlePictureSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select value="">
        <el-option label="A" value="1"></el-option>
        <el-option label="B" value="2"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>

      <el-table border style="margin: 20px 0">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
            <hint-button title="删除SPU" type="danger" size="mini" icon="el-icon-delete"></hint-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',

  props: {
    visible: Boolean
  },

  data() {
    return {
      dialogImageUrl: '', // 大图的url
      dialogVisible: false, // 是否显示大图的dialog
      spuId: null,
      spuInfo: {
        category3Id: '',  // 第三级分类id
        spuName: '',
        description: '',
        tmId: '',
        spuSaleAttrList: [],
        spuImageList: []
      },
      spuImageList: [],  // spu图片数组
      trademarkList: [],
      saleAttrList: [],
    };
  },

  methods: {

    /* 
    初始化请求加载更新界面需要的所有数据  ==> 由父组件主动调用
    1). 根据spuId请求获取spuInfo  spu.get(spuId)
		2). 根据spuId请求获取spuImageList  sku.getSpuImageList (spuId)
		3). 获取所有品牌的列表trademarkList trademark.getList()
		4). 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    initLoadUpdateData(spuId) {
      console.log('请求加载更新界面需要的数据')
      this.spuId = spuId

      this.getSpuInfo()
      this.getSpuImageList()
      this.getTrademarkList()
      this.getSaleAttrList()
    },

    /* 
    初始化请求加载添加界面需要的所有数据  ==> 由父组件主动调用
    1). 获取所有品牌的列表trademarkList trademark.getList()
		2). 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    initLoadAddData () {
      this.getTrademarkList()
      this.getSaleAttrList()
    },

    /* 
    1). 根据spuId请求获取spuInfo  spu.get(spuId)
    */
    async getSpuInfo () {
      const result = await this.$API.spu.get(this.spuId)
      const spuInfo = result.data
      this.spuInfo = spuInfo
    },

    /* 
    2). 根据spuId请求获取spuImageList  sku.getSpuImageList (spuId)
    */
    async getSpuImageList () {
      const result = await this.$API.sku.getSpuImageList(this.spuId)
      const spuImageList = result.data
      /* 
      请求返回的数据结构
        {
            "id": 333,
            "spuId": 26,
            "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
        }
      upload组件需要的数据结构:
        {
          name: 'food.jpg', 
          url: 'https://xxx.cdn.com/xxx.jpg'
        }
      */
      spuImageList.forEach(item => {
        item.name = item.imgName
        item.url = item.imgUrl
      })

      this.spuImageList = spuImageList
    },

    /* 
    3). 获取所有品牌的列表trademarkList trademark.getList()
    */
    async getTrademarkList () {
      const result = await this.$API.trademark.getList()
      const trademarkList = result.data
      this.trademarkList = trademarkList
    },
    /* 
    4). 获取所有销售属性的列表saleAttrList spu.getSaleAttrList()
    */
    async getSaleAttrList () {
      const result = await this.$API.spu.getSaleAttrList()
      const saleAttrList = result.data
      this.saleAttrList = saleAttrList
    },

    /* 
    取消 ==> 显示列表页面
    */
    cancel () {
      this.$emit('update:visible', false)
    },

    /* 
     on-success: 指定上传成功后的回调函数
     res: 请求返回的响应体
     file: 上传的图片文件对象
     fileList: 所有已上传的图片文件对象的数组
    */
    handlePictureSuccess(res, file, fileList) {
      console.log('handleAvatarSuccess', res, file, fileList)
      // 保存所有已上传的图片列表(原有的 + 刚上传成功的)
      this.spuImageList = fileList
    },

    /* 
    删除图片的回调函数
    file: 删除的图片文件对象
    fileList: 所有已上传的图片文件对象的数组
    */
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList);
      // 保存所有已上传的图片列表(原有的 + 刚上传成功的)
      this.spuImageList = fileList
    },
    
    /* 
    点击预览大图的回调
    */
    handlePictureCardPreview(file) {
      // 指定大图的url
      this.dialogImageUrl = file.url;
      // 显示dialog
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
