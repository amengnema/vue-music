import Vue from 'vue'
import Vuex from 'vuex'
import { request } from '../utils/request'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: {
    //获取歌曲链接 [可删除]
    async getMusicLink(context,value) {
      // console.log(value);
      const {data} = await request({
        method: 'get',
        url: '/song/url',
        params: {
          id:value
        }
      })
      context.commit('CHANGE_SONG_LINK',data.data[0].url)
    },
    //播放音乐
    //获取歌曲链接
    //获取歌曲详情
    //相似歌单
    //相似歌曲
    //歌曲评论
    //歌词
    async playMusic(context,value) {
      //获取歌曲链接
      const {data:song_link} = await request({
        method: 'get',
        url: '/song/url',
        params: {
          id:value
        }
      })
      //获取歌曲详情
      const {data:song_detail} = await request({
        method: 'get',
        url: '/song/detail',
        params: {
          ids:value
        }
      })
      //相似歌单
      const {data:simi_playlist} = await request({
        method: 'get',
        url: '/simi/playlist',
        params: {
          id:value
        }
      })
      //相似歌曲
      const {data:simi_song} = await request({
        method: 'get',
        url: '/simi/song',
        params: {
          id:value
        }
      })
      //歌曲评论
      const {data:comment_music} = await request({
        method: 'get',
        url: '/comment/music',
        params: {
          id:value,
          limit:20
        }
      })
      //歌词
      const {data:lyric} = await request({
        method: 'get',
        url: '/lyric',
        params: {
          id:value
        }
      })
      context.commit('CHANGE_SONG_LINK',song_link.data[0].url)
      context.commit('CHANGE_SONG_DETAIL',song_detail.songs)
      context.commit('CHANGE_SIMI_PLAYLIST',simi_playlist.playlists)
      context.commit('CHANGE_SIMI_SONG',simi_song.songs)
      context.commit('CHANGE_COMMENT_MUSIC',comment_music)
      context.commit('CHANGE_LYRIC',lyric)
      context.commit('UPDATE_PLAYING_MUSIC_ID',value)
      // console.log(song_link.data[0].url);
      // console.log(song_detail.songs);
      // console.log(simi_playlist.playlists);
      // console.log(simi_song.songs);
      // console.log(comment_music);
      // console.log(lyric);
    },
    //添加当前歌曲到当前播放列表，判断是否有重复的歌曲
    addSongToPlaylist(context,value) {
      const result = context.state.playlist.filter(item => {
        return item.id === value.id
      })
      if(result.length === 0) {
        context.commit('ADD_SONG_TO_PLAYLIST',value)
      }
    },
    //添加当前歌曲到历史记录，判断是否有重复的歌曲
    addSongToHistory(context,value) {
      const result = context.state.playHistory.filter(item => {
        return item.id === value.id
      })
      if(result.length === 0) {
        context.commit('ADD_SONG_TO_HISTORY',value)
      }
    },
    //清空列表
    deleteList(context,value) {
      if(value === 0) {
        context.commit('DELETE_PLAYLIST')
      }else {
        context.commit('DELETE_PLAY_HISTORY')
      }
    },
    //获取歌曲评论
    async getMusicComment(context,curPage) {
      const {data} = await request({
        method: 'get',
        url: '/comment/music',
        params: {
          id:context.state.playingMusicId,
          limit:20,
          offset:(curPage - 1)*20
        }
      })
      if(data.code != 200) {
        alert('请求失败')
        return
      }
      context.commit('CHANGE_COMMENT_MUSIC',data)
    }
  },
  mutations: {
    //改变歌曲详情显示状态
    CHANGE_PLAYER_DETAIL(state) {
      state.showPlayerDetail = !state.showPlayerDetail
    },
    //改变播放状态，带值
    CHANGE_PLAYING_VALUE(state,value) {
      state.playing = value
    },
    //改变播放状态，不带值
    CHANGE_PLAYING(state) {
      state.playing = !state.playing
    },
    //改变歌曲链接
    CHANGE_SONG_LINK(state,value) {
      state.songLink = value
    },
    //改变歌曲详情
    CHANGE_SONG_DETAIL(state,value) {
      state.songDetail = value
    },
    //改变相似歌单
    CHANGE_SIMI_PLAYLIST(state,value) {
      state.simiPlaylist = value
    },
    //改变相似歌曲
    CHANGE_SIMI_SONG(state,value) {
      state.simiSong = value
    },
    //改变歌曲评论
    CHANGE_COMMENT_MUSIC(state,value) {
      state.commentMusic = value
    },
    //改变歌词
    CHANGE_LYRIC(state,value) {
      state.lyric = value
    },
    //更新播放列表
    UPDATE_PLAYLIST(state,value) {
      state.playlist = value
    },
    //更新正在播放的音乐id
    UPDATE_PLAYING_MUSIC_ID(state,value) {
      state.playingMusicId = value
    },
    //添加当前歌曲到播放列表
    ADD_SONG_TO_PLAYLIST(state,value) {
      state.playlist.push(value)
    },
    //添加当前歌曲到历史记录
    ADD_SONG_TO_HISTORY(state,value) {
      state.playHistory.push(value)
    },
    //删除播放列表
    DELETE_PLAYLIST(state) {
      state.playlist = []
    },
    //删除播放历史记录
    DELETE_PLAY_HISTORY(state) {
      state.playHistory = []
    },
    //改变播放列表的显示与隐藏
    CHANGE_PLAYLIST_DISPLAY(state,value) {
      state.showPlaylist = value
    },
    //改变歌词高亮div
    CHANGE_LYRIC_ACTIVE_DIV(state,value) {
      state.lyricActiveIndex = value
    }
  },
  state: {
    //是否显示歌曲详情
    showPlayerDetail: false,
    //歌曲播放状态
    playing:false,
    //歌曲链接
    songLink:null,
    //歌曲详情
    songDetail:null,
    //相似歌单
    simiPlaylist:null,
    //相似歌曲
    simiSong:null,
    //歌曲评论
    commentMusic:null,
    //歌词
    lyric:null,
    //播放列表
    playlist:[],
    //历史记录
    playHistory:[],
    //正在播放的音乐id
    playingMusicId:null,
    //是否显示播放列表
    showPlaylist:false,
    //歌词高亮的div
    lyricActiveIndex:0
  },
  getters: {}
})

export default store
