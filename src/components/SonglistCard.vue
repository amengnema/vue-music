<template>
  <div class="song-list-card">
    <div class="order">{{ index + 1 }}</div>
    <div class="play"><i class="el-icon-caret-right"></i></div>
    <div class="name" :title="name">{{ name }}</div>
    <div class="singer" :title="getArtist(ar)">{{ getArtist(ar) }}</div>
    <div class="album" :title="al.name">{{ al.name }}</div>
    <div class="time">{{ dt | duration}}</div>
  </div>
</template>

<script>
export default {
  props: ['index','name','ar','al','dt'],
  computed: {
    //遍历所有歌手显示
    getArtist() {
      return function(ars) {
        let a = ''
        ars.forEach((item,i) => {
          if(i == 0) {
            a += item.name
          }else {
            a += '/' + item.name
          }
        })
        return a
      }
    }
  }
}
</script>

<style scoped>
.song-list-card {
  display: flex;
  text-align: left;
  padding: 10px 0;
  font-size: 12px;
  color: #333;
}
.song-list-card:nth-child(2n) {
  background-color: #fafafa;
}
.song-list-card:hover {
  background-color: #f5f5f5;
}
.song-list-card .play:hover {
  cursor: pointer;
}
.song-list-card .order {
  flex: 1;
  color: #C1C0C1;
  text-align: center;
}
.song-list-card .play {
  flex: 1;
  text-align: center;
}
.song-list-card .name {
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color:#313231;
}
.song-list-card .singer {
  flex: 3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color:#646464;
}
.song-list-card .album {
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color:#646464;
}
.song-list-card .time {
  flex: 2;
  color:#878888;
}
.song-list-card .play i {
  border: 1px solid #b2b2b2;
  color: #b2b2b2;
  border-radius: 50%;
}
.song-list-card .play i:hover {
  border: 1px solid #d33a31;
  color: #d33a31;
}
</style>
