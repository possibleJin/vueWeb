<template>
  <div class="about" style="padding:0;margin:0">
    
    <!-- <div style="display:flex">
      <div id="local-video" style="width:200px;height:200px;margin-right:10px;background: red"></div>
      <div id="remote-video" style="width:200px;height:200px;margin-right:10px;background: yellow"></div>
    </div> -->
    <div>
      <div>视频通话</div>
      <div style="width:30%;display:flex">
        <button @click="videoCall">视频通话</button>
        <button @click="audioCall">语音通话</button>
        <button @click="startTime">startTime</button>
        <button @click="stopTime">stopTime</button>
        
      </div>
      <div>计时：{{formatDuration}}</div>
    </div>

    <div class="call-layer">
      <calling  ref="callLayer" class="chat-wrapper"/>
    </div>

    <div class="group-live">
      <button @click="groupLive">群直播</button>
      <group-live />
    </div>
    <div>
      <img :src="src" alt="" style="width:100px; height:100px">
      <img src="https://avatar.csdn.net/6/1/5/2_sj13120545905.jpg" alt="" style="width:100px; height:100px">
    </div>
    
  </div>
</template>

<script>

import Calling from './trtc-calling/calling-index.vue'
import GroupLive from './group-live/index.vue'

import {mapGetters} from 'vuex'

import {formatDuration} from '../utils/formatDuration'



export default {
  data() {
    return {
      value: '',
      duration: 0, 
      start: 0,

      src: 'https://avatar.csdn.net/6/1/5/2_sj13120545905.jpg'
    }
  },
  directives: {
    test: {
      inserted(el,binding) {
        // // el.focus()
        // el.style.color = 'red'
        // binding.value = 'kkkkk'
        el.setAttribute('src',binding.value)
      },
      componentUpdated() {

      }
    }
  },
  mounted() {

  },
  methods: {
    // formatDuration() {
    //   return formatDuration(this.duration)
    // },
    stopTime() {
      this.resetDuration(0)
    },
    startTime() { // 对方接听自己发起的电话
      clearTimeout(this.timer)
      this.resetDuration(0)
      this.start = new Date()
    },
    resetDuration(duration) {
      this.duration = duration
      this.hangUpTimer = setTimeout(() => {
        let now = new Date()
        this.resetDuration(parseInt((now - this.start) / 1000))
      }, 1000)
    },
    videoCall() {
      // 呼叫方设置
      
      let callingData = {
        memberList: ['user1'],
        type:'C2C'
      }
      this.$store.commit('setCallingList',callingData)
      this.$bus.$emit(`video-call`) 
    },
    audioCall() {
      let callingData = {
        memberList: ['user1'],
        type:'C2C'
      }
      this.$store.commit('setCallingList',callingData)
      this.$bus.$emit(`audio-call`) 
    },

    /**
     * 群直播相关
     */

    groupLive() {
      const toAccount = 'user24';//返回会话conversationID
      const userID = 'user24';//主播
      this.$store.commit('updateGroupLiveInfo', {
        groupID: toAccount,
        anchorID: userID,
      })
      this.$bus.$emit('open-group-live', { channel: 1 })
    },
  },
  components:{ 
    Calling,
    GroupLive 
  },
  computed: {
    formatDuration() {
      return formatDuration(this.duration)
    },
    ...mapGetters(['toAccount', 'currentConversationType']),
  }
}
</script>

<style scoped>
.chat-wrapper .official-link {
  display: flex;
  text-decoration: none;
  color: #38c9ff;
  width: fit-content;
  float: right;
  height: 45px;
  align-items: center;
}

.chat-wrapper {
  margin-top: 8vh;
  /* width: 100vw;
  height: 100vw; */
  width: 800px;
  height: 400px;
  max-width: 1280px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
}
</style>
