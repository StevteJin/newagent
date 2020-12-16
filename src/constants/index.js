//接口配置文件
// export const ORIGIN = "http://47.102.151.13"
let url;
console.log('地址', window.location.host)
window.location.host != 'localhost:3005' ? url = "http://" + window.location.host : url = "http://47.102.151.13"
export const ORIGIN = url;
// export const ORIGIN = "http://106.14.255.220:8199"
//本地环境
// export const ORIGIN = "http://10.131.4.184:8199"
// export const ORIGIN = "http://47.102.84.50:8199"
// export const ORIGIN = "http://106.14.120.212:8199"     