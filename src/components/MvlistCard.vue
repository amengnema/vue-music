<template>
  <div class="mv-list-card">
    <div class="img-wrap">
      <img v-lazy="picUrl + '?param=285y148'" :alt="copywriter" />
      <span class="hits"
        ><i class="el-icon-caret-right"></i>{{ playCount }}</span
      >
      <span class="play"><i class="el-icon-caret-right"></i></span>
    </div>
    <div class="mv-content">
      <div class="title">{{ name }}</div>
      <div class="name">{{ artists[0].name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['picUrl', 'copywriter', 'playCount', 'name', 'artists']
}
</script>

<style>
.mv-list-card {
  width: 33.33%;
  padding: 0 3px 15px 0;
  box-sizing: border-box;
  cursor: pointer;
}
.mv-list-card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.img-wrap {
  position: relative;
}
.img-wrap:hover .play {
  opacity: 1;
}
.img-wrap .hits {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 13px;
  color: #fff;
}
.img-wrap .play {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transition: opacity 0.3s;
  transform: translate(-50%, -50%);
}
.img-wrap .play i {
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.5);
  font-size: 40px;
  color: #c10d0c;
}
.mv-content {
  text-align: left;
}
.mv-content .title {
  font-size: 13px;
  color: #4a4a4a;
  padding: 3px 0;
}
.mv-content .name {
  font-size: 12px;
  color: #bebebe;
}
</style>
