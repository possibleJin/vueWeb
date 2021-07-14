<template>
  <div class="home">
    <div>tweblive</div>
    <div class="video-container" style="display: flex">
        <div class="box1">
            <div>本地</div>
            <div id="local" style="width:200px;height:200px;border:1px solid"></div>
        </div>
        <div class="box2">
            <div>远端</div>
            <div id="remote" style="width:200px;height:200px;border:1px solid"></div>
        </div>
    </div>
    <div class="player" style="margin-top:40px">
        <!-- <video id="player-container-id" preload="auto" width="640" height="320" playsinline webkit-playsinline>
        </video> -->
        <el-button type="text" @click="testClick">打开嵌套的video Dialog</el-button>
        <el-dialog 
            :before-close="handleClose"
            :visible.sync="dialogFormVisible"
            width="60%"
            title="video">
            <video id="player-container-id" preload="auto" playsinline webkit-playsinline>
            </video>
        </el-dialog>
        <!-- <el-progress :percentage="percentage" style="width:640px"></el-progress> -->

        <el-progress :percentage="percentage" style="width:640px"></el-progress>

    </div>

    <div style="width:500px; height: 500px; border:1px solid;margin-top:20px">
        <div id="id_local_video" style="width:200px;height:200px;display:flex;"></div>
        <div>
            <button @click="startPusher">开启直播</button>
            <button @click="stopPusher">关闭直播</button>
            <button @click="switchCamera">切换摄像头</button>
            <button @click="switchAudio">切换摄麦克风</button>
            <button @click="switchDevice">切换设备</button>
            <button @click="checkSupport">检测兼容</button>
        </div>
        <div v-if="isTest" style="font-size: 12px;">
            <div>
                <p>isH264DecodeSupported:{{testResult.isH264DecodeSupported}}</p>
                <p>isH264EncodeSupported:{{testResult.isH264EncodeSupported}}</p>
                <p>isMediaDevicesSupported:{{testResult.isMediaDevicesSupported}}</p>
                <p>isMediaFileSupported:{{testResult.isMediaFileSupported}}</p>
                <p>isScreenCaptureSupported:{{testResult.isScreenCaptureSupported}}</p>
                <p>isWebRTCSupported:{{testResult.isWebRTCSupported}}</p>
            </div>
            <button @click="closeTest">关闭测试结果</button>
        </div>
    </div>
  </div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
import { genTestUserSig } from "../../public/debug/GenerateTestUserSig";

export default {
  name: 'Home',
  data(){
    return {
      localStream: '',
      client: '',
      userid: `user${Math.floor(Math.random() * 10)}`,
      info: {},
      roomId: 999,
      tcplayer: null,
      livePusher: null,
      isCamera: true,
      isAudio: true,

      cameraArr: [],
      audioArr: [],
      isTest: false,
      testResult: null,

      radio:true,
      percentage: 0,

      dialogFormVisible: false
    }
  },
  components: {
    
  },
  mounted() {
    console.error(genTestUserSig,'genTestUserSig')
    // const client = TRTC.createClient({
    //     mode: 'rtc',
    //     sdkAppId: genTestUserSig('').sdkAppID,
    //     userId: this.userid,
    //     userSig: genTestUserSig(this.userid).userSig,
    //     // useStringRoomId: true
    // });
    // this.client = client
    // this.join(this.client)

    // this.bindHandle(client)

    // 实现超级播放器集成
    // this.videoInit()

    // var tcplayer = TCPlayer('player-container-id', { // player-container-id 为播放器容器ID，必须与html中一致
    //     fileID: '3701925919395945758', // 请传入需要播放的视频filID 必须
    //     appID: '1500001825', // 请传入点播账号的appID 必须
    //     //其他参数请在开发文档中查看
    //     plugins: {
    //         ProgressMarker: true
    //     }
    // });
    // this.tcplayer = tcplayer



    // this.tcplayer.on('durationchange',(e)=>{
    //     console.error(tcplayer.currentTime(),e)
    //     this.percentage = this.tcplayer.currentTime()
    // })
    // this.tcplayer.on('progress',(e)=>{
    //     console.error(tcplayer.currentTime(),e)
    //     this.percentage = this.tcplayer.currentTime()
    // })

    // 实现web端推流
    // this.livePusherInit()
  },
  watch: {
    // percentage(newName, oldName) {
    //   // ...
    //   return newName
    // }
  }, 
  methods: {
    // percentage(){
    //     this.tcplayer.currentTime
    // },
    handleClose(done) {
        this.tcplayer.pause()
        done()
    },
    testClick() {
        this.dialogFormVisible = true
        this.videoInit()
    },

    closeTest() {
        this.isTest = false
        this.testResult = null
    },
    checkSupport() {
        TXLivePusher.checkSupport().then((data)=> {  
            // 是否支持WebRTC  
            console.error(data,'checkSupport')
            this.testResult = data
            this.isTest = true
            if (data.isWebRTCSupported) {    
                console.log('WebRTC Support');  
            } else {    
                console.log('WebRTC Not Support');  
            }  
            // 是否支持H264编码  
            if (data.isH264EncodeSupported) {    
                console.log('H264 Encode Support');  
            } else {    
                console.log('H264 Encode Not Support');  
            }
        });
    },
    switchAudio() {
        if(this.isAudio) {
            // 关闭摄像头
            this.livePusher.stopMicrophone();
            this.isAudio = !this.isAudio
            console.error('stopMicrophone')
        } else {
            // 打开摄像头
            this.livePusher.startMicrophone();
            this.isAudio = !this.isAudio
            console.error('startMicrophone')
        }
    },
    switchDevice() {
        const deviceManager = this.livePusher.getDeviceManager();
        console.error(deviceManager)

        deviceManager.getDevicesList().then((data)=> {
            console.error(data)
            data.forEach((device)=> {
                console.log(device.deviceId, device.deviceName);  
                if (device.type == "video") {
                    this.cameraArr.push(device)
                } else if(device.type == 'audio') {
                    this.audioArr.push(device)
                }
            });
            // console.error(this.cameraArr,this.audioArr)
            // 去重
            this.cameraArr = this.cameraArr.map(item => {

            })
            this.cameraArr = [...new Set(this.cameraArr)]
            this.audioArr = [...new Set(this.audioArr)]
            console.error(this.cameraArr,this.audioArr)

            deviceManager.switchCamera(this.cameraArr[Math.floor(Math.random() * this.cameraArr.length)].deviceId);
        });
        
    },
    switchCamera() {
        if(this.isCamera) {
            // 关闭摄像头
            this.livePusher.stopCamera();
            this.isCamera = !this.isCamera
        } else {
            // 打开摄像头
            this.livePusher.startCamera();
            this.isCamera = !this.isCamera
        }
    },
    stopPusher() {
        this.livePusher.stopPush()
    },
    startPusher() {
        // 推流的流id为streamName
        this.livePusher.startPush('webrtc://99592.livepush.erickyan.com/live/qqq?txSecret=446e0bcd004a192ee90083428b3f9d8a&txTime=60DAE291')
    },
    async livePusherInit() {
        // 通过全局对象 TXLivePusher 生成 SDK 实例，后续操作都是通过实例完成。
        const livePusher = new TXLivePusher();
        // 保存livePUsher
        this.livePusher = livePusher
        // 指定本地视频播放器容器 div，浏览器采集到的音视频画面会渲染到这个 div 当中。
        livePusher.setRenderView('id_local_video');

        // 采集音视频流之前，先进行音视频质量设置，如果预设的质量参数不满足需求，可以单独进行自定义设置。
        // 设置视频质量
        livePusher.setVideoQuality('720p');
        // 设置音频质量
        livePusher.setAudioQuality('standard');
        // 自定义设置帧率
        livePusher.setProperty('setVideoFPS', 25);
        // 打开摄像头
        livePusher.startCamera();
        // 打开麦克风
        livePusher.startMicrophone();

        this.livePusher.setObserver({
                // 推流警告信息
            onWarning: function(code, msg) {
                console.log(code, msg);
            },
                // 推流连接状态
            onPushStatusUpdate: function(status, msg) {
                console.log(status, msg);
            },
                // 推流统计数据
            onStatisticsUpdate: function(data) {
                console.log('video fps is ' + data.video.framesPerSecond);
            }
        })
    },
    videoInit() {
        this.$nextTick(() => {
            if (this.tcplayer) {
                this.tcplayer.currentTime(0)
                this.tcplayer.play()
            }
            var tcplayer = TCPlayer('player-container-id', { // player-container-id 为播放器容器ID，必须与html中一致
                fileID: '3701925919395945758', // 请传入需要播放的视频filID 必须
                appID: '1500001825', // 请传入点播账号的appID 必须
                //其他参数请在开发文档中查看
                plugins: {
                    ProgressMarker: true
                },
                width:"640" ,
                height:"320" 
            });
            this.tcplayer = tcplayer
            this.tcplayer.on('timeupdate',(e)=>{
                console.error(this.tcplayer.duration(),this.tcplayer.currentTime(),e)
                // 10.16    10.495418 
                
                this.percentage = (this.tcplayer.currentTime() / this.tcplayer.duration()) * 100
            })
        })
    },
    async join(client){
        await client.join({
            roomId: this.roomId
        })
        console.log('success to join')
        // var userid = 
        const localStream = TRTC.createStream({ userId: this.userid, audio: true, video: true });
        this.localStream = localStream

        await localStream.initialize()
        console.log('success to initailize')

        await client.publish(localStream)
        console.log('success to publixh')

        localStream.play('local');
    },
    bindHandle(client_){
      console.log('jjkk',client_)
      //链接通话时对系统错误进行监听
      client_.on('error', err => {
          console.error(err);
          alert(err);
          location.reload();
      });

      //用户被踢出群
      //通过监听client-banned事件，在回调中判断
      client_.on('client-banned', err => {
          // console.error('client has been banned for ' + err);
          // if (!isHidden()) {
          //     alert('您已被踢出房间');
          //     location.reload();
          // } else {
          //     //浏览器标签页被隐藏或显示的时候会触发visibilitychange事件
          //     document.addEventListener('visibilitychange',() => {
          //         if (!isHidden()) {
          //             alert('您已被踢出房间');
          //             location.reload();
          //         }
          //     },false); 
          // }
      });

      client_.on('NETWORK_QUALITY',(res) => {
          console.log('newtwork is:' + res)
      })

      client_.on('CONNECTION_STATE_CHANGED',(res) => {
          console.log('newtwork is:' + res)
      })
      // fired when a remote peer is joining the room
      client_.on('peer-join', evt => {
          const userId = evt.userId;
          console.log('peer-join ' + userId);
      });
      // fired when a remote peer is leaving the room
      client_.on('peer-leave', evt => {
          const userId = evt.userId;
          console.log('peer-leave ' + userId);
      });

      // 当一个远程流增加的时候 
      client_.on('stream-added', evt => {
          //获取该用户流的ID
          const remoteStream = evt.stream;
          const uid = remoteStream.getUserId();
          const streamId = remoteStream.getId()
          const uidStreamId = uid + '-' + streamId

          console.error('getType',remoteStream.getType())

          client_.subscribe(remoteStream, { audio: true, video: true }).catch(e => {
              console.error('failed to subscribe remoteStream');
          });
          console.error(uid,streamId)

          console.error('-------------------------------')

          // const newDiv = document.createElement('div')
          // const remoteVideoBox = document.getElementById('remoteVideoBox')
          // console.error(remoteVideoBox)
          // newDiv.setAttribute('id',uidStreamId)  
          // newDiv.setAttribute('style',"width: 100px; height: 100px")
          // remoteVideoBox.appendChild(newDiv)

          remoteStream.play('remote')
      });

      // fired when a remote stream has been subscribed
      client_.on('stream-subscribed', evt => {
          // const remoteStream = evt.stream;
          // const uid = remoteStream.getUserId();
          // const streamId = remoteStream.getId()
          // const uidStreamId = uid + '-' + streamId

          // client_.subscribe(remoteStream, { audio: true, video: true }).catch(e => {
          //     console.error('failed to subscribe remoteStream');
          // });
          // console.error(uid,streamId)

          // console.error('-------------------------------')

          // const newDiv = document.createElement('div')
          // const remoteVideoBox = document.getElementById('remoteVideoBox')
          // console.error(remoteVideoBox)
          // newDiv.setAttribute('id',uidStreamId)  
          // newDiv.setAttribute('style',"width: 100px; height: 100px")
          // remoteVideoBox.appendChild(newDiv)

          // remoteStream.play(uidStreamId)
              
      });

      //远端用户取消发布流后通知
      client_.on('stream-removed', evt => {
          const remoteStream = evt.stream;

          //将移除的远端流的节点关闭
          remoteStream.close()
          remoteStream.stop()
      });

      //远端流更新事件，当远端用户添加、移除或更换音视频轨道后会收到该通知。
      client_.on('stream-updated', evt => {
          const remoteStream = evt.stream;
      });

      //远端用户禁用音频
      client_.on('mute-audio', evt => {  
          console.log(evt.userId + ' mute audio');
      });
      //远端用户打开音频
      client_.on('unmute-audio', evt => {
          console.log(evt.userId + ' unmute audio');
      });
      //远端用户禁用视频
      client_.on('mute-video', evt => {
          console.log(evt.userId + ' mute video');
      });
      //远端用户禁用视频
      client_.on('unmute-video', evt => {
          console.log(evt.userId + ' unmute video');
      });
      
      client_.on('error', evt => {
          console.log(evt.getCode)
      })
    }
  }

}
</script>

<style scoped>

</style>>

