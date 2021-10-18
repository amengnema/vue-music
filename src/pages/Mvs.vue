<template>
  <div class="mvs">
    <!-- 标签 -->
    <div class="tags-wrap">
      <div class="tags">
        <span class="tag-type">地区：</span>
        <ul>
          <li
            class="tag"
            :class="{ active: areaTabActive === index }"
            @click="changeArea(index)"
            v-for="(item, index) in areaTabs"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="tags">
        <span class="tag-type">类型：</span>
        <ul>
          <li
            class="tag"
            @click="changeType(index)"
            :class="{ active: typeTabActive === index }"
            v-for="(item, index) in typeTabs"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="tags">
        <span class="tag-type">排序：</span>
        <ul>
          <li
            class="tag"
            @click="changeOrder(index)"
            :class="{ active: orderTabActive === index }"
            v-for="(item, index) in orderTabs"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <!-- MV列表 -->
    <div class="mv-list-wrap" v-loading="loading">
      <MvlistCard
        :picUrl="item.cover"
        :copywriter="item.name"
        :playCount="item.playCount"
        :name="item.name"
        :artists="item.artists"
        v-for="item in mvList"
        :key="item.id"
        @click.native="toMvsDetail(item.id)"
      />
    </div>
  </div>
</template>

<script>
import MvlistCard from '../components/MvlistCard'
import { request } from '../utils/request'
const areaTabs = ['全部', '内地', '港台', '欧美', '韩国', '日本']
const typeTabs = ['全部', '官方版', '原声', '现场版', '网易出品']
const orderTabs = ['上升最快', '最热', '最新']
export default {
  data() {
    return {
      //mv地区
      areaTabs: [],
      //mv类型
      typeTabs: [],
      //mv排序
      orderTabs: [],
      //
      //当前激活的tab
      areaTabActive: 0,
      typeTabActive: 0,
      orderTabActive: 0,
      //mv列表
      // /mv/all
      mvList: [],
      //是否在加载
      loading:false
    }
  },
  created() {
    this.areaTabs = areaTabs
    this.typeTabs = typeTabs
    this.orderTabs = orderTabs
  },
  mounted() {
    this.getMvList({
        area: this.areaTabs[0],
        type: this.typeTabs[0],
        order: orderTabs[0]
      })
  },
  methods: {
    changeArea(value) {
      if (this.areaTabActive == value) return
      this.areaTabActive = value
      this.getMvList({
        area: this.areaTabs[value],
        type: this.typeTabs[this.typeTabActive],
        order: orderTabs[this.orderTabActive]
      })
    },
    changeType(value) {
      if (this.typeTabActive == value) return
      this.typeTabActive = value
      this.getMvList({
        area: this.areaTabs[this.areaTabActive],
        type: this.typeTabs[value],
        order: orderTabs[this.orderTabActive]
      })
    },
    changeOrder(value) {
      if (this.orderTabActive == value) return
      this.orderTabActive = value
      this.getMvList({
        area: this.areaTabs[this.areaTabActive],
        type: this.typeTabs[this.typeTabActive],
        order: orderTabs[value]
      })
    },
    //获取mv列表
    async getMvList(params) {
      this.loading = true
      const {data} = await request({
        method: 'get',
        url: '/mv/all',
        params
      })
      this.mvList = data.data
      this.loading = false
    },
    //跳转到mv播放页面
    toMvsDetail(id) {
      this.$router.push('/mv/'+id)
    }
  },
  components: {
    MvlistCard
  }
}
</script>

<style scoped>
.mvs {
  max-width: 1000px;
  margin:0 auto;
}
.tags-wrap .tags {
  display: flex;
  margin: 10px 0;
}
.tags-wrap .tags ul {
  display: flex;
}
.tags-wrap .tags .tag-type {
  color: #b2b3b3;
  font-size: 14px;
}
.tags-wrap .tags .tag {
  list-style-type: none;
  color: #878887;
  font-size: 12px;
  padding: 0 10px;
  margin: 0 10px;
  position: relative;
  border-radius: 30px;
}
.tags-wrap .tags .tag.active,
.tags-wrap .tags .tag.active:hover {
  color: #d33a31;
  background-color: #fdf6f5;
}
.tags-wrap .tags .tag:after {
  position: absolute;
  height: 60%;
  content: '';
  width: 1px;
  left: -10px;
  top: 2px;
  background-color: #b2b3b3;
}
.tags-wrap .tags .tag:hover {
  cursor: pointer;
  color: #b2b3b3;
}
.mv-list-wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 23px 2px;
}
</style>
