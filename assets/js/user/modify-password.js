$(function() {
    const { form, layer } = layui;
    // 1.校验表单
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6-12位，且不能出现空格'
        ],
        confirmPass: function(val) {
            if (val != $('#newPwd').val()) {
                return '两次密码输入不一致'
            }
        }
    });
    // 2.提交表单
    $('.layui-form').submit(function(e) {
        // 阻止默认跳转行为
        e.preventDefault();
        // 发送ajax请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg('密码修改失败')
                };
                layer.msg('密码修改成功');
                // 退出到登录页
                window.parent.location.href = '../home/login.html';
                // 清除token令牌
                localStorage.removeItem('token')
            })
    })































})