<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <!-- <router-link to="/login">TRTC</router-link> -->
      <button @click="jumpToTrtc">jump to TRTC</button> |
      <router-link to="/test">test</router-link>

    </div>
    <router-view/>

    
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  
  

  export default {
    methods: {
      jumpToTrtc() {
        this.$router.push({
          path: '/login'
        })
      },
      initListener() {
        // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
        this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
        
        // 收到新消息
        this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
        // 会话列表更新
        this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList)
        
      },
      onReadyStateUpdate({ name }) {
        const isSDKReady = name === this.TIM.EVENT.SDK_READY ? true : false
        this.$store.commit('toggleIsSDKReady', isSDKReady)

        // if (isSDKReady) {
          
          // 登录trtc calling
          this.trtcCalling.login({
            sdkAppID: this.sdkAppID,
            userID: this.userID,
            userSig:this.userSig
          })

          console.error('login success')
        // }
      },
      onReceiveMessage(e){

      },
      onUpdateConversationList(e) {

      },
      imInit() {
        this.tim.login({userID: this.userID, userSig: this.userSig}).then(res => {
          console.error(res,this.userID + '登录成功了')
        })
      },
      async testGet(){
        const res = await axios({
          method: 'GET',
          url:'/mock/news'
        })
        const newsData = res.data
        console.error(newsData,'llk')
      },
      randomParagraph(){
        const a = '一个好的心态，做人拿得起，做事放得下，与人处事合得来，人生在世，有得就有失，有付出就有回报，鱼和熊掌不能兼得，有时你的付出不一定能得到回报，但自己要想明白一些，不要太苛求自己，生命总有它的轮回，上帝是公平的，它对每个人都是一样的垂青，人生苦短，好好的潇洒做一回自己，追求自己的路，过好自己生活'
        const b = a.split('')
        console.log(b)
        const paragrouph = []
        for (let i = 0 ; i < 20 ; i++){
          const randomIndex = Math.floor(Math.random() * b.length)
          const tempArr = []
          for (let j = 0 ; j < randomIndex ; j ++) {
            tempArr.push(b[Math.floor(Math.random()*b.length)])
          }

          paragrouph.push(tempArr.join(''))
        }
        return paragrouph
      },

      

    },
    computed: {
      ...mapState({
        userID: state => state.userID,
        userSig: state => state.userSig,
        sdkAppID: state => state.sdkAppID
      })
    },
    components: {
      // Calling
    },
    mounted() {
      this.imInit()

      this.initListener()
      
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}




</style>
