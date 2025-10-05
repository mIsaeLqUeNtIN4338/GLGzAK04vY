// 代码生成时间: 2025-10-05 19:43:43
// Import required modules
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const https = require('https');
const pem = require('pem');

// Create a server instance
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// Initialize the server with routes
async function init() {
  await server.register(require('vision'));
  await server.views({
    engines: { html: require('handlebars') },
    relativeTo: __dirname,
    path: 'views',
    layoutPath: 'views/layouts',
    layout: 'default',
    partialsPath: 'views/partials',
  });

  // Define routes for the certificate management
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Welcome to TLS Certificate Manager';
    },
  });

  server.route({
    method: 'GET',
    path: '/generate',
    handler: async (request, h) => {
      try {
        const { cert, key } = await pem.createCertificate({
          days: 1, // 1 day for testing, should be longer in production
          selfSigned: true,
        });

        // Save the certificate files to the file system
        fs.writeFileSync(path.join(__dirname, 'certificates', 'server.crt'), cert);
        fs.writeFileSync(path.join(__dirname, 'certificates', 'server.key'), key);

        // Return a success message
        return h.response('TLS certificate generated successfully').code(200);
      } catch (error) {
        // Return an error response if something goes wrong
        return h.response('Failed to generate TLS certificate: ' + error.message).code(500);
      }
    },
  });

  // Start the server
  await server.start();
  console.log('Server running at:', server.info.uri);
}

// Call the init function to start the server
init();
