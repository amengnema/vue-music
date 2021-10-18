<template>
  <el-container class="el-center">
    <Left />
    <el-container>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    <!-- 播放器详情页面 -->
    <div
      class="player-detail "
      :class="{ active: showPlayerDetail === true }"
      v-if="songDetail != null"
    >
      <div class="top-wrap">
        <div class="img-wrap">
          <img class="zhou" src="../common/images/zhou.png" alt="zhou" />
          <img class="bar" :class="[playing === true?'playing': '']" src="../common/images/play-bar.png" alt="play-bar" />
          <div class="album-wrap">
            <img ref="albumImg"
              :src="songDetail[0].al.picUrl + '?param=300y300'"
              :alt="songDetail[0].name"
            />
            <span class="mask"></span>
          </div>
        </div>
        <div class="content-wrap">
          <div class="name">{{ songDetail[0].name }}</div>
          <div class="name-two">
            专辑：<span>{{ songDetail[0].al.name }}</span
            >歌手：<span>{{ getArtistDetail(songDetail[0].ar) }}</span>
          </div>
          <div class="lyrics" ref="lyricContainer">
            <div v-if="lyric.lrc">
              <div class="lyric-item" :class="{active: lyricActiveIndex == index}" v-for="(item,index) in showLyric" :key="index">
                <p class="lyric-text">{{item}}</p>
                <p class="lyric-entext"></p>
              </div>

            </div>
            <pre v-else>
              纯音乐
            </pre>
          </div>
        </div>
      </div>
      <div class="bottom-wrap">
        <div class="left">
          <div class="comment-list-wrap">
            <div class="hot">
              <div class="title">精彩评论</div>
              <div class="comment-wrap">
                <CommentCard
                  :avatarUrl="item.user.avatarUrl"
                  :nickname="item.user.nickname"
                  :content="item.content"
                  :beReplied="item.beReplied"
                  :time="item.time"
                  :likedCount="item.likedCount"
                  v-for="item in commentMusic.hotComments"
                  :key="item.commentId"
                />
              </div>
            </div>
            <div class="latest">
              <div class="title">最新评论({{ commentMusic.total }})</div>
              <div class="comment-wrap">
                <CommentCard
                  :avatarUrl="item.user.avatarUrl"
                  :nickname="item.user.nickname"
                  :content="item.content"
                  :beReplied="item.beReplied"
                  :time="item.time"
                  :likedCount="item.likedCount"
                  v-for="item in commentMusic.comments"
                  :key="item.commentId"
                />
              </div>
            </div>
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="20"
              :total="commentMusic.total"
              @current-change="handlePlaylistsPage"
              v-if="commentMusic"
              >
            </el-pagination>
          </div>
        </div>
        <div class="right">
          <div class="simi-playlist-wrap">
            <div class="title">包含这首歌的歌单<span v-if="simiPlaylist.length == 0">(0)</span></div>
            <div class="simi-playlist">
              <div
                class="playlist-card"
                v-for="item in simiPlaylist"
                :key="item.id"
                @click="toPlaylistDetail(item.id)"
              >
                <div class="playlist-img">
                  <img
                    :src="item.coverImgUrl + '?param=50y50'"
                    :alt="item.name"
                  />
                </div>
                <div class="playlist-content">
                  <p class="playlist-name">{{ item.name }}</p>
                  <p class="play-count"><i class="el-icon-caret-right"></i>{{ item.playCount | playCountFormat}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="simi-song-wrap">
            <div class="title">相似歌曲<span v-if="simiSong.length == 0">(0)</span></div>
            <div class="simi-song">
              <div class="song-card" v-for="item in simiSong" :key="item.id">
                <div class="song-img">
                  <img
                    :src="item.album.blurPicUrl + '?param=50y50'"
                    :alt="item.name"
                  />
                  <span class="play" @click="playMusic(item.id,item)"><i class="el-icon-caret-right"></i></span>
                </div>
                <div class="song-content">
                  <p class="song-name">{{ item.name }}</p>
                  <p class="singer">{{ item.artists[0].name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边播放列表界面 -->
    <div @click.stop class="playlist" :class="{active:showPlaylist === true}">
      <div class="list-cate">
        <span :class="{ active: curCateId === 0 }" @click="changeCateId(0)"
          >播放列表</span
        >
        <span :class="{ active: curCateId === 1 }" @click="changeCateId(1)"
          >历史记录</span
        >
      </div>
      <div class="list-info">
        <span class="total">总共{{ songsCount }}首</span>
        <span class="delete" @click="dialogVisible = true"
          ><i class="el-icon-delete"></i>清空</span
        >
      </div>
      <div class="list-wrap">
        <div class="list-head">
          <span class="name">音乐标题</span>
          <span class="singer">歌手</span>
          <span class="time">时长</span>
        </div>
        <div class="list-content">
          <template v-if="curCateId === 0">
            <div
              class="list-item"
              :class="{ active: playingMusicId === item.id }"
              v-for="item in playlist"
              :key="item.id"
            >
              <span class="name" @click="playListMusic(item.id)" :title="item.name">{{ item.name }}</span>
              <span class="singer" :title="getArtistList(item)">{{
                getArtistList(item)
              }}</span>
              <span class="time">{{ item.duration | duration}}</span>
            </div>
          </template>
          <template v-else>
            <div
              class="list-item"
              :class="{ active: playingMusicId === item.id }"
              v-for="item in playHistory"
              :key="item.id"
            >
              <span class="name" @click="playListMusic(item.id)" :title="item.name">{{ item.name }}</span>
              <span class="singer" :title="getArtistList(item)">{{
                getArtistList(item)
              }}</span>
              <span class="time">{{ item.duration }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @click.native.stop
      >
      <span @click.stop>确定删除记录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="deleteList">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Left from './Left.vue'
import CommentCard from '../components/CommentCard'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      //当前选中分类
      curCateId: 0,
      //是否显示对话框
      dialogVisible: false
    }
  },
  mounted() {
     this.$bus.$on('goTop',() => {
      // document.querySelector('.el-main').scrollTop = 0
      this.scrollToTop(300)
    })
  },
  methods: {
    //播放音乐
    playMusic(id,item) {
      if(this.playingMusicId === id) {
        this.$message({
          message:'该歌曲已经在播放了'
        })
        return
      }
      //vuex里面发请求，获取歌曲信息
			this.$store.dispatch('playMusic',id)
      //添加当前歌曲列表到vuex
      this.$store.dispatch('addSongToPlaylist',item)
      //存储当前歌曲到vuex的历史播放
      this.$store.dispatch('addSongToHistory',item)
      //更改播放状态
      this.$store.commit('CHANGE_PLAYING_VALUE',true)
    },
    //播放列表里面的音乐
    playListMusic(id) {
      if(this.playingMusicId === id) {
        this.$message({
          message:'该歌曲已经在播放了'
        })
        return
      }
      //vuex里面发请求，获取歌曲信息
			this.$store.dispatch('playMusic',id)
      //更改播放状态
      this.$store.commit('CHANGE_PLAYING_VALUE',true)
    },
    //跳转到歌单详情
    toPlaylistDetail(id) {
      //先关闭歌曲详情
      this.$store.commit('CHANGE_PLAYER_DETAIL')
      if(id == this.$route.params.id) return
      this.$router.push(`/playlist/${id}`)
      //触发更新事件
      this.$bus.$emit('updatePlaylistDetail')
    },
    changeCateId(id) {
      if (this.curCateId === id) return
      this.curCateId = id
    },
    //清空列表
    deleteList() {
      if (this.curCateId === 0) {
        this.$store.dispatch('deleteList', 0)
      } else {
        this.$store.dispatch('deleteList', 1)
      }
      this.$message({
        message:'删除成功',
        type:'success'
      });
      this.dialogVisible = false
    },
    //滚动动画 ease in and out
    scrollToTop (duration) {
      // cancel if already on top
      const scrollingElement = document.querySelector('.el-main')
      if (scrollingElement.scrollTop === 0) return;

      const cosParameter = scrollingElement.scrollTop / 2;
      let scrollCount = 0, oldTimestamp = null;

      function step (newTimestamp) {
          if (oldTimestamp !== null) {
              // if duration is 0 scrollCount will be Infinity
              scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
              if (scrollCount >= Math.PI) return scrollingElement.scrollTop = 0;
              scrollingElement.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount);
          }
          oldTimestamp = newTimestamp;
          window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    },
    //当页数改变时
    handlePlaylistsPage(val) {
      //获取评论
      this.$store.dispatch('getMusicComment',val)
    }
  },
  computed: {
    ...mapState([
      'showPlayerDetail',
      'songDetail',
      'simiPlaylist',
      'simiSong',
      'commentMusic',
      'lyric',
      'playlist',
      'playHistory',
      'playingMusicId',
      'playing',
      'showPlaylist',
      'lyricActiveIndex'
    ]),
    //多个歌手拼接，播放列表使用
    getArtistList() {
      return function(item) {
        if(item.artists) {
          let a = ''
          item.artists.forEach((item, i) => {
            if (i == 0) {
              a += item.name
            } else {
              a += '/' + item.name
            }
          })
          return a
        } else {
          let a = ''
          item.ar.forEach((item, i) => {
            if (i == 0) {
              a += item.name
            } else {
              a += '/' + item.name
            }
          })
          return a
        }
      }
    },
    //多个歌手拼接,详情面板使用
    getArtistDetail() {
      return function(ars) {
        let a = ''
        ars.forEach((item, i) => {
          if (i == 0) {
            a += item.name
          } else {
            a += '/' + item.name
          }
        })
        return a
      }
    },
    //计算歌曲数量
    songsCount() {
      if (this.curCateId === 0) {
        return this.playlist.length
      } else {
        return this.playHistory.length
      }
    },
    //歌词
    showLyric() {
      if(!this.lyric.lrc) {
        return
      }
      let a = this.lyric.lrc.lyric.split('\n')
      let arr = []
      a.forEach(item => {
        let a1 = item.split(']')[1] || ''
        arr.push(a1)
      })
      return arr
    }
  },
  watch: {
    playing(val) {
      const ai = this.$refs.albumImg
      if(!ai) return
      if(!this.showPlayerDetail) return
      console.log(ai+ '1');
      this.curDeg ? this.curDeg :  this.curDeg = 0
      if(val) {
        console.log('playing','转动');
        console.log(ai+ '2');
        this.si = setInterval(() => {
          this.curDeg += 0.3
          ai.style.transform = `rotate(${this.curDeg}deg)`
        },40)
      }else {
        console.log('stop','暂时停止');
        clearInterval(this.si)
      }
    },
    showPlayerDetail(val) {
      const ai = this.$refs.albumImg
      if(!ai) return
      if(!this.playing) return
      console.log(ai+ '1');
      this.curDeg ? this.curDeg :  this.curDeg = 0
      if(val) {
        console.log('playing','转动');
        console.log(ai+ '2');
        this.si = setInterval(() => {
          this.curDeg += 0.3
          ai.style.transform = `rotate(${this.curDeg}deg)`
        },40)
      }else {
        console.log('stop','暂时停止');
        clearInterval(this.si)
      }
    },
    lyricActiveIndex(val) {
      let a = this.$refs.lyricContainer
      //当前val为div数量，乘以高度，减去高度的一半
      a.scrollTop = (val*33) -150
    }
  },
  components: {
    Left,
    CommentCard
  },
  beforeDestroy() {
    this.$bus.$off('goTop')
  }
}
</script>

<style scoped>
.el-center {
  height: calc(100vh - 120px);
}
/* 从底部升起的播放器 */
.player-detail {
  position: fixed;
  top: 100vh;
  bottom: 60px;
  width: 100%;
  background: #fff;
  transition: top 0.5s;
  overflow-y: scroll;
  z-index: 2;
}
.player-detail.active {
  top: 60px;
}
/* 上 */

.player-detail .img-wrap .mask {
  position: absolute;
  background-image: url('../common/images/singlecover.png');
  background-repeat: no-repeat;
  left: -56px;
  top: -56px;
  width: 150%;
  height: 150%;
  background-size: 102% 102%;
}
.player-detail .album-wrap {
  width: 210px;
  height: 210px;
}
.player-detail .album-wrap img {
  width: 100%;
  height: 100%;
}
.player-detail .img-wrap .album-wrap {
  position: relative;
}
.player-detail .top-wrap {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
}
.top-wrap .img-wrap {
  width: 220px;
  padding: 160px 140px 0;
  position: relative;
}
.top-wrap .img-wrap .zhou {
  height: 30px;
  width: 30px;
  position: absolute;
  left: 50%;
  top: -4px;
  z-index: 9;
}
.top-wrap .img-wrap .bar {
  position: absolute;
  left: 52%;
  top: 15px;
  width: 120px;
  transform-origin: 0 0;
  transform: rotate(-20deg);
  z-index: 8;
  transition: all 0.5s;
}
.top-wrap .img-wrap .bar.playing {
  transform: rotate(6deg);
}
.top-wrap .content-wrap {
  flex: 1;
  text-align: left;
}
.top-wrap .content-wrap .name {
  font-size: 22px;
  margin: 10px 0;
}
.top-wrap .content-wrap .name-two {
  font-size: 12px;
  color: #656565;
  margin: 10px 0 30px 0;
}
.top-wrap .content-wrap .name-two span {
  color: #507daf;
  margin-right: 12px;
}
.top-wrap .content-wrap .lyrics {
  font-size: 15px;
  color: #646464;
  height: 300px;
  overflow: hidden;
  overflow-y: scroll;
  mask-image: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.6) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0, 0%, 100%, 0.6) 85%,
    hsla(0, 0%, 100%, 0)
  );
}
.top-wrap .content-wrap .lyrics .lyric-item {
  margin-bottom: 16px;
  color:#4a4a4a;
  font-size: 12px;
}
.top-wrap .content-wrap .lyrics .lyric-item.active {
  color:#000;
  font-weight: 700;
  font-size: 14px;
}
/* 下 */
.player-detail .bottom-wrap {
  height: 10px;
  margin: 50px auto;
  display: flex;
  max-width: 1000px;
}
.bottom-wrap .left {
  flex: 2;
}
.bottom-wrap .right {
  flex: 1;
  margin-left: 50px;
}
.bottom-wrap .title {
  text-align: left;
  font-size: 15px;
  font-weight: 500;
}
/* 包含这首歌的歌单 */
.simi-playlist .playlist-card {
  width: 100%;
  display: inline-flex;
  padding: 10px 0;
}
.simi-playlist .playlist-card .playlist-img {
  width: 50px;
  height: 50px;
  position: relative;
}

.playlist-card .playlist-img img {
  width: 100%;
  height: 100%;
}
.playlist-card:hover {
  background-color: #f5f5f5;
}

.playlist-card .playlist-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  padding-left: 12px;
  font-size: 13px;
}
/* 相似歌曲 */
.simi-song .song-card {
  width: 100%;
  display: inline-flex;
  padding: 10px 0;
}
.simi-song .song-card .song-img {
  width: 50px;
  height: 50px;
  position: relative;
}
.song-card .song-img .play {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 1;
  transition: opacity 0.3s;
  transform: translate(-50%, -50%);
}
.song-card .song-img .play:hover {
  cursor: pointer;
}
.song-card .song-img .play i {
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.5);
  font-size: 25px;
  color: #c10d0c;
}
.song-card .song-img img {
  width: 100%;
  height: 100%;
}
.song-card:hover {
  background-color: #f5f5f5;
}
.song-card .song-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  padding-left: 12px;
  font-size: 13px;
}
/* 侧边播放列表界面 */
.playlist {
  position: fixed;
  right: -400px;
  top: 0;
  height: calc(100vh - 60px);
  width: 400px;
  background-color: #fcfcfc;
  z-index: 10;
  box-shadow: 0px 0px 5px #888888;
  display: flex;
  flex-direction: column;
}
.playlist .list-cate {
  display: flex;
  justify-content: space-evenly;
  margin: 20px 80px;
  color: #7f7f81;
}
.playlist .list-cate:hover {
  color: #52525a;
  cursor: pointer;
}
.playlist .list-cate .active {
  color: #000;
}
.playlist .list-info {
  display: flex;
  justify-content: space-between;
  color: #4a4a4a;
  font-size: 14px;
  padding: 0 10px;
}
.playlist .list-info .delete {
  cursor: pointer;
}
.playlist .list-info .delete:hover {
  color: #d33a31;
}
.playlist .list-wrap {
  margin-top: 10px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.playlist .list-head {
  display: flex;
  font-size: 13px;
  color: #bfbebe;
  border-bottom: 1px solid #f2f2f1;
  padding: 6px 0;
  margin: 0 10px;
}
.playlist.active {
  right:0;
}
.list-wrap .list-head .name {
  flex: 5;
  color: #333334;
}
.list-wrap .list-head .singer {
  flex: 4;
  color: #666666;
}
.list-wrap .list-head .time {
  flex: 3;
}
.list-wrap .list-content {
  font-size: 12px;
  color: #bfbebe;
  overflow-y: auto;
}
.list-wrap .list-item {
  display: flex;
  padding: 8px 10px;
}
.list-wrap .list-item.active .name,
.list-wrap .list-item.active .singer {
  color: #d33a31;
}
.list-wrap .list-item:nth-child(2n) {
  background-color: #f3f3f3;
}
.list-wrap .list-item:hover {
  background-color: #f0efef;
}
.list-wrap .list-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-wrap .list-item .name {
  flex: 5;
  color: #333334;
}
.list-wrap .list-item .name:hover {
  color: #d33a31;
  cursor: pointer;
}
.list-wrap .list-item .singer {
  flex: 4;
  color: #666666;
}
.list-wrap .list-item .time {
  flex: 3;
}
</style>
