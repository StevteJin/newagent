import axios from 'axios'
import { ORIGIN } from '../constants/index'
import React from 'react';
import { Table, Pagination, Modal, Input, Button, DatePicker, Select, Tooltip, Popover } from 'antd';
// 添加一个请求拦截器
axios.interceptors.request.use(config => {
  //如果存在token,请求头里面设置
  var token = localStorage.getItem("token") || '';
  console.log('我是token', token)
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
})

// 添加一个响应拦截器
axios.interceptors.response.use(response => {
  return response.data     // 其他的不要了，只拿data就好
}, error => {
  console.log(error.response)
  if (error.response.status === 400) {
    let data = JSON.stringify(error.response.data.resultInfo);
  }
  // ......在做别的统一处理
  return Promise.reject(error);
});

export default function request(url, method, withCredentials, options) {
  return axios({
    url: `${ORIGIN}` + url,
    method: method,
    // 携带cookie信息
    withCredentials: withCredentials,
    data: options
  })
}
