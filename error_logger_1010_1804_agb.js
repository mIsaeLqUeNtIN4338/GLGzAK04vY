// 代码生成时间: 2025-10-10 18:04:20
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

// 创建一个可写流，用于写入错误日志到文件
const createErrorLogFile = () => {
  const logStream = new Writable({
    write: (chunk, encoding, callback) => {
      const logFilePath = path.join(__dirname, 'error.log');
      fs.appendFile(logFilePath, chunk, encoding, callback);
    }
  });
  return logStream;
};

// 创建HAPI服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 错误处理中间件
  server.ext('onPreResponse', (request, h) => {
    if (request.response.isBoom) {
      const error = request.response;
      const logStream = createErrorLogFile();
      logStream.write(`${error.message}
`);
      logStream.end();
      return h.continue;
    }
    return h.continue;
  });

  // 测试路由，故意抛出错误
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      throw new Error('Test error');
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init().catch(err => {
  console.error('Failed to start server:', err);
});