<template>
  <el-form label-width="120px">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select value="">
        <el-option label="A" value="1"></el-option>
        <el-option label="B" value="2"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
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
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',

  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
