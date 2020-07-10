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
        multiple
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
      <el-select v-model="attrIdAttrName" :placeholder="unusedSaleAttrList.length>0 ? `还有${unusedSaleAttrList.length}未使用`: '没有啦'">
        <el-option :label="attr.name" :value="attr.id +':' + attr.name" v-for=" attr in unusedSaleAttrList"
          :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAttrName" 
        @click="addSpuSaleAttr">添加销售属性</el-button>

      <el-table border style="margin: 20px 0" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName" width="150"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{row, $index}">
            <!-- 
              {
                "id": 133,
                "spuId": 26,
                "baseSaleAttrId": 2,
                "saleAttrName": "选择版本",
                "spuSaleAttrValueList": [
                  {
                    "id": 225,
                    "spuId": 26,
                    "baseSaleAttrId": 2,
                    "saleAttrValueName": "aa",
                    "saleAttrName": "选择版本",
                    "isChecked": null
                  }
                ]
              }
             -->
            <el-tag
              :key="attrValue.id"
              v-for="(attrValue, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
              {{attrValue.saleAttrValueName}}
            </el-tag>

            <el-input
              class="input-new-tag"
              v-if="row.edit"
              :ref="$index"
              size="small"
              placeholder="名称"
              v-model="row.saleAttrValueName"
              @keyup.enter.native="handleInputConfirm(row, $index)"
              @blur="handleInputConfirm(row, $index)"
            >
            <!-- v-model内部会自动给row添加一个新属性, 且是响应式的 -->
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row, $index)">+ 添加</el-button>
            <!-- @click="showInput" -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{row, $index}">
            <el-popconfirm
              title="确定删除吗?"
              @onConfirm="spuInfo.spuSaleAttrList.splice($index, 1)"
            >
              <hint-button slot="reference" title="删除SPU" type="danger" size="mini" icon="el-icon-delete"></hint-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
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
      attrIdAttrName: '', // 选择的销售属性的id与name组合:    id:name
    }
  },

  computed: {
    /* 
    还未使用的销售属性列表
    相关数据1: 所有销售属性列表 saleAttrList
				[
				  {
				    "id": 1,
				    "name": "选择颜色"
				  },
				  {
				    "id": 2,
				    "name": "选择版本"
				  },
				  {
				    "id": 3,
				    "name": "选择套装"
				  }
				]
			相关数据2: spu中已有销售属性列表 spuInfo.spuSaleAttrList
				{
					"saleAttrName": "选择版本",
				}
    */
    unusedSaleAttrList () {
      const {saleAttrList} = this
      const {spuSaleAttrList} = this.spuInfo

      // 对saleAttrList过滤产生
      return saleAttrList.filter(attr => {
        // 在spuSaleAttrList查找看有没有一个对就的对象
        const used = spuSaleAttrList.some(spuAttr => spuAttr.saleAttrName===attr.name)
        // 要留下是未使用的
        return !used
      })
    }
  },

  methods: {

    /* 
    重置数据
    */
    resetData () {
      this.dialogImageUrl = '' // 大图的url
      this.dialogVisible = false // 是否显示大图的dialog
      this.spuId = null
      this.spuInfo = {
        category3Id: '',  // 第三级分类id
        spuName: '',
        description: '',
        tmId: '',
        spuSaleAttrList: [],
        spuImageList: []
      }
      this.spuImageList = []  // spu图片数组
      this.trademarkList = []
      this.saleAttrList = []
      this.attrIdAttrName = '' // 选择的销售属性的id与name组合:    id:name
    },

    /* 
    请求保存SPU信息
    */
    async save () {

      // 得到参数数据
      const {spuInfo, spuImageList} = this

      // 整理1: spuInfo.spuImageList
      /* spuImageList
      从后台获取的图片文件对象的结构
			{
			    "id": 333,
			    "spuId": 26,
			    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
				 "name": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
				 "url":  "http://47.93.148.192:8080/xxx.jpg"
			}
		新上传的图片文件对象的结构
			{
				name: "e814ec6fd86c5a8c.jpg"
				response: {
					data: "http://182.92.128.115:8080/group1/xxx.jpg"
				}
				url: "blob:http://localhost:9529/a5199d82-0811-442d-9ec2-dafae83d9ed9"
			}
		提交保存/更新SPU请求的图片对象的结构(目标):
			 {
			    "imgName": "下载 (1).jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			 }
      */
      spuInfo.spuImageList = spuImageList.map((item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.imgUrl 
      })))

      // 整理2: SPU销售属性列表 spuSaleAttrList
      /* 
      过滤掉没有属性值的属性对象
      删除一些不必要的属性数据(为了界面显示而添加: saleAttrValueName/edit)
      */
     spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(attr => {
       delete attr.saleAttrValueName
       delete attr.edit
       return attr.spuSaleAttrValueList.length>0
     })

      
      // 发添加/更新的请求
      const result = await this.$API.spu.addUpdate(spuInfo)

      // 保存成功
      this.resetData()
      this.$message.success(result.meessage || '保存SPU成功')
      // 显示列表页面
      this.$emit('update:visible', false)
      // 分发自定义事件通知父组件保存成功了
      this.$emit('success')
    },

    /* 
    取消 ==> 显示列表页面
    */
   cancel () {
     this.resetData()
      this.$emit('update:visible', false)
      // 分发自定义事件通知父组件取消了操作
      this.$emit('cancel')
    },

    /* 
    确定向Spu销售属性值列表中添加一个属性值对象
    */
    handleInputConfirm (spuSaleAttr, index) {
        const {saleAttrValueName, baseSaleAttrId, spuSaleAttrValueList} = spuSaleAttr
        console.log('======', saleAttrValueName, baseSaleAttrId)

        // 条件1: 如果没有输入, 直接变为查看模式
        if (!saleAttrValueName) {
          spuSaleAttr.edit = false
          return 
        }

        // 条件2: 如果输入的与原有的重复了==> 提示不能重复
        const isRepeat = spuSaleAttrValueList.some(value => value.saleAttrValueName===saleAttrValueName)
        if (isRepeat) {
          this.$message.warning('不能重复')
          // 输入框自动获取焦点
          this.$refs[index].focus()
          return
        }


        // 向Spu销售属性值列表中添加一个属性值对象
        spuSaleAttrValueList.push({
          saleAttrValueName,
          baseSaleAttrId,
        })
        // 变为查看模式
        spuSaleAttr.edit = false
        // 清除收集的输入数据
        spuSaleAttr.saleAttrValueName = ''
    },

    /* 
    显示输入框
    */
    showInput (spuSaleAttr, index) {
      // 显示输入框: 给spuSaleAttr对象指定edit属性为true
      if (spuSaleAttr.hasOwnProperty('edit')) { // 有此属性
        spuSaleAttr.edit = true
      } else { // 没有 ==> $set()/set()
        this.$set(spuSaleAttr, 'edit', true)
      }

      // 输入框显示之后 ==> 让输入框自动获得焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    /* 
    添加新的SPU销售属性
    */
    addSpuSaleAttr () {
      // 得到销售属性的id与name
      const [id, name] = this.attrIdAttrName.split(':') // id:name [id,  name]

      // 向spuInfo.spuSaleAttrList数组中添加一个对象
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: id,
        saleAttrName: name,
        spuSaleAttrValueList: []
      })

      // 清除收集的数据
      this.attrIdAttrName = ''
    },

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
    initLoadAddData (category3Id) {
      // 保存category3Id
      this.spuInfo.category3Id = category3Id

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

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>