Audio.js 是对Web Audio API 的高度封装，暴露出音频操作相关接口，并提供一整套的事件监听机制，简化前端音频处理的繁杂逻辑。

对于safari浏览器不允许自动播放音频，我们会在您执行add方法后，自动将资源加载到资源库，这时您可以主动引导用户去执行一次屏幕触摸操作，从而正常播放音频，这在传统的Audio标签中是不能实现的。

Audio.js在您初始化它的时候会创建一个Web Audio AudioContext对象，虽然你可以多次初始化Audio.js，但这是不被推荐的，因为AudioContext对象在浏览器中只允许创建最多6个，因此你不应该去多次实例化这个对象，可以通过资源add方法来添加更多的音频，在硬件允许的条件下，通过add添加的音频资源理论上是没有限制的。

Audio.js 初始化之后将在内部维护一个资源仓库和一个事件处理队列。

资源仓库提供唯一的ID用来索引已经存储于仓库的资源，此ID不可重复，为系统自动分配，因此这个资源库对外是封闭的，虽然你可以通过实例化后的对象找到这个仓库，但是你不应该对这个仓库进行更改，更改后系统不能保证资源处理逻辑是正确的。

资源仓库对外暴露增删改查API，你可以通过这些API来操作这个资源仓库，而不会破坏这个仓库。

事件处理队列用来存储事件以及事件触发时的回调函数，以及一些回调函数的配置参数，这个队列同样也是不允许修改的，你可以通过它暴露出来的API来操作这个事件队列。

## 初始化 ##

```JavaScript
初始化Audio对象
var test = new Audio();

Audio对象在初始化时可以接受一个配置参数对象，
{
    // 仅在页面可见状态下播放声音，需要配置项 visibility 为 true，默认值为false
    visibility : Boolean
}
```

## 配置参数 ##
```JavaScript
即下文中提到的option
option: {
            name: '',                 这是一个可选参数，默认为空字符串，
            loader: {                 加载器配置
                model: 'Ajax',        加载器工作模式，默认为Ajax模式，支持File，Buffer模式
                load: true,           选择此模式是否需要下载资源
                decode: true          选择此模式是否需要解码资源
            },
            sprite: false,            是否需要雪碧音频（参考CSS雪碧图）,如果此项配置为true，那么control项的配置将会是无效的，你应该调用系统提供的sprite来分割音频。详见资源库处理相关API
            source: {                 资源配置
                url: '',              默认采用ajax加载，需要配置资源地址
                data: {},             请求资源时需要的参数
                header: {}            请求资源时的请求头配置
            },
            control: {                音频控制配置
                volume: 1,            音量默认值为1，代表无增益
                autoPlay: false,      是否在加载解码完成自动播放
                delay: 0,             延迟播放时间，单位为s
                start: 0,             开始播放时间，单位为s
                end: 0,               结束播放时间，单位为s
                loop: false,          是否循环播放
                loopStart: 0,         循环开始时间，这一项配置与start会覆盖
                loopEnd: 0            循环结束时间，这一项配置与end会覆盖
            }
        }

```


## 资源库处理相关API ##
```JavaScript
/**
* 向资源库添加资源，并在添加完成后，驱动该资源的下载，解析及资源创建操作
* @param {object} option - 必须 - 添加资源的配置项
* @param {function} cb - 可选 - 添加资源后的回调函数
* @returns {array} 添加的资源ID数组
*/
test.add([option1,option2,....])

/**
* 删除资源库中的资源，若资源正在播放则停止资源播放后删除资源
* @param {number} id - 必须 - 要删除的资源ID
*/
test.delete(1)

/**
* 更新资源库中指定ID的资源文件，此操作将会删除原资源，并在添加新资源完成后，驱动该资源的下载，解析及资源创建操作
* @param {number} id - 必须 - 要更新的资源ID
* @param {object} option - 必须 - 更新的资源配置参数
*/
test.update(1,option)

/**
* 查找资源库中指定ID资源，成功时返回对应资源，失败时返回资源库中的全部资源
* @param {number} id - 必须 - 要查询的资源ID
* @returns {object}
*/
test.find(1)

/**
* 查找资源库中指定ID资源，成功时返回对应ID，失败时返回 0
* @param id - 必须 - 要查询的资源ID
* @returns {number}
*/
test.has(1)

/**
* 查找名字所对应的资源ID
* @param {string} name - 必须 - 要查找的资源名字
* @returns {number}
*/
test.findId('audio1')

/**
* 返回当前资源库中的所有资源ID
* @returns {any[]}
*/
test.getAllId()

/**
* 雪碧音频，可以将加载好的音频分成多段进行播放，此操作要求数据源配置必须为 sprite: true, 之后调用 sprite 方法对音频进行切割，切割随不会破坏原始音频，但会在音频切割完成后，删除原始音频
* @param {number} id - 必须 - 资源库中唯一索引资源ID
* @param {object} option - 必须 - 资源配置项，此时，只需要配置前述option中的name（可选）control即可，其中 start end 应该为必备配置项
*/
test.sprite(id, option)

```

## 音频控制相关API ##
```JavaScript
/**
* 控制器 - 暂停的资源播放
* @param {number} id - 可选 - 资源库资源ID，ID为空则开始播放全部资源
* @returns {Audio}
*/
test.play(id)

/**
* 控制器 - 播放的资源暂停
* @param {number} id - 可选 - 资源库资源ID，ID为空则暂停播放全部资源
* @returns {Audio}
*/
test.pause(id)

/**
* 控制器 - 开始播放或停止播放的资源播放
* @param {number} id - 可选 - 资源库资源ID，ID为空则开始播放全部资源
* @returns {Audio}
*/
test.start(id)

/**
* 控制器 - 停止播放资源
* @param {number} id - 可选 - 资源库资源ID，ID为空则停止播放全部资源
* @returns {Audio}
*/
test.stop(id)

/**
* 控制器 - 增大资源的音量
* @param {number} step - 必须 - 增大音量的步长
* @param {number} id - 可选 - 资源库资源ID，ID为空增大全部资源音量
* @returns {Audio}
*/
test.ascVolume(step, id)

/**
* 控制器 - 减小资源的音量
* @param {number} step - 必须 - 减小音量的步长
* @param {number} id - 可选 - 资源库资源ID，ID为空减小全部资源音量
* @returns {Audio}
*/
test.decVolume(step, id)

/**
* 控制器 - 将资源设置的音量设置为指定数值
* @param {number} value - 必须 - 音量数值 0为静音 1为无增益
* @param {number} id - 可选 - 资源库资源ID，ID为空增大全部资源音量
* @returns {Audio}
*/
test.setVolume(value, id)

/**
* 控制器 - 将资源静音
* @param {number} id - 可选 - 资源库资源ID，ID为空静音全部资源音量
* @returns {Audio}
*/
test.mute(id)

/**
* 控制器 - 将静音资源恢复
* @param {number} id - 可选 - 资源库资源ID，ID为空将全部静音资源恢复
* @returns {Audio}
*/
test.vocal(id)

/**
* 控制器 - 控制音频的淡入和淡出
* @param {number} value - 必须 -音量的目标值
* @param {number} endTime - 必须 - 结束时间，代表从当前开始至结束的时间差
* @param {function} cb - 必须 - 淡入或淡出生效于哪个函数
* @param {number} id - 可选 - 资源库资源ID，ID为空则对所有资源生效
* @returns {Audio}
*/
test.fade(value, endTime, cb, id)

```



## 事件监听相关API ##
```JavaScript
/**
* 指定ID资源下载完成时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onLoad(cb,id,once)

/**
* 指定ID资源解码完成时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
test.onReady(cb, id, once)

/**
* 指定ID资源开始播放时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onStart(cb, id, once)

/**
* 指定ID资源停止播放时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onStop(cb, id, once)

/**
* 指定ID资源由暂停转为播放时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onPlay(cb, id, once)

/**
* 指定ID资源由播放转为暂停时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onPause(cb, id, once)

/**
* 指定ID资源静音时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onMute(cb, id, once)

/**
* 指定ID资源由静音恢复时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onvocal(cb, id, once)

/**
* 指定ID资源在出错时触发的事件
* @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
* @param {number | array} id - 必须 - 资源ID
* @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
*/
test.onerror(cb, id, once)

```