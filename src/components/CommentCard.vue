<template>
  <div class="comment-card">
    <div class="img-wrap">
      <img v-lazy="avatarUrl + '?param=30y30'" :alt="nickname" />
    </div>
    <div class="content-wrap">
      <div class="top">
        <span class="name">{{ nickname }}：</span>
        <span class="content">{{ content }}</span>
      </div>
      <div class="reply" v-if="beReplied.length">
        <span class="name">@{{ beReplied[0].user.nickname }}：</span>
        <span class="content">{{ beReplied[0].content }}</span>
      </div>
      <div class="bottom">
        <div class="time">{{ time | dayFormat }}</div>
        <div class="liked">
          <i class="el-icon-magic-stick">{{ likedCount }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['avatarUrl', 'nickname', 'content', 'beReplied', 'time', 'likedCount']
}
</script>

<style scoped>
.comment-card {
  display: flex;
  padding: 13px 0;
}
.comment-card .img-wrap {
  width: 35px;
  height: 35px;
}
.comment-card .img-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.comment-card .content-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 14px;
  margin-left: 14px;
  flex: 1;
  border-bottom: 1px solid #f2f2f3;
}
.comment-card .content-wrap .top {
  text-align: left;
  padding: 10px 0;
}
.comment-card .content-wrap .top .name {
  color: #507daf;
}
.comment-card .content-wrap .reply {
  text-align: left;
  background-color: #f5f5f5;
  padding: 6px 8px;
  font-size: 12px;
}
.comment-card .content-wrap .reply .name {
  color: #507daf;
}
.comment-card .content-wrap .reply .content {
  color: #626262;
}
.comment-card .content-wrap .bottom {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}
.comment-card .content-wrap .bottom .time {
  color: #bfbfbf;
  font-size: 13px;
}
</style>
