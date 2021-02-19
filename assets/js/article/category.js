$(function() {
    // 提取模块
    const { form } = layui;
    // 定义弹出层的索引编号
    let index;
    let indexEdit;
    // 1.从服务器获取文章类别列表的数据,并渲染到页面
    function geiCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg('获取类别列表失败！')
                };
                // 使用模板引擎渲染页面 1.引用插件2.准备模板3.调用函数template(模板id,数据对象)
                const htmlStr = template('tpl', res);
                // console.log(htmlStr);
                // 渲染到页面上
                $('tbody').html(htmlStr)
            })
    };
    geiCateList();
    // 2.点击添加按钮  弹出添加表单
    $('.add-btn').click(function() {
        // 2.1显示弹出层
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('.add-form-container').html()
        });
    });
    // 3.添加表单的提交事件
    // 注意：这个表单是点击之后添加的，是后添加的 所以要用事件委托
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault();
        // 发送请求 把表单里的数据提交到服务器
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                // console.log(res);
                // 判断是否成功
                if (res.status != 0) {
                    return layer.msg('添加失败')
                };
                // 成功后 关闭弹出层 重新渲染
                layer.close(index);
                layer.msg('添加成功')
                geiCateList()
            })
    });
    // 4.点击编辑按钮 弹出编辑表单 编辑表单里默认显示的名称和别名与服务器内相同id的数据一一对应
    $(document).on('click', '.edit-btn', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('.edit-form-container').html()
        });
        // 获取自定义属性
        // console.log($(this).data('id'));
        const id = $(this).data('id');
        // 发送请求 获取当前id的数据 这里用反引号的模板字符串 里面的变量用${}包起来
        axios.get(`/my/article/cates/${id}`)
            .then(res => {
                // console.log(res);
                // 判断是否失败
                if (res.status != 0) {
                    return layer.msg('获取失败')
                };
                // 对表单进行赋值 layui的方法 form别忘了提取  
                form.val('edit-form', res.data)
            });


    });
    // 5. 编辑表单的提交事件
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault();
        // 发送请求
        axios.post('/my/article/updatecate', $(this).serialize())
            .then(res => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg('修改失败')
                };
                // 成功后 关闭弹出层 重新渲染
                layer.close(indexEdit);
                layer.msg('修改成功')
                geiCateList()
            })
    });


    // 6. 点击删除按钮 弹出询问框
    $(document).on('click', '.del-btn', function() {
        // 获取id
        const delId = $(this).data('id');
        // 6.1显示询问框
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            // 点击确定的话 发送请求
            axios.get(`/my/article/deletecate/${delId}`)
                .then(res => {
                    // console.log(res);
                    // 判断是否成功
                    if (res.status != 0) {
                        return layer.msg('删除失败')
                    };
                    layer.msg('删除成功')
                    geiCateList()
                });
            // 确定后关闭弹出层
            layer.close(index);
        });
    })






})