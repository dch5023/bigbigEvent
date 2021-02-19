$(function() {
    //1 获取要裁剪的图片 文档上的写法
    const $image = $('#image');
    // 2.初始化裁剪区域  文档上的写法
    $image.cropper({
        // 长宽比
        aspectRatio: 1,
        // 裁剪事件
        crop: function(event) {
            // 裁剪区的坐标位置
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        // 指定预览区域
        preview: '.img-preview'
    });
    // 3.点击上传按钮上传图片
    $('#upload-btn').click(function() {
        // 3.1手动触发文件框的点击事件
        $('#file').click()
    });
    // 4.监听文件框的状态改变事件  change事件
    $('#file').change(function() {
        // 4.1获取用户上传的文件列表 原生对象.files
        // console.log(this.files); //返回的是伪数组

        // 判断用户是否上传(选了图片但是点了取消)
        if (this.files.length == 0) {
            return
        };
        // 新方法 把文件转成url地址的形式
        // console.log(URL.createObjectURL(this.files[0]));
        const imgUrl = URL.createObjectURL(this.files[0]);
        // 4.2替换裁剪区的图片 
        // $image.cropper('replace', imgUrl);
        // 或者使用下面的方法，先销毁再替换图片，最后重新初始化
        $image.cropper('destroy').prop('src', imgUrl).cropper({
            // 长宽比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        })
    });

    // 5. 点击确定， 上传图片到服务器
    $('#save-btn').click(function() {
        // 5.1 获取裁剪后图片的base64格式 插件上的方法
        const dataUrl = $image.cropper('getCroppedCanvas', {
            // 指定裁剪后的图片大小
            width: 100,
            height: 100
        }).toDataURL('image/png');
        console.log(dataUrl);
        //5.2 手动构建查询参数
        const search = new URLSearchParams();
        // 使用append()方法添加参数
        search.append('avatar', dataUrl)
            // 5.3 发送请求 提交到服务器
        axios.post('/my/update/avatar', search)
            .then(res => {
                // console.log(res);
                // 5.4判断
                if (res.status != 0) {
                    return layer.msg('上传失败！')
                };
                layer.msg('上传成功！');
                // 5.5更新首页导航的头像
                window.parent.getUserInfo()
            })
    })







})