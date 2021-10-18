<template>
  <div class="playlist-detail" v-loading="pageLoading">
    <div class="head-wrap" v-if="detail.name">
      <div class="img-wrap">
        <img v-lazy="detail.coverImgUrl + '?param=300y300'" alt="img" />
      </div>
      <div class="content">
        <div class="title">{{ detail.name }}</div>
        <div class="creater">
          <img :src="detail.creator.avatarUrl + '?param=30y30'" alt="creater" />
          {{ detail.creator.nickname }}
          <span class="create-time">{{ detail.createTime | dayFormat}} 创建</span>
        </div>
        <!-- <div class="btns">
          <el-button type="primary" round>播放全部</el-button>
        </div> -->
        <div class="desc-wrap">
          <div class="tags">标签:{{ formatTags(detail.tags) }}</div>
          <div class="tags">
            歌曲数：{{ detail.trackCount }} 播放数：{{ dynamic.playCount }}
          </div>
          <div class="desc">{{ detail.description }}</div>
        </div>
      </div>
    </div>
    <div class="tabs-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="歌曲列表" name="first">
          <div class="title-wrap">
            <div class="order">序号</div>
            <div class="play">播放</div>
            <div class="name">音乐标题</div>
            <div class="singer">歌手</div>
            <div class="album">专辑</div>
            <div class="time">时长</div>
          </div>
          <div class="song-list">
            <SonglistCard
            :index="index"
            :name="item.name"
            :ar="item.ar"
            :al="item.al"
            :dt="item.dt"
            v-for="(item,index) in detail.tracks"
            :key="index"
            @click.native="playMusic(item.id)"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="'评论(' + dynamic.commentCount + ')'"
          name="second"
        >
          <div class="comment-list-wrap" v-loading="commentLoading">
            <div class="hot" v-if="comment.hotComments">
              <div class="title">精彩评论</div>
              <div class="comment-wrap">
                <CommentCard
                :avatarUrl="item.user.avatarUrl"
                :nickname="item.user.nickname"
                :content="item.content"
                :beReplied="item.beReplied"
                :time="item.time"
                :likedCount="item.likedCount"
                v-for="item in comment.hotComments"
                :key="item.commentId"
                />
              </div>
            </div>
            <div class="latest" v-if="comment.comments">
              <div class="title">最新评论({{ dynamic.commentCount }})</div>
              <div class="comment-wrap">
                <CommentCard
                :avatarUrl="item.user.avatarUrl"
                :nickname="item.user.nickname"
                :content="item.content"
                :beReplied="item.beReplied"
                :time="item.time"
                :likedCount="item.likedCount"
                v-for="item in comment.comments"
                :key="item.commentId"
                />
              </div>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CommentCard from '../components/CommentCard'
import SonglistCard from '../components/SonglistCard'
import {request} from '../utils/request'
export default {
  data() {
    return {
      //歌单详情
      // /playlist/detail?id=6815249151
      //说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口
      //传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)
      //但是返回的trackIds是完整的，tracks 则是不完整的
      //可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情
      detail: {},
      //歌单详情动态
      // /playlist/detail/dynamic?id=6815249151
      dynamic: {},
      //歌单评论
      //  /comment/playlist?id=6815249151&limit=50&offset=0
      comment: {},
      //默认选中的标签
      activeName: 'first',
      //评论总数
      total:0,
      //页面是否加载中
      pageLoading:false,
      //评论是否加载中
      commentLoading:false
    }
  },
  mounted() {
    //监听更新事件
    this.$bus.$on('updatePlaylistDetail',() => {
      //进入页面，发起请求
      this.total = 0
      this.activeName = 'first'
      //滚动到顶部
      this.$bus.$emit('goTop')
      this.getDetail(this.$route.params.id)
      this.getDynamic(this.$route.params.id)
    })
  },
  activated() {
    //进入页面，发起请求
    this.total = 0
    this.activeName = 'first'
    //滚动到顶部
    this.$bus.$emit('goTop')
    this.getDetail(this.$route.params.id)
    this.getDynamic(this.$route.params.id)
    //初始化时不加载评论
    // this.getComment(this.$route.params.id,1)
  },
  deactivated() {
    this.detail = {}
    this.comment = {}
  },
  methods: {
    //标签点击
    handleClick(tab) {
      //选中评论标签时
      if(tab.name === 'second') {
        if(JSON.stringify(this.comment) == '{}') {
          this.getComment(this.$route.params.id,1)
        }
      }
    },
    //获取歌单详情
    async getDetail(id) {
      const {data} = await request({
        method:'get',
        url:'/playlist/detail',
        params: {
          id
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.detail = data.playlist
    },
    //获取歌单详情动态
    async getDynamic(id) {
      this.pageLoading = true
      const {data} = await request({
        method:'get',
        url:'/playlist/detail/dynamic',
        params: {
          id
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.dynamic = data
      this.pageLoading = false
    },
    //获取歌单评论
    async getComment(id,curPage) {
      this.commentLoading = true
      const {data} = await request({
        method:'get',
        url:'/comment/playlist',
        params: {
          id,
          limit:50,
          offset:(curPage - 1)*50
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.comment = data
      this.total = data.total
      this.commentLoading = false
    },
    //点击分页
    handlePlaylistsPage(val) {
      //发起请求
      this.getComment(this.$route.params.id,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
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
			this.$store.commit('UPDATE_PLAYLIST',this.detail.tracks)
      //找出当前歌曲，也可以用参数传进来，这里用过滤的方式找出
      const curSong = this.detail.tracks.filter(item => {
        return item.id === id
      })
      //存储到vuex的历史播放
      this.$store.dispatch('addSongToHistory',curSong[0])
      //更改播放状态
      this.$store.commit('CHANGE_PLAYING_VALUE',true)
    }
  },
  computed:{
    formatTags() {
      return function(tags) {
        let a = ''
        tags.forEach((item,i) => {
          if(i == 0) {
            a += item
          }else {
            a += '/' + item
          }
        })
        return a
      }
    }
  },
  beforeDestroy() {
    //关闭更新事件
    this.$bus.$off('updatePlaylistDetail')
  },
  components: {
    CommentCard,
    SonglistCard
  }
}
</script>

<style scoped>
.playlist-detail {
  max-width: 1000px;
  margin:0 auto;
}
.playlist-detail .head-wrap {
  border-radius: 10px;
  display: flex;
}
.head-wrap .img-wrap {
  height: 200px;
  width: 200px;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
}
.head-wrap .img-wrap img {
  height: 100%;
  width: 100%;
}
.head-wrap .content {
  padding-left: 20px;
  text-align: left;
  flex:1;
}
.content .title {
  font-size: 24px;
  font-weight: 500;
}
.content .creater {
  height: 30px;
  font-size: 13px;
  color: #507daf;
  margin:10px 0;
}
.content .creater span {
  color: #5f5f5f;
}
.content .creater img {
  height: 100%;
  border-radius: 50%;
  vertical-align: middle;
}
.content .desc-wrap {
  font-size: 13px;
  line-height: 21px;
}
/* 播放列表 */
/deep/ .el-tabs__item.is-active {
  color:#D33A32;
}
/deep/ .el-tabs__item:hover {
  color:#D33A32;
}
/deep/ .el-tabs__active-bar {
  background-color:#D33A32;
}
/* 标题 */
.tabs-wrap .title-wrap {
  display: flex;
  text-align: left;
  padding: 18px 0;
  border-top: 2px solid #c20c0c;
  box-shadow: 0px -1px 5px #888888;
  font-size: 12px;
  color: #666;
}
.tabs-wrap .title-wrap .order{
  flex: 1;
  color: #666;
  text-align: center;
}
.tabs-wrap .title-wrap .play{
  flex: 1;
  text-align: center;
}
.tabs-wrap .title-wrap .name{
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tabs-wrap .title-wrap .singer{
  flex: 3;
}
.tabs-wrap .title-wrap .album{
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tabs-wrap .title-wrap .time {
  flex: 2;
}
/* 评论 */
.tabs-wrap .comment-list-wrap .title {
  text-align: left;
  font-size: 15px;
  font-weight: 500;
}
</style>
