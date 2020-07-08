<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table
      style="margin: 20px 0"
      border
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
    }
  },

  async mounted () {
    this.getTrademarks(1)
  },

  methods: {
    /* 
    异步获取指定页码的分页数据显示
    */
    async getTrademarks (page) {
      // 保存指定页码
      this.page = page
      // ajax请求获取分页列表
      const result = await this.$API.trademark.getList(page, this.limit)
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
