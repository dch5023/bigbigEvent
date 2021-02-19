$(function() {
    const { layer, form } = layui;



    // 1.获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo')
            .then(res => {
                // 判断
                if (res.status != 0) {
                    return layer.msg('用户信息获取失败！')
                };
                const { data } = res;
                // 给表单赋值
                form.val('edit-userinfo', data)

            })
    };
    initUserInfo();
    // 2.表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须在 1 ~ 6 个字符之间！'
        ]
    });
    // 3.提交修改
    $('.base-info-form').submit(function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 发送ajax请求
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg('修改用户信息失败')
                };
                layer.msg('修改用户信息成功')
                    // 更新页面上的用户信息
                window.parent.getUserInfo()
            })
    });
    // 4.重置按钮
    $('#reset-btn').click(function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 重新渲染
        initUserInfo();
    })






























})