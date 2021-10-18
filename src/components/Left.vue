<template>
  <el-aside width="200px">
      <!-- <div class="login"><i class="el-icon-user"></i>未登录</div> -->
      <ul>
        <router-link to="/discovery" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ 'router-link-active': isActive }">
            <i class="el-icon-caret-right"></i>发现音乐
          </li>
        </router-link>
        <router-link to="/playlists" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ 'router-link-active': isActive }">
            <i class="el-icon-caret-right"></i>推荐歌单
          </li>
        </router-link>
        <router-link to="/songs" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ 'router-link-active': isActive }">
            <i class="el-icon-caret-right"></i>最新音乐
          </li>
        </router-link>
        <router-link to="/mvs" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ 'router-link-active': isActive }">
            <i class="el-icon-caret-right"></i>最新MV
          </li>
        </router-link>
        <!-- <router-link to="/mvs" tag="li"><i class="el-icon-caret-right"></i>最新MV</router-link> -->
      </ul>
    </el-aside>
</template>

<script>
export default {}
</script>

<style scoped>
.el-aside {
  background-color: #EDECEC;
  color: #333;
  text-align: left;
}
.el-aside .login {
  padding: 16px 0 16px 17px;
  cursor: pointer;
  font-size: 14px;
}
.el-aside ul li {
  padding: 8px 0 8px 17px;
  font-size: 13px;
  list-style-type: none;
}
.el-aside ul li:hover {
  background-color: #E7E7E7;
  cursor: pointer;
}
.el-aside ul li.router-link-active {
  color: #C10D0C;
  background-color: #E0E1E1;
}
</style>
