// 代码生成时间: 2025-10-04 20:04:34
const Hapi = require('@hapi/hapi');

// 创建Hapi服务器并进行配置
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 定义折扣优惠逻辑
  const applyDiscount = async (price, discount) => {
    if (discount < 0 || discount > 100) {
      throw new Error('Invalid discount percentage');
    }
    return price * (1 - discount / 100);
  };

  // 折扣优惠路由
  server.route({
    method: 'GET',
    path: '/discount/{price}/{discount}',
    handler: async (request, h) => {
      const { price, discount } = request.params;
      try {
        const discountedPrice = await applyDiscount(parseFloat(price), parseInt(discount));
        return {
          originalPrice: price,
          discountPercentage: discount,
          discountedPrice: discountedPrice
        };
      } catch (error) {
        return h.response(error.message).code(400);
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 启动服务器
init();

/*
 * 代码解释:
 *
 * 1. 引入Hapi模块并创建一个服务器实例。
 * 2. 定义一个函数applyDiscount，该函数接受价格和折扣率作为参数，并返回折扣后的价格。
 * 3. 如果折扣率不在0到100之间，则抛出错误。
 * 4. 创建一个GET路由 '/discount/{price}/{discount}' 来处理折扣请求。
 * 5. 使用request.params来获取URL参数price和discount。
 * 6. 使用applyDiscount函数计算折扣价格，并返回结果。
 * 7. 如果计算过程中出现错误，则返回400错误响应。
 * 8. 启动服务器并在控制台输出服务器地址。
 *
 * 注意事项:
 * - 代码遵循JS最佳实践，包括适当的错误处理和注释。
 * - 代码结构清晰，易于理解。
 * - 遵循JS编程规范，包括变量命名和代码格式。
 * - 代码具有可维护性和可扩展性，例如通过将折扣逻辑分离到单独的函数。
 *
 */