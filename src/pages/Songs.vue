<template>
  <div class="songs">
    <!-- 标签 -->
    <div class="tags">
      <div class="tag" :class="{active:curTag === item.id}" v-for="item in tags" :key="item.id" @click="handleTag(item.id)">{{ item.name }}</div>
    </div>
    <!-- 歌曲列表 -->
    <div class="list-wrap">
      <div class="title">
        <div class="order">序号</div>
        <div class="img">封面</div>
        <div class="name">标题</div>
        <div class="time">时长</div>
        <div class="singer">歌手</div>
      </div>
      <div class="song-list" v-loading="loading">

        <div class="song-list-card" v-for="(item,index) in songList" :key="item.id">
          <div class="order">{{index + 1}}</div>
          <div class="img">
            <img
              v-lazy="item.album.blurPicUrl + '?param=300y300'"
              :alt="item.name"
            />
            <span class="play" @click="playMusic(item.id)"><i class="el-icon-caret-right"></i></span>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="time">{{item.duration | duration}}</div>
          <div class="singer">{{item.artists[0].name}}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {request} from '../utils/request'
const tags = [
        { id: 0, name: '全部' },
        { id: 7, name: '华语' },
        { id: 96, name: '欧美' },
        { id: 8, name: '日本' },
        { id: 16, name: '韩国' }
      ]
export default {
  data() {
    return {
      //当前tag
      curTag:0,
      //歌曲列表
      // /top/song
      songList: [],
      //列表是否在加载
      loading:false
    }
  },
  created() {
    this.tags = tags
  },
  mounted() {
    this.getSongList(0)
  },
  methods: {
    //点击标签
    handleTag(id) {
      if(this.curTag == id) return
      this.curTag = id
      //发起请求
      this.getSongList(id)
    },
    //获取歌曲列表
    async getSongList(type) {
      this.loading = true
      const {data} = await request({
        method:'get',
        url:'/top/song',
        params: {
          type
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.songList = data.data
      this.loading = false
    },
		//播放音乐
		playMusic(id) {
      //不能播放重复歌曲
      if(this.playingMusicId === id) {
        this.$message({
          message:'该歌曲已经在播放了'
        })
        return
      }
      //vuex里面发请求，获取歌曲信息
			this.$store.dispatch('playMusic',id)
      //更新当前歌曲列表到vuex
			this.$store.commit('UPDATE_PLAYLIST',this.songList)
      //找出当前歌曲，也可以用参数传进来，这里用过滤的方式找出
      const curSong = this.songList.filter(item => {
        return item.id === id
      })
      //存储到vuex的历史播放
      this.$store.dispatch('addSongToHistory',curSong[0])
      //更改播放状态
      this.$store.commit('CHANGE_PLAYING_VALUE',true)
		}
	},
  computed: {
    ...mapState(['playingMusicId']),
  }
}
</script>

<style scoped>
.songs {
  max-width: 1000px;
  margin:0 auto;
}
.songs .tags {
  display: flex;
  text-align: left;
  margin: 20px 0;
  font-size: 14px;
  color: #878788;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.songs .tag {
  margin: 0 5px;
}
.songs .tag:hover {
  cursor:pointer;
}
.songs .tag.active {
  color:#000;
  font-weight: 500;
}
.song-list-card {
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  color: #333;
  padding: 3px 0;
}
.list-wrap .title {
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 12px;
  color: #666;
  padding: 15px 0;
}
.song-list-card:hover {
  background-color: #f5f5f5;
}
.song-list-card .img {
  height: 70px;
  width: 70px;
  position: relative;
}
.song-list-card .img:hover .play{
  opacity:1;
}
.song-list-card .img .play {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transition: opacity 0.3s;
  transform: translate(-50%, -50%);
}
.song-list-card .img .play:hover {
  cursor:pointer;
}
.song-list-card .img .play i {
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.5);
  font-size: 30px;
  color: #c10d0c;
}
.song-list-card .img img {
  height: 100%;
  width: 100%;
}
.song-list-card .order,
.title .order {
  flex: 1;
  padding:0 10px;
}
.title .img {
  width: 70px;
}
.song-list-card .name,
.title .name {
  flex: 3;
  padding:0 10px;
}
.song-list-card .time,
.title .time {
  flex: 1;
  padding:0 10px;
}
.song-list-card .singer,
.title .singer {
  flex: 2;
  padding:0 10px;
}
</style>
