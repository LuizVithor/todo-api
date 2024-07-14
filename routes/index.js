var express = require('express');
var router = express.Router();
var db = require('../db');

function validateRequest(requiredFields) {
  return function (req, res, next) {
    const missingFields = requiredFields.filter(field => !req?.body[field] || req?.body[field]?.trim() === '');
    if (missingFields?.length > 0) {
      res.statusMessage = `Missing required fields: ${missingFields.join(', ')}`;
      return res
        .status(400)
        .json({
          missingFields: missingFields
        });
    }
    next();
  };
}

function fetchTodos(_req, res, next) {
  db.all('SELECT * FROM todos', [], function (err, rows) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    var todos = rows.map(function (row) {
      return {
        id: row.id,
        title: row.title,
        completed: row.completed == 1 ? true : false,
        url: '/' + row.id
      }
    });
    res.locals.todos = todos;
    next();
  });
}

router.get('/tasks', fetchTodos, function (_req, res) {
  res.json({ todos: res.locals.todos });
});

router.get('/tasks/active', fetchTodos, function (_req, res) {
  const activeTodos = res.locals.todos.filter(todo => !todo.completed);
  res.json({ todos: activeTodos });
});

router.get('/tasks/completed', fetchTodos, function (_req, res) {
  const completedTodos = res.locals.todos.filter(todo => todo.completed);
  res.json({ todos: completedTodos });
});

router.post('/tasks', validateRequest(['title']), function (req, res) {
  /*  #swagger.parameters['body'] = {
          in: 'body',
          description: 'Detalhes da tarefa',
          schema: { $ref: '#/definitions/addTask' }
  } */
  const title = req.body?.title?.trim();
  if (title !== '') {
    db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [
      title,
      req.body?.completed == true ? 1 : null
    ], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Todo added successfully' });
    });
  } else {
    res.status(400).json({ error: 'Title cannot be empty' });
  }
});

router.patch('/todos/:id', function (req, res) {
  const todoId = req.params.id;
  db.get('SELECT completed FROM todos WHERE id = ?', [todoId], function (err, row) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const newCompletedStatus = row.completed == 1 ? 0 : 1;
    db.run('UPDATE todos SET completed = ? WHERE id = ?', [newCompletedStatus, todoId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'Todo status updated successfully', id: todoId, completed: newCompletedStatus == 1 });
    });
  });
});

module.exports = router;
