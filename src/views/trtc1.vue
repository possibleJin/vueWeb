<template>
    <div class="trtc">
        <div class="z_box">
            <div class="l_box">
                <div class="con"></div>
                <div class="share" id="share"></div>
            </div>
            <div class="r_box">
                <div class="top"></div>
                <div class="bottom"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            userInfo: {}
        }
    },
    methods:{

    },
    mounted(){
        const data = this.$route.query
        this.userInfo = data
    },
    beforeDestroy(){
        this.userInfo = {}
    }
}
</script>

<style>
    @import '../assets/css/trtc.css';
    .trtc {
        width: 100%;
        height: 100%;
    }
</style>