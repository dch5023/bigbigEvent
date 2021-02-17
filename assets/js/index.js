 const { layer } = layui;

 function getUserInfo() {
     axios.get('/my/userinfo')
         .then(res => {
             // console.log(res);
             // 判断是否失败
             if (res.status != 0) {
                 return layer.msg('获取用户信息失败！')
             }
             // 渲染用户信息
             // 1.先获取data
             const { data } = res;
             //2.获取用户名  如果没有昵称nickname 就取用户名username
             const name = data.nickname || data.username;
             // 渲染昵称
             $('.nickname').text(`欢迎 ${name}`).show();
             // 渲染头像
             // 先判断是否上传了头像
             if (data.user_pic) {
                 // 是的话渲染图片头像
                 $('.avater').prop('src', data.user_pic).show();
                 $('.text-avater').hide()
             } else {
                 // 否的话 渲染文字头像
                 $('.text-avater').text(name[0].toUpperCase()).show();
                 $('.avater').hide()
             }
         })
 };

 $(function() {
     // 1.获取用户信息
     getUserInfo();
     // 点击退出
     $('#logout').click(function() {
         // 弹出询问框
         layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
             //  // 首先清除本地token
             localStorage.removeItem('token');
             //  // 再跳转到登录页
             location.href = './login.html';
             layer.close(index);
         });
     })









 })