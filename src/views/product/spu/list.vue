<template>
  <div>
    <el-card style="margin-bottom: 20px" v-show="!isShowSkuForm">
      <CategorySelector ref="cs" @categoryChange="handleCategoryChange"/>
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <!-- v-if="$hasBP('spu.add')" -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showAdd">添加SPU</el-button>
      
        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <!-- v-if="$hasBP('sku.add')" -->
              <hint-button title="添加SKU" type="primary" size="mini" icon="el-icon-plus"  
                @click="showSkuAdd(row)"></hint-button>
              <!-- v-if="$hasBP('spu.update')" -->
              <hint-button title="修改SPU" type="primary" size="mini" icon="el-icon-edit"
                @click="showUpdate(row)"></hint-button>
              <!-- v-if="$hasBP('spu.detail')" -->
              <hint-button title="查看SKU" type="info" size="mini" icon="el-icon-info"
                @click="showSkuList(row)"></hint-button>
              <!-- v-if="$hasBP('spu.delete')" -->
              <el-popconfirm title="确定删除吗?" @onConfirm="deleteSpu(row.id)">
                <hint-button slot="reference" title="删除SPU" type="danger" icon="el-icon-delete" size="mini"></hint-button>
              </el-popconfirm>
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
          @current-change="getSpuList"
          @size-change="handleSizeChage">
        </el-pagination>
      </div>

      <SpuForm :visible.sync="isShowSpuForm" ref="spuForm" @success="handleSuccess" @cancel="handleCancel"/>
      <!-- @update:visible="isShowSpuForm=$event" -->

       <SkuForm ref="skuForm" v-show="isShowSkuForm" @cancel="isShowSkuForm=false" 
        :saveSuccess="() => isShowSkuForm=false"></SkuForm>

    </el-card>

    <el-dialog :title="`${spu.spuName} ==> SKU列表`" :visible.sync="isShowDialog">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格(元)"></el-table-column>
        <el-table-column prop="weight" label="重置(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row, $index}">
            <el-image :src="row.skuDefaultImg" style="width: 100px;height: 100px;" lazy></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
import SkuForm from '../components/SkuForm'
export default {
  name: 'SpuList',

  data () {
    return {
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,
      category1Id: null,
      category2Id: null,
      category3Id: null,
      isShowSpuForm: false,

      isShowSkuForm: false, 

      spu: {},
      skuList: [],
      isShowDialog: false,
      loading: false
    }
  },

  mounted () {
    // 为了方便测试
    // this.category1Id = 1
    // this.category2Id = 3
    // this.category3Id = 61
    // this.getSpuList()
  },

  methods: {

    /* 
    删除指定ID的SPU
    */
    async deleteSpu (spuId) {
      const result = await this.$API.spu.remove(spuId)
      this.$message.success(result.message || '删除成功')
      this.getSpuList()
    },

    /* 
    显示SKU添加的表单界面
    */
    showSkuAdd (spu) {
      this.isShowSkuForm = true

      spu = {...spu} // 对spu进行浅拷贝, 以免更新列表中数据对象
      spu.category1Id = this.category1Id
      spu.category2Id = this.category2Id

      // 让skuForm去请求加载初始显示需要的数据
      this.$refs.skuForm.initLoadAddData(spu)
    },

    /* 
    显示指定spu的sku列表
    */
    async showSkuList (spu) {
      this.spu = spu
      
      // 显示dialog
      this.isShowDialog = true
      // 重置sku列表数据
      this.skuList = []

      this.loading = true
      try {
        // 请求获取数据列表并显示
        const result = await this.$API.sku.getListBySpuId(spu.id)
        this.loading = false
        this.skuList = result.data
      } catch (error) { // 请求失败也隐藏loading界面
        this.loading = false
      }
    },

    /* 
    处理自定义的保存成功的事件回调
    */
    handleSuccess () {
      // 重新获取分页列表   添加 1, 修改 当前页
      this.getSpuList(this.spuId ? this.page : 1)
      // 重置标识
      this.spuId = null
    },

    /* 
    处理自定义的取消SPU操作的回调
    */
    handleCancel () {
      // 重置标识
      this.spuId = null
    },

    /* 
    显示SPU修改界面
     {
      "id": 26,
      "spuName": "aa",
      "description": "aaaa",
      "category3Id": 61,
      "tmId": 1,
      "spuSaleAttrList": null,
      "spuImageList": null
    }
    */
    showUpdate (spu) {
      // 保存一个标识更新的数据
      this.spuId = spu.id

      // 显示更新的界面
      this.isShowSpuForm = true
      this.$refs.spuForm.initLoadUpdateData(spu.id)
    },

    /* 
    显示SPU的添加界面
    */
    showAdd () {
      // 显示添加的界面
      this.isShowSpuForm = true
      this.$refs.spuForm.initLoadAddData(this.category3Id)
    },

    /* 
    选择某个分类的监听回调
    */
    handleCategoryChange ({categoryId, level}) {
      if (level===1) {
        // 重置二三级数据
        this.category2Id = null
        this.category3Id = null
        this.spuList = []
        this.total = 0

        this.category1Id = categoryId
      } else if (level===2) {
        // 重置三级数据
        this.category3Id = null
        this.spuList = []
        this.total = 0

        this.category2Id = categoryId
      } else {
        this.category3Id = categoryId
        // 当选择了某个三级分类, 请求获取第1页SPU列表
        this.getSpuList()
      }
    },

    /* 
    获取指定页码的分页数据
    */
    async getSpuList (page = 1) {
      // 保存指定的page
      this.page = page

      const {limit, category3Id} = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      const {records, total} = result.data
      this.spuList = records
      this.total = total
    },

    handleSizeChage (pageSize) {
      this.limit = pageSize
      this.getSpuList(1)
    }
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>
