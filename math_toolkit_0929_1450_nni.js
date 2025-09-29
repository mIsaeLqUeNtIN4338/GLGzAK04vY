// 代码生成时间: 2025-09-29 14:50:16
const Hapi = require('@hapi/hapi');

// 创建一个新的Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义数学工具集对象
const mathToolkit = {
    // 加法
    add: function add(x, y) {
        return x + y;
    },
    
    // 减法
    subtract: function subtract(x, y) {
        return x - y;
    },
    
    // 乘法
    multiply: function multiply(x, y) {
        return x * y;
    },
    
    // 除法，需要检查除数是否为0
    divide: function divide(x, y) {
        if (y === 0) {
            throw new Error('Division by zero is not allowed.');
        }
        return x / y;
    }
};

// 创建一个路由，用于处理数学计算请求
server.route({
    method: 'POST',
    path: '/math/{operation}',
    handler: async (request, h) => {
        const { operation } = request.params;
        const { x, y } = request.payload;
        
        // 检查操作是否在工具集中
        if (!mathToolkit[operation]) {
            return h.response('Invalid operation').takeover().statusCode(400);
        }
        
        try {
            const result = mathToolkit[operation](x, y);
            return h.response({ result }).code(200);
        } catch (error) {
            return h.response(error.message).takeover().statusCode(400);
        }
    }
});

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();