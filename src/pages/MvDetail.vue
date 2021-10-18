<template>
  <div class="mv-detail" v-loading="pageLoading">
    <div class="left">
      <div class="title">MV详情</div>
      <video :src="mvUrl.url" controls></video>
      <div class="author">
        <img :src="mvDetail.cover+'?param=50y50'" :alt="mvDetail.artistName">
        <span class="author-name">{{mvDetail.artistName}}</span>
      </div>
      <div class="info">
        <div class="mv-title">{{mvDetail.name}}</div>
        <div class="mv-info">
          <span>发布：{{mvDetail.publishTime}}</span>
          <span>播放：{{mvDetail.playCount}}</span>
        </div>
      </div>
      <div class="comment-list-wrap" v-loading="commentLoading">
        <div class="hot" v-if="mvComment.hotComments">
          <div class="title">精彩评论</div>
          <div class="comment-wrap">
            <CommentCard
              :avatarUrl="item.user.avatarUrl"
              :nickname="item.user.nickname"
              :content="item.content"
              :beReplied="item.beReplied"
              :time="item.time"
              :likedCount="item.likedCount"
              v-for="item in mvComment.hotComments"
              :key="item.commentId"
            />
          </div>
        </div>
        <div class="latest" v-if="mvComment.comments">
          <div class="title">最新评论({{ mvComment.total }})</div>
          <div class="comment-wrap">
            <CommentCard
              :avatarUrl="item.user.avatarUrl"
              :nickname="item.user.nickname"
              :content="item.content"
              :beReplied="item.beReplied"
              :time="item.time"
              :likedCount="item.likedCount"
              v-for="item in mvComment.comments"
              :key="item.commentId"
            />
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="20"
          :total="total"
          @current-change="handlePlaylistsPage"
          v-if="total"
          >
        </el-pagination>
      </div>
    </div>
    <div class="right">
      <div class="title">相关推荐</div>
      <div class="mv-list-wrap">
        <MvlistCard
          :picUrl="item.cover"
          :copywriter="item.name"
          :playCount="item.playCount"
          :name="item.name"
          :artists="item.artists"
          v-for="item in simiMv"
          :key="item.id"
          @click.native="toMvsDetail(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentCard from '../components/CommentCard'
import MvlistCard from '../components/MvlistCard'
import {request} from '../utils/request'
export default {
  data() {
    return {
      //获取 mv 点赞转发评论数数据
      // /comment/mv?id=5436712 [res]
      mvComment:{},
      //mv 数据
      // /mv/detail?mvid=5436712 [res.data]
      mvDetail:{},
      //mv 地址
      // /mv/url?id=5436712 [res.data]
      mvUrl:{},
      //相似 mv
      // /simi/mv?mvid=5436712 [res.mvs]
      simiMv:[],
      //评论总数量
      total:0,
      //页面是否加载中
      pageLoading:false,
      //评论是否加载中
      commentLoading:false,
      //当前获取的数据id
      currentId:null
    }
  },
  mounted() {
    //发起请求
    this.getMvComment(this.$route.params.id,1)
    this.getMvDetail(this.$route.params.id)
    this.getMvUrl(this.$route.params.id)
    this.getSimiMv(this.$route.params.id)

  },
  activated() {
    //如果id一样，不发请求
    if(this.currentId == this.$route.params.id) return
    //发起请求
    this.getMvComment(this.$route.params.id,1)
    this.getMvDetail(this.$route.params.id)
    this.getMvUrl(this.$route.params.id)
    this.getSimiMv(this.$route.params.id)
  },
  deactivated() {},
  methods: {
    //获取mv评论
    async getMvComment(id,curPage) {
      this.commentLoading = true
      const {data} = await request({
        method:'get',
        url:'/comment/mv',
        params: {
          id,
          limit:20,
          offset:(curPage - 1)*20
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.mvComment = data
      this.total = data.total
      this.commentLoading = false
    },
    //获取mv数据
    async getMvDetail(id) {
      this.pageLoading = true
      const {data} = await request({
        method:'get',
        url:'/mv/detail',
        params: {
          mvid:id
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.mvDetail = data.data
      this.pageLoading = false
      this.currentId = data.data.id
    },
    //获取mv地址
    async getMvUrl(id) {
      const {data} = await request({
        method:'get',
        url:'/mv/url',
        params: {
          id
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.mvUrl = data.data
    },
    //获取相似mv
    async getSimiMv(id) {
      const {data} = await request({
        method:'get',
        url:'/simi/mv',
        params: {
          mvid:id
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.simiMv = data.mvs
    },
    //点击分页
    handlePlaylistsPage(val) {
      //获取评论
      this.getMvComment(this.$route.params.id,val)
      //滚动到顶部
      this.$bus.$emit('goTop')
    },
    //跳转到mv播放页面
    toMvsDetail(id) {
      //如果id一样，不发请求
      if(this.$route.params.id == id) return
      this.$router.replace('/mv/'+id)
      //发起请求
      this.getMvComment(this.$route.params.id,1)
      this.getMvDetail(this.$route.params.id)
      this.getMvUrl(this.$route.params.id)
      this.getSimiMv(this.$route.params.id)
    }
  },
  components: {
    CommentCard,
    MvlistCard
  }
}
</script>

<style scoped>
.mv-detail {
  max-width: 1000px;
  margin:0 auto;
  display: flex;
}
.mv-detail .title {
  font-size: 16px;
  font-weight: 500;
  margin:10px 0;
}
.mv-detail .left {
  flex:2;
  text-align: left;
}
.mv-detail .right {
  flex:1;
  text-align: left;
  width:300px;
  margin-left:30px;
}
.left video {
  border-radius: 10px;
  width:100%;
}
.left .author {
  margin:20px 0;
}
.left .author img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
}
.left .author .author-name {
  color:#656766;
  font-size: 14px;
  margin-left:10px;
}
.left .info .mv-title{
  font-size:20px;
  font-weight: 700;
  margin-bottom: 10px;
}
.left .info .mv-info {
  font-size: 12px;
  color:#C2C1C1;
}
.left .info .mv-info span {
  padding-right:10px;
}
.left .comment-list-wrap {
  margin: 30px 0;
}
.right .mv-list-wrap .mv-list-card{
  width: 100%;
  min-width: 300px;
}
</style>
