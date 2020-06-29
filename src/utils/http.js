import axios from "axios";
import QS from "qs";
import { showLoading, hideLoading } from "./loading.js";

const http = axios.create({
  withCredentials: true,
  timeout: 60000,
});
// post请求头
http.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8;";

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    showLoading();
    return config;
  },
  (error) => {
    hideLoading();
    // console.log(error) // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  async (response) => {
    hideLoading();
    // 对响应数据做点什么
    if (response.status === 200) {
      // console.log('拦截响应数据')
      // console.log(response)
      hideLoading();
      return Promise.resolve(response);
    } else {
      hideLoading();
      return Promise.reject(response);
    }
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

/**
 * get方法，对应get请求和delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function getOrDelete(url, params, method = "get") {
  return new Promise((resolve, reject) => {
    http[method](url, {
      params: params,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * postOrPut方法，对应post或put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postOrPut(url, params, method = "post") {
  return new Promise((resolve, reject) => {
    http[method](url, QS.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * postJson方法， 上传json文件
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {String} Content-Type: application/json
 */
export function postJson(url, params, responseType = "") {
  return new Promise((resolve, reject) => {
    http
      .post(url, params, {
        responseType,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

// 上传文件方法
export function uploadRequest(strUrl, formData) {
  if (formData == null) {
    return;
  }
  return http({
    method: "post",
    url: strUrl,
    cache: false,
    data: formData,
    processData: false,
    contentType: false,
  })
    .then((response) => {
      if (response.success === false) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    })
    .catch((res) => {
      return Promise.reject(res);
    });
}
// 处理文件流下载
export function downloadBlobFile(url, param, fileName) {
  postJson(url, param, "blob").then((res) => {
    const blob = new Blob([res], {
      type: "application/vnd.ms-excel",
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      link.href = decodeURI(window.URL.createObjectURL(blob));
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
      link.remove();
    }
  });
}
