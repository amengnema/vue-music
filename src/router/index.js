import Vue from 'vue'
import VueRouter from 'vue-router'

import Discovery from '../pages/Discovery'
import Playlists from '../pages/Playlists'
import Songs from '../pages/Songs'
import Mvs from '../pages/Mvs'
import PlaylistDetail from '../pages/PlaylistDetail'
import MvDetail from '../pages/MvDetail'
import Search from '../pages/Search'

Vue.use(VueRouter)



export default new VueRouter({
  routes: [
    {
      path:'/',
      redirect:'/discovery'
    },
    {
      path:'/discovery',
      component:Discovery
    },
    {
      path:'/playlists',
      component:Playlists
    },
    {
      path:'/playlist/:id',
      component:PlaylistDetail
    },
    {
      path:'/songs',
      component:Songs
    },
    {
      path:'/mvs',
      component:Mvs
    },
    {
      path:'/mv/:id',
      component:MvDetail
    },
    {
      path:'/search/:keyword',
      component:Search
    }
  ]
})
