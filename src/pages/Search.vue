<template>
  <div class="search">
    <div class="title">
      {{$route.params.keyword}}
      <span class="count" v-show="total">{{totalText}}</span>
    </div>
    <div class="tabs-wrap">
      <div class="tab-item" :class="{active: index === curTab}" v-for="(item,index) in tabs" :key="index" @click="changeTab(index)">{{item}}</div>
    </div>
    <div class="search-content" v-loading="loading" element-loading-text="拼命加载中">
      <!-- 单曲 -->
      <div class="songs-list-wrap" v-show="curTab === 0">
        <div class="title-wrap">
          <div class="order">序号</div>
          <div class="play">播放</div>
          <div class="name">音乐标题</div>
          <div class="singer">歌手</div>
          <div class="album">专辑</div>
          <div class="time">时长</div>
        </div>
        <SonglistCard
            :index="index"
            :name="item.name"
            :ar="item.artists"
            :al="item.album"
            :dt="item.duration"
            v-for="(item,index) in songsResult.songs"
            :key="index"
            @click.native="playMusic(item.id,item)"
            />
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="50"
          :total="total"
          @current-change="handleSongsPage"
          v-if="total"
          >
        </el-pagination>
      </div>
      <!-- 歌手 -->
      <div class="artists-list-wrap" v-show="curTab === 1">
        <div class="artist-list-card" v-for="item in artistsResult.artists" :key="item.id">
          <div class="img-wrap">
            <img v-lazy="item.picUrl+'?param=60y60'" :alt="item.name">
          </div>
          <div class="content">
            <div class="name">{{item.name}}</div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="50"
          :total="total"
          @current-change="handleArtistsPage"
          v-if="total"
          >
        </el-pagination>
      </div>
      <!-- 专辑 -->
      <div class="albums-list-wrap" v-show="curTab === 2">
        <div class="album-list-card" v-for="item in albumsResult.albums" :key="item.id">
          <div class="img-wrap">
            <img v-lazy="item.picUrl+'?param=60y60'" :alt="item.name">
          </div>
          <div class="content">
            <div class="name">{{item.name}}</div>
            <div class="artist">{{item.artist.name}}</div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="50"
          :total="total"
          @current-change="handleAlbumsPage"
          v-if="total"
          >
        </el-pagination>
      </div>
      <!-- 歌单 -->
      <div class="playlists-list-wrap" v-show="curTab === 3">
        <div class="playlist-list-card" v-for="item in playlistsResult.playlists" :key="item.id">
          <div class="img-wrap">
            <img v-lazy="item.coverImgUrl+'?param=60y60'" :alt="item.name">
          </div>
          <div class="content">
            <div class="name" v-html="showKeyword(item.name)"></div>
            <div class="count">{{item.trackCount}}首</div>
            <div class="creator">by {{item.creator.nickname}}</div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="50"
          :total="total"
          @current-change="handlePlaylistsPage"
          v-if="total"
          >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SonglistCard from '../components/SonglistCard'
import {request} from '../utils/request'
const tabs = ['单曲','歌手','专辑','歌单']
export default {
  created() {
    this.tabs = tabs
  },
  mounted() {
    //发起请求
    this.getSearchList(1,1)
  },
  data() {
    return {
      //是否显示加载遮罩
      loading:false,
      //当前选中项目
      curTab:0,
      //单曲列表 [res.result]
      // /search?keywords=许嵩&type=1&limit=50&offset=0
      // 分页 limit=50&offset=0  **偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
      songsResult: {},
      //歌手列表 [res.result]
      // /search?keywords=许嵩&type=100&limit=50&offset=0
      artistsResult:{},
      //专辑列表 [res.result]
      // /search?keywords=许嵩&type=10&limit=50&offset=0
      albumsResult:{},
      //歌单列表 [res.result]
      // /search?keywords=许嵩&type=1000&limit=50&offset=0
      playlistsResult: {}
    }
  },
  methods: {
    //点击切变tab
    changeTab(index) {
      if(this.curTab == index) return
      this.curTab = index
      //如果data里面没有数据，就在在下面发起请求
      if(index === 0) {
        if(JSON.stringify(this.songsResult) != '{}') return
        this.getSearchList(1,1)
        console.log(0)
      }else if(index === 1) {
        if(JSON.stringify(this.artistsResult) != '{}') return
        this.getSearchList(100,1)
        console.log(1)
      }else if(index === 2) {
        if(JSON.stringify(this.albumsResult) != '{}') return
        this.getSearchList(10,1)
        console.log(2)
      }else {
        if(JSON.stringify(this.playlistsResult) != '{}') return
        this.getSearchList(1000,1)
        console.log(3)
      }
    },
    //发起请求，获取列表
    async getSearchList(type,curPage) {
      this.loading = true
      const {data} = await request({
        method:'get',
        url:'/search',
        params: {
          keywords:this.$route.params.keyword,
          type,
          limit:50,
          offset:(curPage - 1)*50
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      if(type === 1) {
        this.songsResult = data.result
      } else if(type === 100) {
        this.artistsResult = data.result
      } else if(type === 10) {
        this.albumsResult = data.result
      } else {
        this.playlistsResult = data.result
      }
      this.loading = false
      console.log('发请求了');
    },
    //currentPage 改变时会触发
    handleSongsPage(val) {
      //发起请求 type=1
      this.getSearchList(1,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
    handleArtistsPage(val) {
      //发起请求 type=100
      this.getSearchList(100,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
    handleAlbumsPage(val) {
      //发起请求 type=10
      this.getSearchList(10,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
    handlePlaylistsPage(val) {
      //发起请求 type=1000
      this.getSearchList(1000,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
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
    }
  },
  computed: {
    //总数
    total() {
      if(this.curTab === 0) {
        return this.songsResult.songCount
      } else if(this.curTab === 1) {
        return this.artistsResult.artistCount
      }else if(this.curTab === 2) {
        return this.albumsResult.albumCount
      }else if(this.curTab === 3) {
        return this.playlistsResult.playlistCount
      }
      return 0
    },
    //总数文字表示
    totalText() {
      if(this.curTab === 0) {
        return `找到${this.songsResult.songCount}首单曲`
      } else if(this.curTab === 1) {
        return `找到${this.artistsResult.artistCount}位歌手`
      } else if(this.curTab === 2) {
        return `找到${this.albumsResult.albumCount}张专辑`
      } else if(this.curTab === 3) {
        return `找到${this.playlistsResult.playlistCount}个歌单`
      }
      return '未搜索到任何结果'
    },
    //关键词高亮
    showKeyword() {
      return function(result) {
        // 匹配关键字正则
        let replaceReg = new RegExp(this.$route.params.keyword, 'g');
        // 高亮替换v-html值
        let replaceString = '<span class="keyword">' + this.$route.params.keyword + '</span>';
        // 开始替换
        result = result.replace(replaceReg, replaceString);
        return result
      }
    }
  },
  watch: {
    $route: {
      handler() {
        if(this.$route.params.keyword) {
          this.curTab = 0
          //清空列表
          this.songsResult = {}
          this.artistsResult = {}
          this.albumsResult = {}
          this.playlistsResult = {}
          //搜索
          this.getSearchList(1,1)
          console.log(this.$route.params.keyword)
        }
      },
      deep:true
    }
  },
  components: {
    SonglistCard
  }
}
</script>

<style scoped>
.search {
  max-width: 1000px;
  margin:0 auto;
}
.search .title {
  text-align: left;
  font-size: 22px;
  font-weight: 700;
  margin: 10px 0;
}
.search .title .count {
  font-weight: normal;
  font-size: 12px;
  color:#666666;
}
.search .tabs-wrap {
  display: flex;
  border-bottom: 1px solid #F3F2F2;
}
.tabs-wrap .tab-item {
  font-size: 14px;
  margin-right:20px;
  color:#333333;
  padding-bottom: 2px;
}
.tabs-wrap .tab-item:hover {
  color:#000;
  cursor: pointer;
}
.tabs-wrap .tab-item.active {
  color:#CF3831;
  border-bottom: 2px solid #CF3831;
  font-weight: 600;
}
/* 标题 */
.songs-list-wrap .title-wrap {
  display: flex;
  text-align: left;
  padding: 18px 0;
  box-shadow: 0px -1px 5px #888888;
  font-size: 12px;
  color: #666;
}
.songs-list-wrap .title-wrap .order{
  flex: 1;
  color: #666;
  text-align: center;
}
.songs-list-wrap .title-wrap .play{
  flex: 1;
  text-align: center;
}
.songs-list-wrap .title-wrap .name{
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songs-list-wrap .title-wrap .singer{
  flex: 3;
}
.songs-list-wrap .title-wrap .album{
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songs-list-wrap .title-wrap .time {
  flex: 2;
}
/* 歌手 */
.artists-list-wrap {
  margin-top:10px;
}
.artists-list-wrap .artist-list-card {
  display: flex;
  align-items: center;
  padding:10px 0;
}
.artists-list-wrap .artist-list-card:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}
.artist-list-card .img-wrap {
  width:60px;
  height: 60px;
}
.artist-list-card .img-wrap img {
  width:100%;
  height:100%;
  border-radius: 10px;
}
.artist-list-card .content {
  margin-left:10px;
  font-size: 14px;
}
.artist-list-card .content .name {
  color:#313230;
}
/* 专辑 */
.albums-list-wrap {
  margin-top:10px;
}
.albums-list-wrap .album-list-card {
  display: flex;
  align-items: center;
  padding:10px 0;
}
.albums-list-wrap .album-list-card:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}
.album-list-card .img-wrap {
  width:60px;
  height: 60px;
}
.album-list-card .img-wrap img {
  width:100%;
  height:100%;
  border-radius: 10px;
}
.album-list-card .content {
  margin-left:10px;
  font-size: 14px;
  display:flex;
  flex:1;
}
.album-list-card .content .name {
  color:#313230;
  text-align: left;
  flex:1;
  font-size:15px;
}
.album-list-card .content .artist {
  text-align: left;
  flex:1;
  color:#686968;
  font-size:12px;
}
.album-list-card:nth-child(2n) {
  background-color: #fafafa;
}
.album-list-card:hover {
  background-color: #f5f5f5;
}
/* 歌单 */
.playlists-list-wrap {
  margin-top:10px;
}
.playlists-list-wrap .playlist-list-card {
  display: flex;
  align-items: center;
  padding:10px 0;
}
.playlists-list-wrap .playlist-list-card:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}
.playlist-list-card .img-wrap {
  width:60px;
  height: 60px;
}
.playlist-list-card .img-wrap img {
  width:100%;
  height:100%;
  border-radius: 10px;
}
.playlist-list-card .content {
  margin-left:10px;
  font-size: 14px;
  display:flex;
  flex:1;
}
.playlist-list-card .content .name {
  color:#313230;
  text-align: left;
  flex:4;
  font-size:15px;
}
.playlist-list-card .content .count {
  text-align: left;
  flex:1;
  color:#686968;
  font-size:12px;
}
.playlist-list-card .content .creator {
  text-align: left;
  flex:2;
  color:#686968;
  font-size:12px;
}
.playlist-list-card:nth-child(2n) {
  background-color: #fafafa;
}
.playlist-list-card:hover {
  background-color: #f5f5f5;
}
</style>
