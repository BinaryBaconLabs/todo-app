import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'todos';

function App() {
  // Load saved todos when the app starts.
  const [todos, setTodos] = useState(() => {
    try {
      const storedTodos = window.localStorage.getItem(STORAGE_KEY);
      if (!storedTodos) return [];

      const parsedTodos = JSON.parse(storedTodos);

      const validTodos =
        Array.isArray(parsedTodos) &&
        parsedTodos.every(
          (todo) =>
            todo !== null &&
            typeof todo === 'object' &&
            typeof todo.id === 'number' &&
            typeof todo.text === 'string' &&
            typeof todo.completed === 'boolean'
        );

      return validTodos ? parsedTodos : [];
    } catch {
      // Missing access or corrupt JSON should not crash the app.
      return [];
    }
  });

  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Save todos whenever the list changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Keep the app usable if storage is blocked or full.
    }
  }, [todos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

      if (e.key === 'n') {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInput('');
    }
  };

  const addTodo = (e) => {
    e.preventDefault();

    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false
        }
      ]);

      setInput('');
      inputRef.current.focus();
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const remaining = todos.filter(todo => !todo.completed).length;
  const completed = todos.length - remaining;

  return (
    <div className="app">
      <h1>Todo App</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleInputKeyDown}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />

        <button
          type="submit"
          className="add-btn"
          disabled={!input.trim()}
        >
          Add
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;

              if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

              if (e.key === 'x') {
                toggleTodo(todo.id);
              }
            }}
          >
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
              aria-label={`Delete ${todo.text}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="todo-footer">
          <p className="remaining">
            {remaining} of {todos.length} remaining
          </p>

          {completed > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="clear-btn"
            >
              Clear completed
            </button>
          )}
        </div>
      )}

      {todos.length === 0 && (
        <p className="empty" role="status">
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  );
}

export default App;