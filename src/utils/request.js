import axios from 'axios';
import errorCode from '@/utils/errCode';
import { Message } from 'element-ui';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL + '/api' : '/api',
    timeout: 5000
});

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // console.log('res: ', res);
        // 未设置状态码则默认成功状态
        const code = res.data.status || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default'];
        if (code === 401) {
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
        } else if (code === 500) {
            Message({
                message: msg,
                type: 'error'
            });
            return Promise.reject(msg);
        } else if (errorCode[code]) {
            Message({
                message: msg,
                type: 'error'
            });
            return Promise.reject(msg);
        } else {
            return Promise.resolve(res.data);
        }
    },
    (error) => {
        // console.log('err' + error)
        let { message } = error;
        if (message == 'Network Error') {
            message = '后端接口连接异常';
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时';
        } else if (message.includes('Request failed with status code')) {
            message = '系统接口' + message.substr(message.length - 3) + '异常';
        }
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default instance;
