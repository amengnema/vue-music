<template>
  <div class="playlists">
    <!-- 顶部卡片 -->
    <div class="top-card" v-if="highqualityPlaylist.length" @click="toPlaylistDetail(highqualityPlaylist[0].id)">
      <div class="left-img">
        <img v-lazy="highqualityPlaylist[0].coverImgUrl+ '?param=300y300'" alt="highqualityPlaylist[0].name" />
      </div>
      <div class="right-content">
        <div class="tag">
          <span>精品歌单</span>
        </div>
        <div class="name">{{highqualityPlaylist[0].name}}</div>
        <div class="desc">
          {{highqualityPlaylist[0].description}}
        </div>
      </div>
    </div>
    <!-- 歌单标签 -->
    <div class="tags">
      <div class="tag" :class="{active: currentCatId === 0}" @click="handleTagClick(0,'全部')">全部</div>
      <div class="tag" :class="{active: currentCatId === item.id}" v-for="item in tags" :key="item.id" @click="handleTagClick(item.id,item.name)">{{ item.name }}</div>
    </div>
    <!-- 歌单列表 -->
    <div class="playlist-cards" v-loading="loading">
      <!-- 歌单组件 -->
      <PlaylistCard
        :copywriter="'播放量：'+item.playCount"
        :picUrl="item.coverImgUrl"
        :name="item.name"
        v-for="item in playlist"
        :key="item.id"
        @click.native="toPlaylistDetail(item.id)"
      />
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
</template>

<script>
import PlaylistCard from '../components/PlaylistCard'
import {request} from '../utils/request'
export default {
  data() {
    return {
      //热门歌单分类
      // /playlist/hot
      tags: [],
      //歌单列表 ( 网友精选碟 )
      // /top/playlist  or  /top/playlist?cat=xxx
      playlist: [],
      //精品歌单
      // /top/playlist/highquality?cat=xxx
      highqualityPlaylist: [],
			//当前分类id
			currentCatId:0,
      //总数
      total:0,
      //加载效果
      loading:false
    }
  },
  mounted() {
    //发起请求
		this.getTags()
		this.getPlaylist('全部',1)
		this.getHighqualityPlaylist('全部')
	},
  methods: {
		//跳转到歌单详情
    toPlaylistDetail(id) {
      this.$router.push(`/playlist/${id}`)
    },
		//点击标签
		handleTagClick(id,cat) {
			if(this.currentCatId === id) return
			this.currentCatId = id
      //发起请求，获取新歌单
      //总数设置成0，点击标签后会重新设置分页
      this.total = 0
      this.getPlaylist(cat,1)
      this.getHighqualityPlaylist(cat)
		},
    //获取分类
    async getTags() {
      const {data} = await request({
        method:'get',
        url:'/playlist/hot'
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.tags = data.tags
    },
		//获取网友精选碟
		async getPlaylist(cat,curPage) {
      this.loading = true
			const {data} = await request({
        method:'get',
        url:'/top/playlist',
        params: {
          cat,
          limit:50,
          offset:(curPage - 1)*50
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.playlist = data.playlists
      this.total = data.total
      this.loading = false
		},
    //获取精品歌单
    async getHighqualityPlaylist(cat) {
      const {data} = await request({
        method:'get',
        url:'/top/playlist/highquality',
        params: {
          cat,
          limit:1
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.highqualityPlaylist = data.playlists
    },
    //点击分页
    handlePlaylistsPage(val) {
      //发起请求
      // this.getPlaylist(cat,val)
      if(this.currentCatId == 0) {
        this.getPlaylist('全部',val)
      }else {
        let a = this.tags.filter(item => {
          return item.id == this.currentCatId
        })
        this.getPlaylist(a[0].name,val)
      }
      //滚动到顶部
      this.$bus.$emit('goTop')
    }
  },
  components: {
    PlaylistCard
  }
}
</script>

<style scoped>
.playlists {
  max-width: 1000px;
  margin:0 auto;
}
/* 顶部卡片 */
.playlists .top-card {
  background: #000000;
  display: flex;
  padding: 10px;
  align-items: center;
  cursor: pointer;
}
.playlists .top-card .left-img {
  width: 160px;
  height: 160px;
  border: 1px solid #00f;
}
.playlists .top-card .left-img img {
  height: 100%;
  width: 100%;
}
.playlists .top-card .right-content {
  padding: 10px;
  text-align: left;
  flex: 1;
}
.top-card .right-content .tag {
  display: inline-block;
  border: 1px solid #e7aa5a;
  border-radius: 20px;
  padding: 3px 12px;
  margin-bottom: 10px;
}
.top-card .right-content .tag span {
  color: #e7aa5a;
  font-size: 14px;
}
.top-card .right-content .name {
  font-size: 16px;
  color: #fff;
  margin: 8px 0;
}
.top-card .right-content .desc {
  font-size: 12px;
  color: #8c8c8c;
}
/* 歌单标签 */
.playlists .tags {
  display: flex;
  text-align: left;
  margin: 20px 0;
  font-size: 12px;
  color: #878788;
  flex-wrap: wrap;
}
.playlists .tag {
  margin: 0 5px;
	padding: 0 10px;
	border-radius: 30px;
}
.playlists .tag:hover {
	cursor: pointer;
}
.tags .active {
	color: #d33a31;
  background-color: #fdf6f5;
}
/*  */
.playlist-cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
