<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector @categoryChange="handleCategoryChange"/>
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm">
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      
        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <hint-button title="添加SKU" type="primary" size="mini" icon="el-icon-plus"></hint-button>
              <hint-button title="修改SPU" type="primary" size="mini" icon="el-icon-edit"
                @click="showUpdate(row)"></hint-button>
              <hint-button title="查看SKU" type="info" size="mini" icon="el-icon-info"></hint-button>
              <hint-button title="删除SPU" type="danger" size="mini" icon="el-icon-delete"></hint-button>
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

      <SpuForm :visible.sync="isShowSpuForm" ref="spuForm"/>
      <!-- @update:visible="isShowSpuForm=$event" -->

    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
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
      isShowSpuForm: false
    }
  },

  mounted () {
    // 为了方便测试
    this.category1Id = 1
    this.category2Id = 3
    this.category3Id = 61
    this.getSpuList()
  },

  methods: {

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
      // 显示更新的界面
      this.isShowSpuForm = true
      this.$refs.spuForm.initLoadUpdateData(spu.id)
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

        this.category1Id = categoryId
      } else if (level===2) {
        // 重置三级数据
        this.category3Id = null
        this.spuList = []

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
    SpuForm
  }
}
</script>
