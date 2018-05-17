;(function () {
    /**
     * 配置项，对象中option为可配置项，其余各项为系统自动配置项
     */
    Audio.prototype.option = {
        id: 0,
        option: {
            name: '',
            loader: {
                model: 'Ajax',
                load: true,
                decode: true
            },
            sprite: false,
            source: {
                url: '',
                data: {},
                header: {}
            },
            control: {
                volume: 1,
                autoPlay: false,
                delay: 0,
                start: 0,
                end: 0,
                loop: false,
                loopStart: 0,
                loopEnd: 0
            }
        },
        temp: {
            stop: true,
            pause: false
        },
        resource: {
            sourceData: null,
            buffer: null,
            sourceAudio: null,
            gainNode: null
        }
    }
})();