// 代码生成时间: 2025-10-06 02:08:22
const Hapi = require('@hapi/hapi');
const Wreck = require('@hapi/wreck');
const Hoek = require('@hapi/hoek');
const Xss = require('xss'); // 使用xss库进行XSS防护

// 创建Hapi服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// XSS防护中间件
const xssFilter = (request, h) => {
    const { payload } = request; // 获取请求载荷
    if (payload) {
        Object.keys(payload).forEach((key) => {
            // 对每个属性使用xss库进行清理
            payload[key] = Xss(payload[key], {
                onIgnoreTag: () => {
                    throw Boom.badRequest('Invalid input detected'); // 非法标签时抛出错误
                },
                whiteList: {
                    // 定义允许的标签和属性
                    a: ['href', 'title'],
                    b: [],
                    i: [],
                    u: []
                },
                stripIgnoreTag: true,
                stripIgnoreTagBody: true
            });
        });
    }
    return h.continue; // 继续处理请求
};

// 注册中间件
server.ext('onPreHandler', {
    type: 'onPreHandler',
    method: xssFilter,
    async handler(request, h) {
        try {
            // 执行xssFilter函数
            await xssFilter(request, h);
            return h.continue;
        } catch (error) {
            // 错误处理
            return h.response(error).code(error.output.statusCode);
        }
    }
});

// 测试路由
server.route({
    method: 'POST',
    path: '/test',
    options: {
        payload: {
            parse: true, // 允许解析请求体
        },
        handler: async (request, h) => {
            const { message } = request.payload;
            return 'Received message: ' + message; // 返回接收到的消息
        }
    }
});

// 启动服务器
async function start() {
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

start();