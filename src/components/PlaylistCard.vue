<template>
  <div class="playlist-card" >
      <div class="img">
        <span class="info">{{copywriter}}</span>
        <img v-lazy="picUrl + '?param=300y300'" :alt="name" />
        <span class="play"><i class="el-icon-caret-right"></i></span>
      </div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: ['copywriter','picUrl','name']
}
</script>

<style>
.playlist-card {
  width: 20%;
  box-sizing: border-box;
  padding: 0 3px;
}
.playlist-card:hover {
  cursor: pointer;
}
.playlist-card .img:hover .play {
  opacity: 1;
}
.playlist-card .img:hover .info {
  top:0;
}
.playlist-card img {
  width: 100%;
  height: auto;
}
.playlist-card .img {
  position: relative;
  overflow: hidden;
}
.playlist-card .img .info {
  position: absolute;
  top:-32px;
  left:0;
  width:100%;
  background-color: #00000044;
  color:#fff;
  font-size: 14px;
  text-align: left;
  padding: 6px;
  box-sizing: border-box;
  transition: top .3s;
}
.playlist-card .img .play {
  position: absolute;
  bottom: 12px;
  right: 6px;
  opacity: 0;
  transition: opacity .3s;
}
.playlist-card .img .play i{
  border-radius: 50%;
  background: hsla(0,0%,100%,.5);
  font-size:30px;
  color:#C10D0C;
}
.playlist-card .name {
  font-size: 13px;
  padding: 9px 0;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
</style>
