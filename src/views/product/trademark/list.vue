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
      :style="{textAlign: 'center'}"
      :current-page="1"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="3"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Trademark',

  data() {
    return {
      trademarks:  [
        {
          "id": 245,
          "tmName": "香奈儿",
          "logoUrl": "http://182.92.128.115:8080/group1/M00/00/20/rBFUDF71kVmAKHqYAAIQgg_aZlk465.png"
        },
        {
          "id": 246,
          "tmName": "飞哥同款座驾",
          "logoUrl": "http://182.92.128.115:8080/group1/M00/00/21/rBFUDF756maAH_W9AAN7u_Z7feg582.jpg"
        },
        {
          "id": 247,
          "tmName": "长虹",
          "logoUrl": "http://182.92.128.115:8080/group1/M00/00/0D/rBFUDF7ItKmARAwgAAAGoVnFwgQ886.jpg"
        }
      ]
    }
  },

  async mounted () {
    const result = await this.$API.trademark.getList(1, 3)
    console.log('---', result)
  }
}
</script>
