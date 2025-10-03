// 代码生成时间: 2025-10-03 19:59:35
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// Create a new HAPI server instance
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// Define the common customer queries and their responses
const commonQueries = {
  'how to use the product': 'Here is a detailed guide on how to use the product.',
  'what is the return policy': 'Our return policy is as follows: [Detailed policy here].',
  'where is my order': 'You can track your order by logging into your account.',
  'can I return a damaged item': 'Yes, you can return damaged items within 30 days of purchase.',
};

// Define the route for handling customer queries
server.route({
  method: 'GET',
  path: '/query',
  options: {
    validate: {
      query: {
        question: Joi.string().required().description('The customer\'s question'),
      },
    },
    handler: async (request, h) => {
      const { question } = request.query;
      try {
        // Check if the question is a common query
        if (commonQueries[question]) {
          return {
            status: 'success',
            answer: commonQueries[question],
          };
        } else {
          // If the question is not common, return a generic response
          return {
            status: 'success',
            answer: 'Your question has been noted. A customer service representative will get back to you soon.',
          };
        }
      } catch (error) {
        // Handle any errors that may occur
        return {
          status: 'error',
          message: 'An error occurred while processing your request.',
        };
      }
    },
  },
});

// Start the server
async function start() {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error('Server failed to start:', err);
  }
}

start();