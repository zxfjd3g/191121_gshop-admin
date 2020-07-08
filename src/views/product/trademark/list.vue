<template>
  <div>Trademark</div>
</template>

<script>
export default {
  name: 'Trademark',

  async mounted () {
    const result = await this.$API.trademark.getList(1, 3)
    console.log('---', result)
  }
}
</script>
