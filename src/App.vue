<template>
  <el-container class="app-container">
      <Header />
      <Center/>
      <Footer />
    </el-container>
</template>

<script>
import Header from './components/Header.vue'
import Center from './components/Center.vue'
import Footer from './components/Footer.vue'
export default {
  components: {
    Header,
    Center,
    Footer
  }
}
</script>

<style>
@import url('./common/css/style.css');
.el-container.app-container {
  flex-direction: column;
}
.el-main {
  color: #333;
  text-align: center;
  
}
body > .el-container {
  margin-bottom: 40px;
}
</style>
