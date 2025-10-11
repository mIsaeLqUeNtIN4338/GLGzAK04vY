// 代码生成时间: 2025-10-11 17:54:54
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000,
});

// Define the schema for creating a new homework assignment
const createHomeworkSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  subject: Joi.string().required(),
  assignedTo: Joi.array().items(Joi.string()),
});

// Define the schema for listing homework assignments
const listHomeworkSchema = Joi.object({
  title: Joi.string().min(3).max(255).allow(null),
  description: Joi.string().min(3).max(255).allow(null),
  dueDate: Joi.date().min('1-1-1970').max('1-1-3000').allow(null),
  subject: Joi.string().min(3).max(255).allow(null),
  assignedTo: Joi.array().items(Joi.string()).allow(null),
});

// Define the schema for updating a homework assignment
const updateHomeworkSchema = Joi.object({
  title: Joi.string().min(3).max(255).allow(null),
  description: Joi.string().min(3).max(255).allow(null),
  dueDate: Joi.date().min('1-1-1970').max('1-1-3000').allow(null),
  subject: Joi.string().min(3).max(255).allow(null),
  assignedTo: Joi.array().items(Joi.string()).allow(null),
}).min(1);

// Home assignments storage
const homeworkAssignments = [];

// Route to create a new homework assignment
server.route({
  method: 'POST',
  path: '/homework',
  options: {
    validate: {
      payload: createHomeworkSchema,
    },
    handler: async (request, h) => {
      try {
        const { title, description, dueDate, subject, assignedTo } = request.payload;
        const newAssignment = {
          title,
          description,
          dueDate,
          subject,
          assignedTo,
          id: Date.now(),
        };
        homeworkAssignments.push(newAssignment);
        return h.response(newAssignment).code(201);
      } catch (error) {
        return h.response(error).code(400);
      }
    },
  },
});

// Route to list homework assignments
server.route({
  method: 'GET',
  path: '/homework',
  options: {
    validate: {
      query: listHomeworkSchema,
    },
    handler: async (request, h) => {
      const { title, description, dueDate, subject, assignedTo } = request.query;
      // Filter homework assignments based on query parameters
      const filteredAssignments = homeworkAssignments.filter(assignment => {
        return (
          (title ? assignment.title.includes(title) : true) &&
          (description ? assignment.description.includes(description) : true) &&
          (dueDate ? assignment.dueDate === dueDate : true) &&
          (subject ? assignment.subject.includes(subject) : true) &&
          (assignedTo ? assignment.assignedTo.some(a => assignedTo.includes(a)) : true)
        );
      });
      return filteredAssignments;
    },
  },
});

// Route to update a homework assignment
server.route({
  method: 'PUT',
  path: '/homework/{id}',
  options: {
    validate: {
      params: Joi.object({ id: Joi.number().required() }),
      payload: updateHomeworkSchema,
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { title, description, dueDate, subject, assignedTo } = request.payload;
      const assignmentIndex = homeworkAssignments.findIndex(assignment => assignment.id === id);
      if (assignmentIndex === -1) {
        return h.response('Homework assignment not found').code(404);
      }
      try {
        const updatedAssignment = {
          ...homeworkAssignments[assignmentIndex],
          title,
          description,
          dueDate,
          subject,
          assignedTo,
        };
        homeworkAssignments[assignmentIndex] = updatedAssignment;
        return updatedAssignment;
      } catch (error) {
        return h.response(error).code(400);
      }
    },
  },
});

// Route to delete a homework assignment
server.route({
  method: 'DELETE',
  path: '/homework/{id}',
  options: {
    validate: { params: Joi.object({ id: Joi.number().required() }) },
    handler: async (request, h) => {
      const { id } = request.params;
      const assignmentIndex = homeworkAssignments.findIndex(assignment => assignment.id === id);
      if (assignmentIndex === -1) {
        return h.response('Homework assignment not found').code(404);
      }
      homeworkAssignments.splice(assignmentIndex, 1);
      return h.response().code(204);
    },
  },
});

// Start the server
async function start() {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();