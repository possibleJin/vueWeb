<template>
    <div class="trtc">
        <div class="z_box">
            <div class="l_box">
                <div class="con">
                    <button>{{ role ? "主播": "观众" }}</button>
                    <button @click="switchDevice">切换设备</button>
                    <button @click="toggleSwitch">前后置</button>
                    <button @click="logout">退出登录</button>
                    <button @click="startShare">开始分享</button>
                    <button @click="stopShare">结束分享</button>
                    <span>userId:{{userInfo.userId}} --- roomId:{{userInfo.roomId}}</span>
                </div>
                <div class="share" id="share">开始你的分享</div>
            </div> 
            <div class="r_box">
                <div class="top" id="local-stream"></div>
                <div class="btn-con">
                    <button @click="switchVideo">video</button>
                    <button @click="switchAudio">audio</button>
                    <button @click="addBackgroundAudio">音频</button>
                    <button @click="closeAudio">closeAudio</button>
                    <button @click="startAudio">startAudio</button>
                    <button @click="downLink">下麦</button>
                    <!-- <audio :src="musicSrc" controls>
                    您的浏览器不支持 audio 标签。
                    </audio> -->
                </div>
                <div class="bottom">
                    <p class="title">用户列表</p>
                    <div class="scroll" style="display:flex">
                        <div class="left" style="width:40%;border-right:1px solid">
                            <div style="border-bottom:1px solid;padding:4px 0;font-size:14px;color:red;font-weight:bold">观众 {{ userArr.length }}</div>
                            <div v-for="item in userArr" :key="item" style="display:flex;justify-content:center;padding:4px 0">
                                <div>
                                    <span>{{item.userId}}</span>
                                    <button style="font-size: 12px; margin-left: 24px" v-if="isShowBtn" @click="startLink(item)">开始连麦</button>
                                </div>
                                
                            </div>
                        </div>
                        <div class="right" style="width:60%">
                            <div style="border-bottom:1px solid;padding:4px 0;font-size:14px;color:red;font-weight:bold">上麦主播 {{memberArr.length}}</div>
                            <div v-for="item in memberArr" :key="item.getId()" class="mem" style="display: flex; width: 100%;border-right: 1px solid rgba(0,0,0,.3);font-size:12px;display:flex;justify-content: space-around;cursor:pointer">
                                <div class="">{{item.getUserId()}}</div>
                                <div @click="closeRemoteStream(item)">关闭远端视频</div>
                                <div @click="openRemoteStream(item)">开启远端视频</div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="remoteVideo" id="remoteVideoBox"></div>
        <div class="tip" style="width: 200px;padding:10px;border:1px solid;position:absolute;left:50%;top:50%;background:pink;border-radius:6px" v-if="isReceiveToPublish">
            <div>{{currentMessage.from}}邀请你上麦</div>
            <div style="margin-top:10px">
                <button @click="agreeToPublish" style="margin-right:10px;padding:4px;">同意</button>
                <button @click="disagreeToPublish" style="padding:4px;">拒绝</button>
            </div>
        </div>
    </div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
import AudioMixerPlugin from 'trtc-audio-mixer';

import { genTestUserSig } from "../../public/debug/GenerateTestUserSig";
import TIM from "tim-js-sdk"

// import { type } from 'os';

import musicSrc from '../assets/media/celebrity.mp3'

import RTCBeautyPlugin from 'rtc-beauty-plugin'


export default {
    data(){
        return {
            userInfo: {},
            memberArr: [],
            userArr: [],
            client: null,
            localStream: null,

            shareClient: null,

            isMuteVideo: true,
            isMuteAudio: true,

            musicSrc: musicSrc,
            audioSourceA: '',
            cameraArr: [],
            index: 0,
            isMobilefront: true,
            role: '',


            // im相关
            tim: null,
            currentMessage: {
                from: '默认'
            },
            isReceiveToPublish: false,

            rtcBeautyPlugin: ''
            

        }
    },
    computed: {
        isShowBtn() {
            return this.role == "anchor"
        }
    },
    methods:{ 
        closeRemoteStream(remoteStream) {
            console.error('jj')
            remoteStream.muteVideo()
        },
        openRemoteStream(remoteStream) {
            remoteStream.unmuteVideo()
        },
        async toggleSwitch(){
            if (this.isMobilefront) {
                await this.localStream.switchDevice('video','environment')
                alert('back')
                this.isMobilefront = false
            } else {
                // await this.localStream.switchDevice('video','user')          
                this.client.unpublish(this.localStream)
                this.localStream.stop()
                this.localStream.close()  
                this.localStream = null
                var localStream = TRTC.createStream({ userId: '123', audio: true, video: true });
                this.localStream = localStream

                await localStream.initialize()
                console.log('success to initailize')

                await client.publish(localStream)
                console.log('success to publixh')

                localStream.play('local-stream');

                alert('front')
                this.isMobilefront = true
            }
        },
        async resume1(){
            this.localStream.resume().then(res =>{
                alert('success to resume')
            })

            var isIDevice = (/iphone|ipad|Android/gi).test(navigator.appVersion)
            alert(navigator.appVersion,'-----')
            alert(isIDevice)
            // if (isIDevice){
                this.client.unpublish(this.localStream)
                this.localStream.stop()
                this.localStream.close()
                
                this.localStream = null
                const localStream = TRTC.createStream({ userId: '123', audio: true, video: true });
                this.localStream = localStream
                await this.localStream.initialize()
                await this.client.publish(this.localStream)
                this.localStream.play("local-stream")
                alert('重新推流')       
            // }
        },
        switchDevice(){
            this.index = this.index + 1
            if (this.index < this.cameraArr.length){
                
                this.localStream.switchDevice('video',this.cameraArr[this.index].deviceId).then(res =>{
                    console.log('success to switch')
                })
            } 
            if (this.index == this.cameraArr.length) {
                this.localStream.switchDevice('video',this.cameraArr[0].deviceId).then(res =>{
                    console.log('success to switch')
                })
                this.index = 0
            }
        },
        closeAudio() {
            this.audioSourceA.stop()
            console.log(this.audioSourceA)
        },
        startAudio() {
            this.audioSourceA.play()
        },
        addBackgroundAudio() {
            let audioSourceA = AudioMixerPlugin.createAudioSource({ 
                url: this.musicSrc,
                loop: true,
                volume: 0.6 
            });
            // let audioSourceB = AudioMixerPlugin.createAudioSource({ url: 'https://audioSourceB.mp3' });

            // 1. 获取麦克风轨道
            let originAudioTrack = this.localStream.getAudioTrack();

            // 2. 将麦克风轨道 与 audioSourceA audioSourceB 进行混合
            const mixedAudioTrack = AudioMixerPlugin.mix({ 
                targetTrack: originAudioTrack, 
                sourceList: [ audioSourceA ] 
            });

            // 3. 替换 localStream 的音频轨道
            this.localStream.replaceTrack(mixedAudioTrack);

            // 4. 调用 play 方法播放，这时通话双方都能听到背景音乐
            audioSourceA.play();
            // audioSourceB.play();

            this.audioSourceA = audioSourceA
        },
        switchAudio() {
            console.log(this.localStream,'')
            if (this.isMuteAudio) {
                this.localStream.muteAudio()
                alert('close the audio')
                this.isMuteAudio = !this.isMuteAudio
            } else {
                alert('open the audio')
                this.localStream.unmuteAudio()
                this.isMuteAudio = !this.isMuteAudio
            }
            
        },
        switchVideo() {
            // const videoTrack = this.localStream.getVideoTrack();
            if (this.isMuteVideo) {
                this.localStream.muteVideo()
                // this.localStream.close()
                
                // this.localStream.removeTrack(videoTrack).then(res => {

                // })
                this.isMuteVideo = !this.isMuteVideo
            } else {
                // this.localStream.addTrack(videoTrack).then(res => {

                // })
                this.localStream.unmuteVideo()
                this.isMuteVideo = !this.isMuteVideo
            }
        },
        startShare() {
            console.log('jjj')
            // 使用一个独立的用户 ID 进行推送屏幕分享
            const shareId = 'share-userId';
            const shareClient = TRTC.createClient({ 
                mode: 'rtc', 
                sdkAppId: genTestUserSig(shareId).sdkAppID,
                // userId: this.userInfo.userId, 
                userId: shareId,
                userSig: genTestUserSig(shareId).userSig,
                // useStringRoomId: true
            });
            console.log(shareClient,'line in 55')
            this.shareClient = shareClient

            // // 指明该 shareClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
            // shareClient.setDefaultMuteRemoteStreams(true);
            shareClient.join({ roomId: Number(this.userInfo.roomId) }).then(() => {
                console.log('shareClient join success');
                // 创建屏幕分享流
                const s_localStream = TRTC.createStream({ audio: false, screen: true });

                // this.s_localStream = s_localStream

                s_localStream.on('screen-sharing-stopped', event => {
                    console.log('screen sharing was stopped');
                    this.stopShare()
                });

                s_localStream.initialize().then(() => {
                    // screencast stream init success
                    shareClient.publish(s_localStream).then(() => {
                        console.log('screen casting');
                    });
                    s_localStream.play('share',{objectFit: 'contain'})
                });
                this.s_localStream = s_localStream
            });
        },
        stopShare(){
            this.shareClient.unpublish(this.s_localStream)
            // const videoTrack = this.s_localStream.getVideoTrack()
            // this.s_localStream.removeTrack(videoTrack).then(res =>{
            //     videoTrack.stop()
            // })
            this.shareClient.leave()
            // this.s_localStream.stop()
            this.s_localStream.close()
            this.s_localStream = null
            
        },
        async logout(){
            this.client.unpublish(this.localStream)
            console.error(this.localStream)
            await this.client.leave()

            this.rtcBeautyPlugin.destroy(); //销毁插件
            console.log('success to leave')
            const videoTrack = this.localStream.getVideoTrack();
            if (videoTrack) {
                this.localStream.removeTrack(videoTrack).then(() => {
                    // 关闭视频通话成功，停止videoTrack并释放摄像头资源
                    videoTrack.stop();
                });
            }
            
            // const s_videoTrack = this.s_localStream.getVideoTrack();
            // if (s_videoTrack) {
            //     this.s_localStream.removeTrack(s_videoTrack).then(() => {
            //         // 关闭视频通话成功，停止videoTrack并释放摄像头资源
            //         s_videoTrack.stop();
            //     });
            // }
            this.localStream.stop()
            this.localStream.close()
            
            this.localStream = null
            this.client = null

            // this.stopShare()
            this.$router.push('/login')
        },
        init(){
            const client = TRTC.createClient({
                mode: 'rtc',
                sdkAppId: this.userInfo.sdkAppID,
                userId: this.userInfo.userId,
                userSig: this.userInfo.userSig,
                // useStringRoomId: true
            });
            this.client = client
            this.join(this.client)
            TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);
            TRTC.Logger.enableUploadLog();

            this.bindHandle(client)
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
                console.error('client has been banned for ' + err);
                if (!isHidden()) {
                    alert('您已被踢出房间');
                    location.reload();
                } else {
                    //浏览器标签页被隐藏或显示的时候会触发visibilitychange事件
                    document.addEventListener('visibilitychange',() => {
                        if (!isHidden()) {
                            alert('您已被踢出房间');
                            location.reload();
                        }
                    },false); 
                }
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
                console.error(this.userInfo.role,'kkk')
                // if (this.userInfo.role == "false") {
                    this.userArr.push({
                        userId,
                        role: this.userInfo.role
                    })
                // }
                
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

                // 保存远端用户 
                this.memberArr.push(remoteStream)

                const uid = remoteStream.getUserId();
                const streamId = remoteStream.getId()
                const uidStreamId = uid + '-' + streamId

                client_.subscribe(remoteStream, { audio: true, video: true }).catch(e => {
                    console.error('failed to subscribe remoteStream');
                });
                console.error(uid,streamId)

                console.error('-------------------------------')

                const newDiv = document.createElement('div')
                const remoteVideoBox = document.getElementById('remoteVideoBox')
                // console.error(remoteVideoBox)
                newDiv.setAttribute('id',uidStreamId)  
                newDiv.setAttribute('style',"width: 100px; height: 100px")
                remoteVideoBox.appendChild(newDiv)

                remoteStream.play(uidStreamId).then(res =>{
                    var newDom = document.getElementById(`video_${remoteStream.getId()}`)
                    var newDom2 = document.getElementById(`audio_${remoteStream.getId()}`)
                    var newDom3 = document.getElementById(`player_${remoteStream.getId()}`)
                    console.error(newDom,newDom2,newDom3)
                    console.error(newDom3.childNodes.length)
                    console.error(newDom.childNodes.length,'newDom.childNodes.length')
                })

                remoteStream.stop()

                remoteStream.play(uidStreamId).then(res =>{
                    console.error('second time to play remoteStrea')
                })
            });

            // fired when a remote stream has been subscribed
            client_.on('stream-subscribed', evt => {   
            });

            //远端用户取消发布流后通知
            client_.on('stream-removed', evt => {
                const remoteStream = evt.stream;
                console.error(remoteStream)

                //将移除的远端流的节点关闭
                remoteStream.close()
                remoteStream.stop()

                const uid = remoteStream.getUserId();
                const streamId = remoteStream.getId()
                const uidStreamId = uid + '-' + streamId
                const remoteVideoBox = document.getElementById('remoteVideoBox')
                const removeDom = document.getElementById(uidStreamId)
                remoteVideoBox.removeChild(removeDom)

                // 过滤掉返回false的
                this.memberArr = this.memberArr.filter(item => item.getId() !=  remoteStream.getId())           
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

            client_.on('screen-sharing-stopped',() => {
                console.log('screen-sharing-stopped')
                this.stopShare()
            })
        },
        async join(client){

            await client.join({
                roomId: Number(this.userInfo.roomId)
            })
            console.log('success to join')
            // 普通进房创建本地流
            // const localStream = TRTC.createStream({ 
            //     userId: this.userInfo.userId,
            //     audio: true, video: true 
            // });
            console.error(this.userInfo.cameraId,'cameraId')
            console.error(this.userInfo.microphoneId,'microphoneId')

            // 根据设备ID来创建本地流
            const localStream = TRTC.createStream({ 
                userId: this.userInfo.userId,
                audio: true, 
                video: true,
                cameraId: this.userInfo.cameraId,
                microphoneId: this.userInfo.microphoneId 
            });
            // 保存本地流
            this.localStream = localStream

            await localStream.initialize()
            console.log('success to initailize')

            // 初始化美颜插件
            const rtcBeautyPlugin = new RTCBeautyPlugin();
            // 生成美颜处理后的流
            const beautyStream = rtcBeautyPlugin.generateBeautyStream(localStream);
            rtcBeautyPlugin.setBeautyParam({ beauty: 0.5, brightness: 0.5, ruddy: 0.5 });
            this.rtcBeautyPlugin = rtcBeautyPlugin

            this.localStream = beautyStream
            console.error(this.rtcBeautyPlugin)

            // $$
            console.error(this.userInfo.role,this.role)
            if (this.role == "anchor") {
                client.publish(beautyStream).then(res => {
                    // 推流后切换设备
                    // this.switchDevice()
                })
            } else {
                alert('我是观众')
            }

            console.log('success to publixh')

            localStream.play('local-stream');
        },
        /**
         * tim相关
         */
        timInit() {
            let tim = TIM.create({ SDKAppID: genTestUserSig('').sdkAppID})
            this.tim = tim

            tim.setLogLevel(0); 
            // 监听事件，例如：
            tim.on(TIM.EVENT.SDK_READY, this.onSdkReady)
            tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived)

            // 开始登录 
            tim.login({userID: this.userInfo.userId, userSig: genTestUserSig(this.userInfo.userId).userSig}); 
        },
        async startLink(user) {
            let message = this.tim.createCustomMessage({
                to: user,
                conversationType: TIM.TYPES.CONV_C2C,
                payload: {
                    data: '上麦', 
                    description: 'String(random(1,6))', // 获取骰子点数
                    extension: ''
                }
            });
            const res = await this.tim.sendMessage(message)
            
        },
        onSdkReady(e) {
            console.error(e,'sdk ready')
        },
        onMessageReceived({ data: messageList }) {
            console.error(messageList,'message received')
            const payload = messageList[0].payload
            if (payload.data == "上麦" && messageList[0].to == this.userInfo.userId) {
                // 保存当前消息
                this.currentMessage = messageList[0]
                this.isReceiveToPublish = true
            }
        },
        agreeToPublish() {
            this.client.publish(this.localStream)
            this.isReceiveToPublish = false
            this.role = true
            alert('化身主播')
        },
        disagreeToPublish() {
            this.client.unpublish(this.localStream)
            this.role = false
            alert("滚回观众")
            this.isReceiveToPublish = false
        },
        downLink() {
            this.client.unpublish(this.localStream)
            this.role = false
            alert("滚回观众")
        }
    },
    mounted(){
        //保存登录信息
        const data = this.$route.query
        console.error(data,'kk')
        this.userInfo = data
        console.error(typeof data.role)
        this.role = data.role == "true" ? "anchor" : "audience"
        TRTC.getMicrophones().then(mic =>{
            console.error(mic)
        })
        TRTC.getCameras().then(devices =>{
            this.cameraArr = devices
        })
        this.init()

        // IM初始化
        // this.timInit()
    },
    async beforeDestroy(){
        this.userInfo = {}
        // this.logout()

        // this.tim.off(TIM.EVENT.SDK_READY, this.onSdkReady)
        // this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived)
        // const res = await this.tim.logout()
        // console.error(res,'log out')
    }
}
</script>

<style>
    @import '../assets/css/trtc.css';
    * {
        padding: 0;
        margin: 0;
    }
    .trtc {
        width: 100%;
        height: 100%;
    }
</style>