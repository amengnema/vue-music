<template>
  <el-footer>
    <!-- 底部播放操作界面 -->
    <div class="player">
      <div ref="barwrap" class="progress-bar-wrap" @mousedown="changeProgress">
        <div ref="probar" class="progress-bar"></div>
        <div ref="probtn" class="progress-btn"></div>
      </div>
      <audio ref="audio" @timeupdate="timeupdate" :src="songLink" autoplay></audio>
      <div class="info">
        <div class="img-wrap" @click="handleImgClick" v-if="songDetail != null">
          <img :src="songDetail[0].al.picUrl+'?param=60y60'" :alt="songDetail[0].name">
          <span class="img-mask"><i class="el-icon-full-screen"></i></span>
        </div>
        <div class="content-wrap" v-if="songDetail != null">
          <div class="name">{{songDetail[0].name}}<span> - {{getArtist(songDetail[0].ar)}}</span></div>
          <div class="time"><span ref="curTime">01:32</span> / <span ref="durTime">04:24</span></div>
        </div>
      </div>
      <div class="control">
        <span @click="playPreSong"><i class="el-icon-arrow-left"></i></span>
        <i @click="playOrPause" :class="[ playing ? 'el-icon-video-pause' : 'el-icon-video-play']"></i>
        <span @click="playNextSong"><i class="el-icon-arrow-right"></i></span>
      </div>
      <div class="other">
        <!-- <span @click="handleShare"><i class="el-icon-share"></i></span> -->
        <el-tooltip placement="top">
          <div slot="content">{{shufflePlay == true? '随机播放' : '顺序播放'}}</div>
          <span @click="handleSort"><i :class="[shufflePlay == true? 'el-icon-refresh' : 'el-icon-sort']"></i></span>
        </el-tooltip>
        <span @click.stop="handleList"><i class="el-icon-s-operation"></i></span>
        <span @click="handleSound" class="sound-wrap">
          <div class="sound-block">
            <el-slider
              v-model="soundValue"
              vertical
              height="100px"
              @change="handleSoundChange">
            </el-slider>
          </div>
          <i class="el-icon-microphone"></i></span>
      </div>
    </div>

  </el-footer>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      shufflePlay:false,
      soundValue:100
    }
  },
  mounted() {
    //设置音量
    const volume = this.$refs.audio.volume
    this.soundValue = volume*100
  },
  methods: {
    //歌曲详情显示与隐藏
    handleImgClick() {
      this.$store.commit('CHANGE_PLAYER_DETAIL')
    },
    //歌曲播放暂停
    playOrPause() {
      if(!this.songLink) return
      const audio = this.$refs.audio
      if(this.playing) {
        audio.pause()
      }else {
        audio.play()
      }
      this.$store.commit('CHANGE_PLAYING')
    },
    //当目前的播放位置已更改时
    timeupdate() {
      const audio = this.$refs.audio
      const probar = this.$refs.probar
      const probtn = this.$refs.probtn
      const curTime = this.$refs.curTime
      const durTime = this.$refs.durTime
      let progress = ((audio.currentTime/audio.duration)*100).toFixed(1) + '%'
      probar.style.width = progress
      probtn.style.left = progress
      curTime.innerHTML = this.formatSecToStr(audio.currentTime)
      durTime.innerHTML = this.formatSecToStr(audio.duration)
      //如果播放完成，就切换成暂停状态
      if(audio.currentTime>=audio.duration) {
        this.$store.commit('CHANGE_PLAYING')
      }
      //改变activeIndex
      //this.lyric.
      if(!this.lyric.lrc) return
      let a1 = this.lyric.lrc.lyric.split('\n')
      let a2 = []
      let a3 = []
      let a4 = []
      let indexa = undefined
      a1.forEach(item => {
        a2.push(item.split(']')[0])
      })
      a2.forEach(item => {
        a3.push(item.split('[')[1])
      })
      a3.forEach(item => {
        a4.push(this.parseTime(item))
      })
      a4.forEach((item,i) => {
        //找出当前时间所在的区间
        if(audio.currentTime<a4[i+1] && audio.currentTime >= a4[i]) {
          indexa = i
          return
        }
      })
      this.$store.commit('CHANGE_LYRIC_ACTIVE_DIV',indexa)
    },
    //点击改变歌曲进度
    changeProgress(e) {
      const audio = this.$refs.audio
      if(!audio.currentTime) return
      const barwrap = this.$refs.barwrap
      //当前点击进度
      const curPro = (e.pageX - barwrap.offsetLeft) / barwrap.offsetWidth
      audio.currentTime = curPro*audio.duration
    },
    //秒转换
    formatSecToStr(seconds) {
        seconds = parseInt(seconds)
        let daySec = 24 *  60 * 60;
        let hourSec=  60 * 60;
        let minuteSec=60;
        let dd = Math.floor(seconds / daySec);
        let hh = Math.floor((seconds % daySec) / hourSec);
        let mm = Math.floor((seconds % hourSec) / minuteSec);
        let ss=seconds%minuteSec;
        if(dd > 0){
          return this.PrefixInteger(dd) + ":" + this.PrefixInteger(hh) + ":" + this.PrefixInteger(mm) + ":"+this.PrefixInteger(ss);
        }else if(hh > 0){
          return this.PrefixInteger(hh) + ":" + this.PrefixInteger(mm) + ":"+this.PrefixInteger(ss);
        } else if (mm > 0){
          return this.PrefixInteger(mm) + ":"+this.PrefixInteger(ss);
        }else{
          return '00:'+this.PrefixInteger(ss);
      }
    },
    //补0
    PrefixInteger(num) {
      return (Array(2).join(0) + num).slice(-2);
    },
    //分享
    /* handleShare() {}, */
    //排序
    handleSort() {
      this.shufflePlay = !this.shufflePlay
    },
    //打开/关闭列表
    handleList() {
      this.$store.commit('CHANGE_PLAYLIST_DISPLAY',!this.showPlaylist)
    },
    //声音
    handleSound() {},
    //解析时间
    parseTime(time) {
      if(!time) return ''
      let tl = time.split(":");
      switch(tl.length){
        case 1 :
          return parseFloat(tl[0]);
        case 2:
          return parseFloat(tl[0]) * 60 + parseFloat(tl[1]);
        case 3:
          return parseFloat(tl[0]) * 3600 + parseFloat(tl[1]) * 60 + parseFloat(tl[2]);
      }
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
    //播放上一曲，下一曲
    playPreSong() {
      if(this.playlist.length<2) {
        this.$message({
          message:'没有可播放的歌曲'
        })
        return
      }
      let i = 0
      this.playlist.forEach((item,index) => {
        if(item.id == this.playingMusicId) {
          i = index
        }
      })
      if(!this.shufflePlay) {
        //顺序播放
        if(i == 0) {
          this.playMusic(this.playlist[this.playlist.length-1].id)
        }else {
          this.playMusic(this.playlist[i-1].id)
        }
      }else {
        //随机播放
        this.playMusic(this.playlist[Math.floor(Math.random()*(this.playlist.length-1))].id)
      }
    },
    playNextSong() {
      if(this.playlist.length<2) {
        this.$message({
          message:'没有可播放的歌曲'
        })
        return
      }
      let i = 0
      this.playlist.forEach((item,index) => {
        if(item.id == this.playingMusicId) {
          i = index
        }
      })
      if(!this.shufflePlay) {
        //顺序播放
        if(i == this.playlist.length - 1) {
          this.playMusic(this.playlist[0].id)
        }else {
          this.playMusic(this.playlist[i+1].id)
        }
      }else {
        //随机播放
        this.playMusic(this.playlist[Math.floor(Math.random()*(this.playlist.length-1))].id)
      }
    },
    //拖动条值改变
    handleSoundChange() {
      //设置音量
      // console.log(this.soundValue/100);
      this.$refs.audio.volume = this.soundValue/100
    }
  },
  computed: {
    ...mapState(['songLink','playing','songDetail','showPlaylist','lyric','playingMusicId','playlist']),
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
.el-footer {
box-shadow: 0px 1px 5px #888888;
background-color: #FEFFFF;
position: fixed;
  bottom: 0;
  width: 100%;
  padding:0;
  z-index: 3;
}
.player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  position: relative;
  padding:0 20px;
}
.player .progress-bar-wrap {
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height: 9px;
}
.player .progress-bar-wrap .progress-bar {
  height: 2px;
  width:0;
  background-color: #D33A31;
}
.player .progress-bar-wrap .progress-btn {
  position:absolute;
  left:0;
  top:-7px;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background-color: #D33A31;
  transform: translateX(-8px);
  opacity: 0;
}
.player .progress-bar-wrap:hover {
  cursor: pointer;
}
.player .progress-bar-wrap:hover .progress-btn{
  opacity: 1;
}
/* 左边 */
.info {
  display: flex;
  align-items: center;
  flex:1;
}
.info .img-wrap {
  height:40px;
  width: 40px;
  position: relative;
}
.info .img-wrap img {
  height:100%;
  width:100%;
  border-radius: 3px;
}
.info .img-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  left:0;
  top:0;
  text-align: center;
  line-height: 50px;
  background-color: #00000087;
  display: none;
}
.info .img-mask i {
  font-size: 30px;
  color:#fff;
}
.info .img-wrap:hover .img-mask{
  display: block;
  cursor: pointer;
}
.info .content-wrap {
  padding-left: 10px;
}
.info .content-wrap .name {
  font-size: 14px;
}
.info .content-wrap .name span {
  color:#7F7F80;
  font-size: 13px;
}
.info .content-wrap .time {
  font-size: 13px;
  color:#7F7F80;
}
/* 中间 */
.control {
  font-size: 26px;
  display: flex;
  align-items: center;
  flex:1;
}
.control span {
  margin:0 10px;
}
.control i {
  color:#4C4C4C;
}
.control .el-icon-arrow-left,
.control .el-icon-video-play,
.control .el-icon-video-pause,
.control .el-icon-arrow-right {
  color:#D33A31;
}
.control .el-icon-video-play ,
.control .el-icon-video-pause{
  font-size: 40px;
  margin:0 10px;
}
/* 右边 */
.other {
  font-size: 26px;
}
.other span {
  margin:0 10px;
}
.other span i {
  color:#4C4C4C;
}
.other .sound-wrap {
  position:relative;
}
.other .sound-wrap .sound-block {
  position:absolute;
  bottom:32px;
  right:-6px;
  background-color: #FEFFFF;
  display: none;
}
.other .sound-wrap:hover .sound-block{
  display: block;
}
</style>
