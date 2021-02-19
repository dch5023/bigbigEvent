$(function() {
    const { form, laypage } = layui;
    // 1.获取文章列表的分类数据 在publish里面做过了 直接拿过来用
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
    // 2.定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值
        pagesize: 2, //表示每页显示多少条
        cate_id: '', //表示文章的分类id
        state: '' //表示文章的状态
    };
    // 3.发送请求 获取文章列表数据
    function renderTable() {
        axios.get('/my/article/list', { params: query })
            .then(res => {
                console.log(res);
                // 判断是否获取成功
                if (res.status != 0) {
                    return layer.msg('文章列表获取失败！')
                };
                // layer.msg('文章列表获取成功！');
                // 在模板引擎渲染之前注册一个过滤器 格式化时间   模板引擎template文档中的写法
                template.defaults.imports.dateFormat = function(date) {
                    // 然后使用moment时间插件格式化时间
                    return moment(date).format('YYYY-MM-DD  HH:mm:ss');
                };

                //3.2 使用模板引擎渲染到页面上
                const htmlStr = template('tpl', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr)

                // 3.3 渲染分页器
                renderPage(res.total)
            })
    };
    renderTable()

    // 4.把服务器获取的数据 渲染成分页器
    function renderPage(total) {
        // 4.1调用layui文档里面的方法
        laypage.render({
            elem: 'pagination', //注意，这里的分页器容器的ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每一页显示的数量
            limits: [2, 3, 4, 5], //每页的数据条数
            curr: query.pagenum, //当前的页码数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的排版
            //    切换分页的回调函数
            jump: function(obj, first) {

                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 4.2修改查询对象query里面的参数
                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                //首次不执行
                // debugger;
                if (!first) {
                    //4.3非首次进入页面 重新渲染表格数据
                    renderTable()
                }
            }
        });
    };
    // 5.表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        // 5.1获取下拉选择框的分类 状态
        const cate_id = $('#cate-sl').val();
        const state = $('#state').val();
        // console.log(cate_id, state);
        // 5.2把获取到的值 重新赋值给query对象
        query.cate_id = cate_id;
        query.state = state;
        // 提交发送请求之前 修改页码值为第一页
        query.pagenum = 1;
        // 重新调用渲染表格的方法
        renderTable()
    });
    // 6.点击删除按钮  删除当前的文章
    $(document).on('click', '.del-btn', function() {
        // 6.1获取自定义属性的值
        const id = $(this).data('id');
        // 6.2 弹出询问框
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            // 点击确定的话 发送请求
            axios.get(`/my/article/delete/${id}`)
                .then(res => {
                    // console.log(res);
                    // 判断是否成功
                    if (res.status != 0) {
                        return layer.msg('删除失败')
                    };
                    layer.msg('删除成功');
                    // 填坑操作：如果当前页只有一条数据且不处于第一页时，那么删除这条数据之后，理论上应该去手动更新上一页的数据。

                    // 这里判断只有一条数据可以用 删除按钮的length或者tr的length
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        // 当前页码值减一
                        query.pagenum = query.pagenum - 1
                    }
                    renderTable()
                });
            // 确定后关闭弹出层
            layer.close(index);
        });
    });
    // 7.点击编辑按钮 跳转到编辑页面
    $(document).on('click', '.edit-btn', function() {
        // 获取当前文章的id  （编辑按钮实现加过data-id了）
        const id = $(this).data('id');
        // 如何在两个页面之间数据传递：使用查询参数 把id加进去 在另一个页面用search获取
        location.href = `./edit.html?id=${id}`;
        //自动触发a链接的点击事件 
        window.parent.$('.jump-edit').click()
    })
})