const TRTC = require('trtc-js-sdk')

function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
        }
    }
    return flag;
}

function getBrowser() {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edge\/([\d.]+)/))
        ? (sys.edge = s[1])
        : (s = ua.match(/rv:([\d.]+)\) like gecko/))
        ? (sys.ie = s[1])
        : (s = ua.match(/msie ([\d.]+)/))
        ? (sys.ie = s[1])
        : (s = ua.match(/firefox\/([\d.]+)/))
        ? (sys.firefox = s[1])
        : (s = ua.match(/tbs\/([\d]+)/))
        ? (sys.tbs = s[1])
        : (s = ua.match(/xweb\/([\d]+)/))
        ? (sys.xweb = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
        ? (sys.chrome = s[1])
        : (s = ua.match(/opera.([\d.]+)/))
        ? (sys.opera = s[1])
        : (s = ua.match(/version\/([\d.]+).*safari/))
        ? (sys.safari = s[1])
        : 0;

    if (sys.xweb) return { browser: 'webView XWEB', version: '' };
    if (sys.tbs) return { browser: 'webView TBS', version: '' };
    if (sys.edge) return { browser: 'Edge', version: sys.edge };
    if (sys.ie) return { browser: 'IE', version: sys.ie };
    if (sys.firefox) return { browser: 'Firefox', version: sys.firefox };
    if (sys.chrome) return { browser: 'Chrome', version: sys.chrome };
    if (sys.opera) return { browser: 'Opera', version: sys.opera };
    if (sys.safari) return { browser: 'Safari', version: sys.safari };

    return { browser: '', version: '0' };
}

function getIPAddress() {
    return new Promise(resolve => {
        window.RTCPeerConnection =
        window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
        let pc = new RTCPeerConnection({ iceServers: [] });
        let noop = function() {};
        let IPAddress = '';
        let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
        pc.createDataChannel(''); //create a bogus data channel
        pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
        //listen for candidate events
        pc.onicecandidate = function(ice) {
        if (
            !ice ||
            !ice.candidate ||
            !ice.candidate.candidate ||
            !ipRegex.exec(ice.candidate.candidate)
        ) {
            return;
        }
        IPAddress = ipRegex.exec(ice.candidate.candidate)[1];
        pc.onicecandidate = noop;
        resolve(IPAddress);
        };
    });
}


let isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry|BB10/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
        );
    },
    getOsName: function() {
        var osName = 'Unknown OS';
        if (isMobile.Android()) {
            osName = 'Android';
        }
        if (isMobile.BlackBerry()) {
            osName = 'BlackBerry';
        }
        if (isMobile.iOS()) {
            osName = 'iOS';
        }
        if (isMobile.Opera()) {
            osName = 'Opera Mini';
        }
        if (isMobile.Windows()) {
            osName = 'Windows';
        }
        return {
            osName,
            type: 'mobile'
        };
    }
};

function detectDesktopOS() {
    var unknown = '-';
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var os = unknown;
    var clientStrings = [
        {
            s: 'Chrome OS',
            r: /CrOS/
        },
        {
            s: 'Windows 10',
            r: /(Windows 10.0|Windows NT 10.0)/
        },
        {
            s: 'Windows 8.1',
            r: /(Windows 8.1|Windows NT 6.3)/
        },
        {
            s: 'Windows 8',
            r: /(Windows 8|Windows NT 6.2)/
        },
        {
            s: 'Windows 7',
            r: /(Windows 7|Windows NT 6.1)/
        },
        {
            s: 'Windows Vista',
            r: /Windows NT 6.0/
        },
        {
            s: 'Windows Server 2003',
            r: /Windows NT 5.2/
        },
        {
            s: 'Windows XP',
            r: /(Windows NT 5.1|Windows XP)/
        },
        {
            s: 'Windows 2000',
            r: /(Windows NT 5.0|Windows 2000)/
        },
        {
            s: 'Windows ME',
            r: /(Win 9x 4.90|Windows ME)/
        },
        {
            s: 'Windows 98',
            r: /(Windows 98|Win98)/
        },
        {
            s: 'Windows 95',
            r: /(Windows 95|Win95|Windows_95)/
        },
        {
            s: 'Windows NT 4.0',
            r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
        },
        {
            s: 'Windows CE',
            r: /Windows CE/
        },
        {
            s: 'Windows 3.11',
            r: /Win16/
        },
        {
            s: 'Android',
            r: /Android/
        },
        {
            s: 'Open BSD',
            r: /OpenBSD/
        },
        {
            s: 'Sun OS',
            r: /SunOS/
        },
        {
            s: 'Linux',
            r: /(Linux|X11)/
        },
        {
            s: 'iOS',
            r: /(iPhone|iPad|iPod)/
        },
        {
            s: 'Mac OS X',
            r: /Mac OS X/
        },
        {
            s: 'Mac OS',
            r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
        },
        {
            s: 'QNX',
            r: /QNX/
        },
        {
            s: 'UNIX',
            r: /UNIX/
        },
        {
            s: 'BeOS',
            r: /BeOS/
        },
        {
            s: 'OS/2',
            r: /OS\/2/
        },
        {
            s: 'Search Bot',
            r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
        }
    ];
    for (var i = 0, cs; (cs = clientStrings[i]); i++) {
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }
    var osVersion = unknown;
    if (/Windows/.test(os)) {
        if (/Windows (.*)/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
        }
        os = 'Windows';
    }
    switch (os) {
        case 'Mac OS X':
            if (/Mac OS X (10[/._\d]+)/.test(nAgt)) {
                // eslint-disable-next-line no-useless-escape
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
            }
            break;
        case 'Android':
            // eslint-disable-next-line no-useless-escape
            if (/Android ([\.\_\d]+)/.test(nAgt)) {
                // eslint-disable-next-line no-useless-escape
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
            }
            break;
        case 'iOS':
            if (/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)) {
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            }
            break;
    }
    return {
        osName: os + osVersion,
        type: 'desktop'
    };
}

function throttle(func, delay) {
    var timer = null;
    var startTime = Date.now();
    return function() {
      var curTime = Date.now();
      var remaining = delay - (curTime - startTime);
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      if (remaining <= 0) {
        func.apply(context, args);
        startTime = Date.now();
      } else {
        timer = setTimeout(() => {
          console.log('duplicate click');
        }, remaining);
      }
    };
  }

function getOS() {
    if (isMobile.any()) {
        return isMobile.getOsName();
    } else {
        return detectDesktopOS();
    }
}

/* global $ TRTC getOS getBrowser */
const DEVICE_TYPE_ENUM = {
    DESKTOP_WIN: 'desktop_win',
    DESKTOP_MAC: 'desktop_mac',
    MOBILE_ANDROID: 'mobile_android',
    MOBILE_IOS: 'mobile_ios'
  };
  
  const deviceType = getDeviceType();
  
  /**
   * 获取当前设备类型
   */
  function getDeviceType() {
    let deviceType;
    const osType = getOS().type;
    const osName = getOS().osName;
    // alert(osType,'osType')
    // alert(osName,'osName')
    switch (osType) {
      case 'desktop':
        deviceType =
          osName.indexOf('Mac OS') > -1 ? DEVICE_TYPE_ENUM.DESKTOP_MAC : DEVICE_TYPE_ENUM.DESKTOP_WIN;
        break;
      case 'mobile':
        deviceType = osName === 'iOS' ? DEVICE_TYPE_ENUM.MOBILE_IOS : DEVICE_TYPE_ENUM.MOBILE_ANDROID;
        break;
      default:
        break;
    }
    return deviceType;
  }
  
  /**
   * 根据设备类型获取支持的浏览器列表
   */
  function getRecommendBrowserInfo() {
    let recommendBrowserInfo = '';
    switch (deviceType) {
      case DEVICE_TYPE_ENUM.DESKTOP_MAC:
        recommendBrowserInfo =
          ' Mac OS 设备请使用 Chrome，Safari，Firefox 56+ 或 Edge 80+ 浏览器打开链接';
        break;
      case DEVICE_TYPE_ENUM.DESKTOP_WIN:
        recommendBrowserInfo = ' Windows 设备请使用 Chrome, Firefox 56+ 或 Edge 80+ 浏览器打开链接';
        break;
      case DEVICE_TYPE_ENUM.MOBILE_ANDROID:
        recommendBrowserInfo = ' Android 设备请使用 Chrome 浏览器打开链接';
        break;
      case DEVICE_TYPE_ENUM.MOBILE_IOS:
        recommendBrowserInfo = ' iOS 设备请使用 Safari 浏览器打开链接';
        break;
      default:
        recommendBrowserInfo = '建议下载最新版Chrome浏览器（http://www.google.cn/chrome/）打开链接';
        break;
    }
    return recommendBrowserInfo;
  }
  
  /**
   * 是否是 桌面端 firefox 56+ 浏览器
   */
  function isFirefoxM56() {
    if (deviceType === DEVICE_TYPE_ENUM.DESKTOP_WIN || deviceType === DEVICE_TYPE_ENUM.DESKTOP_MAC) {
      let browserInfo = getBrowser();
      if (browserInfo.browser === 'Firefox' && browserInfo.version >= '56') {
        return true;
      }
    }
    return false;
  }
  
  /**
   * rtc支持度检测
   */
  async function rtcDetection() {
    //   alert('j')
    // 当前浏览器不支持webRtc
    let checkResult = await TRTC.checkSystemRequirements();
    console.error(checkResult,'checkResult')
    let deviceDetectionRemindInfo = '';
    let checkDetail = checkResult.detail;
    // console.log('checkResult', checkResult.result, 'checkDetail', checkDetail);
    if (!checkResult.result) {
      // 通过TRTC获取详细不支持的信息
        //   $('#remind-info-container').show();
  
      // 查看链接是否符合webRtc限制
      if (
        location.protocol !== 'https:' &&
        location.hostname !== 'localhost' &&
        location.origin !== 'file://'
      ) {
        deviceDetectionRemindInfo =
          '请检查链接, webRTC 支持以下三种环境:<br>' +
          '1) localhost 域<br>' +
          '2) 开启了 HTTPS 的域<br>' +
          '3) 使用 file:/// 协议打开的本地文件';
        // $('#browser-remind').show();
        // $('#remind-info').html(deviceDetectionRemindInfo);
        console.error(deviceDetectionRemindInfo,'deviceDetectionRemindInfo')
        return false;
      }
  
      // 获取当前设备推荐的浏览器信息
      deviceDetectionRemindInfo = getRecommendBrowserInfo();
  
      console.error('isFirefoxM56', isFirefoxM56());
      if (isFirefoxM56() && !checkDetail.isH264Supported) {
        deviceDetectionRemindInfo =
          'Firefox 尚未完成H264编码支持，请稍等重试或使用其他推荐浏览器打开链接<br>' +
          deviceDetectionRemindInfo;

          console.error('deviceDetectionRemindInfo',deviceDetectionRemindInfo)
      }
      

      return false;
    }
    deviceDetectionRemindInfo = getRecommendBrowserInfo();
    console.error('deviceDetectionRemindInfo',deviceDetectionRemindInfo)
    return true;
  }

  export default rtcDetection