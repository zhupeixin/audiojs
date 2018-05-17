// window.test = new Audio([{
//     source: {
//         url: 'https://www.zhupeixin.com/audio/audiotest1.mp3',
//     },
//     control: {
//         autoPlay: true,
//         loop: true,
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/audiotest.mp3',
//     },
//     control: {
//         autoPlay: true,
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/1374.mp3',
//         loop: true
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/1792.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/3123.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/4579.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/7105.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/8796.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/8902.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/9577.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }, {
//     source: {
//         url: 'https://www.zhupeixin.com/audio/src/9728.mp3',
//     },
//     control: {
//         autoPlay: true
//     }
// }])

window.test2 = new Audio();
test2.add([{
    // sprite:true,
    source: {
        url: 'https://www.zhupeixin.com/audio/audiotest.mp3',
    },
    control: {
        autoPlay: false,
        loop: true,
    }
}])
test2.add([{
    // sprite:true,
    source: {
        url: 'https://www.zhupeixin.com/audio/audiotest1.mp3',
    },
    control: {
        autoPlay: false,
        loop: true,
    }
}])
test2.add([{
    // sprite:true,
    source: {
        url: 'https://www.zhupeixin.com/audio/audiotest.mp3',
    },
    control: {
        autoPlay: false,
        loop: true,
    }
},{
    // sprite:true,
    source: {
        url: 'https://www.zhupeixin.com/audio/audiotest1.mp3',
    },
    control: {
        autoPlay: false,
        loop: true,
    }
}])
// test2.sprite(1,[{
//     control: {
//         autoPlay: true,
//         loop: true,
//         start:20,
//         end:30
//     }
// },{
//     control: {
//         autoPlay: true,
//         loop: false,
//         start:0,
//         end:20
//     }
// }])
test2.onLoad(function () {
    console.log('加载完成');
})

    .onReady(function () {
        console.log('解码完成，可以正常播放');
        test2.start();
    })


    .onLoad(function () {
        console.log([1,3]);
    },[1,3])

    .onLoad(function () {
        console.log([3,2]);
    },[3,2])

    .onLoad(function () {
        console.log([4,2]);
    },[4,2])


    .onStart(function () {
        console.log('开始播放');
    })

    .onStop(function () {
        console.log('停止播放');
    })
    .onPlay(function () {
        console.log('暂停->开始播放');
    })
    .onPause(function () {
        console.log('开始->暂停播放');
    })
    .onMute(function () {
        console.log('静音');
    })
    .onvocal(function () {
        console.log('恢复静音');
    })

    .onerror(function (msg) {
        console.error(msg)
    })

