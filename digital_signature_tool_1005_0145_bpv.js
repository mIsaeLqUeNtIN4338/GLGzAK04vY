// 代码生成时间: 2025-10-05 01:45:21
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 数字签名工具类
class DigitalSignatureTool {
  // 构造函数
  constructor(server) {
    this.server = server;
  }

  // 初始化数字签名工具的路由
  initRoutes() {
    this.server.route({
      method: 'POST',
      path: '/signature',
      handler: this.createSignature,
      config: {
        validate: {
          payload: {
            message: Joi.string().required(),
            secretKey: Joi.string().required()
          }
        }
      }
    });
  }

  // 创建数字签名
  createSignature(request, h) {
    try {
      const { message, secretKey } = request.payload;
      // 使用提供的密钥和消息创建数字签名
      const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
      // 返回签名结果
      return h.response({
        message: 'Signature created successfully',
        signature: signature
      }).code(200);
    } catch (error) {
      // 错误处理
      return h.response({
        message: 'Failed to create signature',
        error: error.message
      }).code(500);
    }
  }
}

// 创建HAPI服务器并添加数字签名工具
async function startServer() {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 注册数字签名工具
  const signatureTool = new DigitalSignatureTool(server);
  signatureTool.initRoutes();

  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

startServer();