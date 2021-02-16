// 为全局的axios请求设置根路径
// axios.defaults.baseURL = 'http://ajax.frontend.itheima.net';
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 添加全局的请求拦截器
axios.interceptors.request.use(function(config) {
    // console.log('-------发送ajax请求前');
    // 在发送请求之前判断是否有/my开头的请求路径
    // 如果有，手动添加headers请求头
    /*
    (1)startsWith() 以什么开头
    (2)正则表达式 /^/my/
    (3)indexof('/my') ==0
    */

    // 获取本地存储的token
    var token = localStorage.getItem('token') || '';
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加全局的响应拦截器  
axios.interceptors.response.use(function(response) {
    // console.log('-------接收ajax响应前');
    // 先判断身份验证是否成功
    // const { message, status } = response.data
    // if (message == '身份认证失败！' && status == 1) {
    //     // 清除本地存储的token
    //     localStorage.removeItem('token')
    //         // 跳转到登录页
    //     location.href = '../../login.html'
    // }



    // 对响应数据做点什么    直接设置好响应.data  就不用每次都写res.datal了
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});