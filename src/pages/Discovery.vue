<template>
  <div class="discovery">
    <!-- banner -->
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <!-- <h3 class="medium">{{ item }}</h3> -->
        <img v-lazy="item.imageUrl" :alt="item.typeTitle" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <div class="title-wrap">
        <p class="title">推荐歌单</p>
      </div>
      <div class="list-wrap">
        <PlaylistCard
        :copywriter="item.copywriter"
        :picUrl="item.picUrl"
        :name="item.name"
        v-for="item in recommendPlaylist"
        :key="item.id"
        @click.native="toPlaylistDetail(item.id)"
        />
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="latest-music">
      <div class="title-wrap">
        <p class="title">最新音乐</p>
      </div>
      <div class="list-wrap">
        <div
          class="song-card"
          v-for="(item, index) in recommendNewSong"
          :key="index"
          @click="playMusic(item.id)"
        >
          <div class="order">0{{ index + 1 }}</div>
          <div class="song-img">
            <img v-lazy="item.picUrl + '?param=300y300'" :alt="item.name" />
            <span class="play"><i class="el-icon-caret-right"></i></span>
          </div>
          <div class="song-content">
            <p class="song-name">{{ item.name }}</p>
            <p class="singer">{{ item.song.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="recomment-mv">
      <div class="title-wrap">
        <p class="title">推荐MV</p>
      </div>
      <div class="list-wrap">
        <MvlistCard
        :picUrl="item.picUrl"
        :copywriter="item.copywriter"
        :playCount="item.playCount"
        :name="item.name"
        :artists="item.artists"
        v-for="item in recommendMV"
        :key="item.id"
        @click.native="toMvsDetail(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistCard from '../components/PlaylistCard'
import MvlistCard from '../components/MvlistCard'
import {request} from '../utils/request'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      //banner
      //  /banner
      bannerList: [],
      //推荐歌单
      // /personalized?limit=10
      recommendPlaylist: [],
      //最新音乐
      // /personalized/newsong
      recommendNewSong: [],
      //推荐mv
      //  /personalized/mv
      recommendMV: []
    }
  },
  mounted() {
    //发起请求
    this.getBanner()
    this.getRecommendPlaylist()
    this.getRecommendNewSong()
    this.getRecommendMV()
  },
  methods: {
    //获取banner
    async getBanner() {
      const {data} = await request({
        method:'get',
        url:'/banner'
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.bannerList = data.banners
    },
    //推荐歌单
    async getRecommendPlaylist() {
      const {data} = await request({
        method:'get',
        url:'/personalized',
        params: {
          limit:10
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.recommendPlaylist = data.result
    },
    //最新音乐
    async getRecommendNewSong() {
      const {data} = await request({
        method:'get',
        url:'/personalized/newsong'
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.recommendNewSong = data.result
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
			//this.$store.commit('UPDATE_PLAYLIST',this.detail.tracks)
      //找出当前歌曲，也可以用参数传进来，这里用过滤的方式找出
      /* const curSong = this.detail.tracks.filter(item => {
        return item.id === id
      }) */
      //存储到vuex的历史播放
      //this.$store.dispatch('addSongToHistory',curSong[0])
      //更改播放状态
      this.$store.commit('CHANGE_PLAYING_VALUE',true)
    },
    //推荐mv
    async getRecommendMV() {
      const {data} = await request({
        method:'get',
        url:'/personalized/mv'
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.recommendMV = data.result
    },
    //跳转到详情
    toPlaylistDetail(id) {
      this.$router.push(`/playlist/${id}`)
    },
    //跳转到mv播放页面
    toMvsDetail(id) {
      this.$router.push('/mv/'+id)
    }
  },
  computed: {
    ...mapState(['playingMusicId'])
  },
  components: {
    PlaylistCard,
    MvlistCard
  }
}
</script>

<style>
.discovery {
  max-width: 1000px;
  margin:0 auto;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__item img {
  width: 100%;
  height: 100%;
}
/* 公共标题 */
.title-wrap .title {
  text-align: left;
  padding: 10px 0;
  font-size: 18px;
}
/* 推荐歌单 */
.recommend .list-wrap {
  display: flex;
  flex-wrap: wrap;
}
/* 最新音乐 */
.latest-music .list-wrap .song-card {
  width: 50%;
  display: inline-flex;
  padding: 10px 0;
}
.latest-music .list-wrap .song-card .song-img {
  width: 70px;
  height: 70px;
  position: relative;
}
.latest-music .song-img .play{
position: absolute;
  left: 50%;
  top: 50%;
  opacity: 1;
  transition: opacity 0.3s;
  transform: translate(-50%, -50%);
}
.latest-music .song-img .play i {
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.5);
  font-size: 30px;
  color: #c10d0c;
}
.latest-music .list-wrap .song-card .song-img img {
  width: 100%;
  height: 100%;
}
.latest-music .song-card:hover {
  background-color: #f5f5f5;
}
.latest-music .song-card .order {
  line-height: 70px;
  padding: 0 18px;
  font-size: 12px;
}
.latest-music .song-card .song-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  padding-left: 12px;
  font-size: 13px;
}
/* mv */
.recomment-mv .list-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
