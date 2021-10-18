<template>
  <el-header>
    <div class="left">
      <div class="btns">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="close" v-if="showPlayerDetail">
        <span @click="closePlayerDetail"><i class="el-icon-arrow-down"></i></span>
      </div>
      <div class="pre-next" v-else>
        <span @click="$router.go(-1)"><i class="el-icon-arrow-left"></i></span>
        <span @click="$router.go(1)"><i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
    <div class="right">
      <div class="search-wrap" @click.stop="onSearchPanel">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model.trim="inputValue"
          @input="onInput"
          @keydown.enter.native="handleSearch"
        >
        </el-input>

        <!-- 侧边搜索界面 -->
        <div
          class="search active1"
          :class="{ active: showSearchPanel === true }"
        >
          <div class="history" v-if="inputValue === ''">
            <div class="title">搜索历史<i class="el-icon-delete" @click.stop="dialogVisible = true"></i></div>
            <div class="history-tags">
              <span class="tag-item" v-for="(item,index) in searchHistory" :key="index" @click.stop="searchTag(item)">{{item}}</span>
            </div>
          </div>
          <div class="hot" v-if="inputValue === ''">
            <div class="title">热搜榜</div>
            <div class="hot-list">
              <div
                class="hot-list-item"
                :class="{ 'hot-top': index < 3 }"
                v-for="(item, index) in hotDetail"
                :key="index"
                @click.stop="searchTag(item.searchWord)"
              >
                <div class="order">{{ index + 1 }}</div>
                <div class="content">
                  <div class="top">
                    <span class="name" :title="item.searchWord">{{
                      item.searchWord
                    }}</span>
                    <span class="icon-url"
                      >&nbsp;
                      <img
                        v-if="item.iconUrl"
                        :src="item.iconUrl"
                        :alt="item.searchWord"
                      />
                      &nbsp;</span
                    >
                    <span class="score">{{ item.score }}</span>
                  </div>
                  <div class="bottom">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="search-result" v-else>
            <div class="go-search" @click.stop="handleSearch()">搜“<span class="keyword">{{inputValue}}</span>”的相关结果<i class="el-icon-arrow-right"></i></div>
            <!-- 单曲 -->
            <div class="result-songs" v-if="searchSuggest.songs">
              <div class="result-title"><i class="el-icon-cold-drink"></i>单曲</div>
              <div class="result-wrap" >
                <div class="result-item" @click.stop="playMusic(item.id)" v-for="item in searchSuggest.songs" :key="item.id" v-html="songResult(item)"></div>
              </div>
            </div>
            <!-- 歌手 -->
            <div class="result-artists" v-if="searchSuggest.artists">
              <div class="result-title"><i class="el-icon-user"></i>歌手</div>
              <div class="result-wrap">
                <div class="result-item" @click.stop v-for="item in searchSuggest.artists" :key="item.id" v-html="artistResult(item)"></div>
              </div>
            </div>
            <!-- 专辑 -->
            <div class="result-albums" v-if="searchSuggest.albums">
              <div class="result-title"><i class="el-icon-help"></i>专辑</div>
              <div class="result-wrap">
                <div class="result-item" @click.stop v-for="item in searchSuggest.albums" :key="item.id" v-html="songResult(item)"></div>
              </div>
            </div>
            <!-- 歌单 -->
            <div class="result-playlists" v-if="searchSuggest.playlists">
              <div class="result-title"><i class="el-icon-document"></i>歌单</div>
              <div class="result-wrap">
                <div class="result-item" @click.stop="toPlaylistDetail(item.id)" v-for="item in searchSuggest.playlists" :key="item.id" v-html="artistResult(item)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @click.native.stop
      >
      <span @click.stop>确定删除搜索记录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="deleteHistory">确 定</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
import _ from 'lodash'
import {request} from '../utils/request'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      //搜索框的值
      inputValue: '',
      //是否显示搜索窗口
      showSearchPanel: false,
      // 热搜列表(详细)
      // /search/hot/detail  [res.data]
      hotDetail: [],
      //搜索建议
      // /search/suggest?keywords=周杰伦 [res.result]
      searchSuggest:  {},
      //搜索历史
      searchHistory:[],
      //是否显示对话框
      dialogVisible: false
    }
  },
  mounted() {
    let that = this
    document
      .querySelector('.el-container')
      .addEventListener('click', function() {
        that.showSearchPanel = false
        that.$store.commit('CHANGE_PLAYLIST_DISPLAY',false)
      })
  },
  methods: {
    //获取热搜详细列表
    async getHotDetail() {
      const {data} = await request({
        method:'get',
        url:'/search/hot/detail'
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.hotDetail = data.data
    },
    //搜索建议
    async getSearchSuggest(keywords) {
      const {data} = await request({
        method:'get',
        url:'/search/suggest',
        params: {
          keywords
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      this.searchSuggest = data.result
    },
    //点击显示搜索窗口
    onSearchPanel() {
      this.showSearchPanel = true
      //如果热搜列表有值，不发请求
      if(this.hotDetail.length>0) return
      //发请求
      this.getHotDetail()
    },
    //搜索框输入
    onInput: _.debounce(function() {
      if(this.inputValue.trim() == '') return
      //发起请求
      this.getSearchSuggest(this.inputValue)
      console.log(this.inputValue)
    }, 1000),
    //去搜索页面
    handleSearch() {
      if(this.inputValue === '') return
      this.$router.push(`/search/${this.inputValue}`)
      this.showSearchPanel = false
      //把搜索词加入历史
      const a = this.searchHistory.filter(item => {
        return item == this.inputValue
      })
      if(a.length == 0) {
        this.searchHistory.push(this.inputValue)
      }
    },
    //点击标签搜索
    searchTag(value) {
      this.$router.push(`/search/${value}`)
      this.showSearchPanel = false
    },
    //搜索建议里面点击播放音乐
    playMusic(id) {
      console.log(id)
      this.showSearchPanel = false
    },
    //跳转到歌单详情
    toPlaylistDetail(id) {
      this.$router.push(`/playlist/${id}`)
      this.showSearchPanel = false
    },
    //删除历史记录
    deleteHistory() {
      this.searchHistory = []
      this.dialogVisible = false
      this.$message({
        message:'删除成功',
        type:'success'
      });
    },
    //关闭详情面板
    closePlayerDetail() {
      this.$store.commit('CHANGE_PLAYER_DETAIL')
    }
  },
  computed: {
    ...mapState(['showPlayerDetail']),
    //歌曲
    songResult() {
      return function(item) {
        //歌曲名
        let songName = item.name
        //歌手名
        let artistName = ''
        //判断是专辑还是单曲
        if(item.artist) {
          artistName = item.artist.name
        } else {
            item.artists.forEach((artist,i) => {
            if(i == 0) {
              artistName += artist.name
            }else {
              artistName += ' / ' + artist.name
            }
          })
        }
        // 匹配关键字正则
        let replaceReg = new RegExp(this.inputValue, 'g');
        // 高亮替换v-html值
        let replaceString = '<span class="keyword">' + this.inputValue + '</span>';
        // 开始替换
        songName = songName.replace(replaceReg, replaceString);
        artistName = artistName.replace(replaceReg, replaceString);
        return songName + ' - ' + artistName
      }
    },
    //歌手
    artistResult() {
      return function(item) {
        let artistName = item.name
        // 匹配关键字正则
        let replaceReg = new RegExp(this.inputValue, 'g');
        // 高亮替换v-html值
        let replaceString = '<span class="keyword">' + this.inputValue + '</span>';
        // 开始替换
        artistName = artistName.replace(replaceReg, replaceString);
        return artistName
      }
    }
  },
  beforeDestroy() {
    document.querySelector('.el-container').removeEventListener('click',() => {})
  }
}
</script>

<style scoped>
.el-header {
  width: 100%;
  box-shadow: inset 0px 0px 2px #888888;
  background-color: #fff;
  color: #333;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header .left {
  display: flex;
}
.el-header .btns span {
  width:13px;
  height:13px;
  display: inline-block;
  margin-right:8px;
  border-radius: 50%;
}
.el-header .btns span:nth-child(1) {
  background-color: #FE5F57;
}
.el-header .btns span:nth-child(2) {
  background-color: #FDBD2E;
}
.el-header .btns span:nth-child(3) {
  background-color: #2BCA41;
}
.el-header .close {
  margin-left: 50px;
}
.el-header .close span {
  width:20px;
  height:20px;
  display: inline-block;
  margin-right:8px;
  border-radius: 50%;
}
.el-header .close span:hover {
  background-color: #EDECEC;
  cursor: pointer;
}
.el-header .pre-next {
  margin-left:50px;
}
.el-header .pre-next span {
  width:20px;
  height:20px;
  display: inline-block;
  margin-right:8px;
  border-radius: 50%;
}
.el-header .pre-next span:hover {
  background-color: #EDECEC;
  cursor: pointer;
}
/deep/ .right .search-wrap .el-input input {
  width: 160px;
  height: 23px;
  line-height: 23px;
  border-radius: 15px;
}
/deep/ .right .search-wrap .el-input .el-input__icon {
  line-height: 24px;
}
/* 搜索界面 */
.search {
  position: fixed;
  right: -400px;
  width: 400px;
  background-color: #fcfcfc;
  box-shadow: 0px 0px 5px #888888;
  display: flex;
  flex-direction: column;

  top: 60px;
  height: calc(100vh - 120px);
  z-index: 3;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
}
.search.active {
  right: 0;
}
.search .history {
  margin-top: 10px;
}
.search .title {
  font-size: 14px;
  color: #6b6a6a;
  padding: 0 15px;
}
.search .title .el-icon-delete {
  padding: 0 8px;
}
.search .title .el-icon-delete:hover {
  cursor: pointer;
}
.search .history .history-tags {
  margin: 20px 0;
  font-size: 12px;
  color: #333333;
}
.search .history-tags .tag-item {
  padding: 5px 15px;
  border: 1px solid #dedddd;
  border-radius: 50px;
  margin: 0 10px;
}
.search .history-tags .tag-item:hover {
  cursor: pointer;
  background-color: #dedddd;
}
.search .hot .hot-list-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.search .hot-list-item .order {
  width: 60px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #bebec0;
}
.search .hot-list-item.hot-top .order {
  color: #ff3939;
}
.search .hot-list-item.hot-top .top .name {
  font-weight: 700;
}
.search .hot-list-item .content {
  font-size: 13px;
  color: #333333;
  flex: 1;
  min-width: 0;
}
.search .hot-list-item .top {
  margin-bottom: 4px;
}
.search .hot-list-item .top .icon-url {
  width: 10px;
}
.search .hot-list-item .top .icon-url img {
  width: auto;
  height: 12px;
}
.search .hot-list-item .top .score {
  padding-right: 10px;
  font-size: 12px;
  color: #cdcecd;
}
.search .hot-list-item .bottom {
  color: #9d9d9d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search .hot .hot-list-item:hover {
  background-color: #f0efef;
  cursor: pointer;
}
/* 搜索建议 */
.search .search-result .go-search {
  color:#666567;
  font-size: 12px;
  margin:10px;
}
.search .search-result .go-search:hover {
  cursor: pointer;
}
.search .search-result .result-title {
  font-size: 14px;
  color:#6b6a6a;
  padding:5px 10px;
}
.search .search-result .result-title i {
  padding-right:4px;
}
.search .result-wrap .result-item  {
  font-size: 14px;
  color:#353636;
  padding:8px 28px;
}
.search .result-wrap .result-item:hover {
  background-color: #f0efef;
  cursor: pointer;
}
</style>

<style>
.search .search-result .keyword,
.search .search-content .keyword
{
  color:#507CAE;
}
</style>
