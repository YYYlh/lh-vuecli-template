import { Loading } from 'element-ui'
// 加载中
let loadingInstance = null
let needLoadingRequestCount = 0 // 需要加载的请求数量
let target = null
// 开始加载
function startLoading() {
    if (!target) {
        target = document.querySelector('html')
    }
    loadingInstance = Loading.service({
        text: '请稍等',
        target,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
export function showLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
// 结束加载
function endLoading() {
    loadingInstance.close()
}
export function hideLoading() {
    if (needLoadingRequestCount <= 0) {
        return false
    }
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) { // 所有请求结束后关闭loading
        endLoading()
    }
}
