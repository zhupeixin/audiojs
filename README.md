Audio.js 是对Web Audio API 的高度封装，暴露出音频操作相关接口，并提供一整套的事件监听机制，简化前端音频处理的繁杂逻辑。

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
            name: '', 这是一个可选参数，默认为空字符串，
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
                volume: 1, 音量默认值为1，代表无增益
                autoPlay: false,
                delay: 0,
                start: 0,
                end: 0,
                loop: false,
                loopStart: 0,
                loopEnd: 0
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
```