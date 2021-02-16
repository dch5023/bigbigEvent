$(function() {
    // 提取模块
    const { form, layer } = layui;



    // 注册和登录表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    });
    // 表单验证
    form.verify({
        pass: [
            /^\w{6,12}$/, '密码必须6到12位'
        ],
        samePass: function(value) {
            if (value !== $('#pwd').val()) {
                return '两次密码输入不一致'
            }
        }
    });
    // 实现注册功能
    $('.reg-form').submit(function(e) {
        // 禁用默认提交行为
        e.preventDefault();
        // 发送ajax请求
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                // 判断是否成功
                if (res.status != 0) {
                    return layer.msg('注册失败')
                };
                layer.msg('注册成功', {
                    time: 1500
                }, function() {
                    $('.reg-form a').click()
                })
            })

    });
    //实现登录功能
    $('.login-form').submit(function(e) {
        // 禁用
        e.preventDefault();
        // 发送ajax请求 
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                } else {
                    localStorage.setItem('token', res.token);
                    layer.msg('登录成功', {
                        time: 1500
                    }, function() {
                        location.href = './index.html'
                    });

                }
            })
    })

















})