$(function() {
    // 定义一个获取提交还是存为草稿的状态变量
    let state = '';
    const { form } = layui;
    // 1.从服务器获取文章分类列表数据
    function geiCatelist() {
        // 发送请求
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                // 判断是否失败
                if (res.status != 0) {
                    return layer.msg('分类列表获取失败')
                };
                // 渲染下拉组件的选项
                res.data.forEach(item => {
                    $('#cate-sl').append(`<option value="${item.Id}">${item.name}</option>`)
                });
                // ★★动态创建表单元素需要调用插件提供的form.render()方法 手动更新表单 
                // 内置模块 --->表单 --->更新渲染
                form.render()
            })
    };
    geiCatelist();
    //2. 初始化富文本编辑区 调用tinymce_setup里面预先封装好的方法
    initEditor();
    // 3.获取要裁剪的图片
    const $image = $('#image');
    // 4.初始化裁剪区
    $image.cropper({
        // 指定宽高比
        aspectRatio: 400 / 280,
        // 指定预览区
        preview: '.img-preview'
    });
    // 5.给选择封面按钮绑定点击事件
    $('#choose-btn').click(function() {
        // 自动触发file选择框的点击事件
        $('#file').click()
    });
    // 6.给文件选择框绑定change事件
    $('#file').change(function() {
        //6.1 获取文件列表  .files 返回的是伪数组
        // console.log($(this.files));
        //6.2 转成url地址的形式
        const imgUrl = URL.createObjectURL(this.files[0])
            // 6.3 替换裁剪区的图片
        $('#image').cropper('replace', imgUrl)
    });
    // 7. 监听表单提交（ 点击发布或者存为草稿）
    $('.publish-form').submit(function(e) {
        // 禁用默认行为
        e.preventDefault();
        // 7.1获取表单内的所有内容
        // 这里接口传的数据 要求是formdata 格式的 所以用formdata来获取
        // formdata:原生的 相关方法有：append() set() get() forEach()
        const fd = new FormData(this);
        // fd.forEach(item => {
        //     console.log(item);
        // });
        // 7.2 向fd中新增state属性 属性值state为全局变量并且由下面的8点击事件更改的
        fd.append('state', state);
        // 7.3获取裁剪封面的二进制属性 cropper文档中的方法
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 200
        }).toBlob(blob => {
            // console.log(blob);
            //7.4 添加到fd中
            fd.append('cover_img', blob);
            //    7.5调用发布文章请求的函数，传的参数就是组装好的fd数据
            publishArticle(fd);
        });


    });

    // 8.点击发布和草稿按钮，改变status的值
    $('.last-row button').click(function() {
        // console.log($(this).data('state'));
        state = $(this).data('state')
    });
    // 9.为了美观 这里在外面封装一个发布文章到服务器的的函数。
    function publishArticle(fd) {
        // 发送请求
        axios.post('/my/article/add', fd)
            .then(res => {
                // console.log(res);
                // 判断是否成功
                if (res.status != 0) {
                    return layer.msg('发布文章失败')
                };
                layer.msg(state == '草稿' ? '保存草稿成功' : '发布文章成功');
                //跳转到文章列表页面
                location.href = './list.html';
                //自动触发a链接的点击事件 
                window.parent.$('.jump-list').click()
            })
    }
})