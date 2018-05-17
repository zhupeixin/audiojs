/**
 * Audio对象
 * @param {object} option - 可选 - 全局配置
 * @returns {*}
 * @constructor
 */
function Audio(option) {
    var that = this;
    /**
     * 资源仓库，用于存储所有正在被程序运行的资源，
     * 只读，不可以直接操作，操作将会导致程序运行出错
     * @type {Array}
     * @private
     */
    that._store = [];

    /**
     * 事件队列，用于存储所有被监听的事件，
     * 只读，不可以直接操作，操作将会导致程序运行出错
     * @type {Array}
     * @private
     */

    that._eventQ = [];

    /**
     * 用于记录资源状态
     * @private
     */
    that._status = {
        load:[],
        ready:[],
        start:[],
        stop:[],
        play:[],
        pause:[],
        mute:[],
        vocal:[]
    };

    /**
     * 用于保存一个AudioContext实例
     * @type {null}
     * @private
     */
    that._ctx = null;
    /**
     * 创建AudioContext实例
     */
    return !!that._init(option || {}) && that;
}