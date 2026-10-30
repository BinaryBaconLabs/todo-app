import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('edits a todo on double-click: Enter saves, Escape cancels', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'buy mlk' } });
  fireEvent.submit(input.closest('form'));

  fireEvent.doubleClick(screen.getByText('buy mlk'));
  const editInput = screen.getByRole('textbox', { name: /edit task/i });
  fireEvent.change(editInput, { target: { value: 'buy milk' } });
  fireEvent.keyDown(editInput, { key: 'Enter' });
  expect(screen.getByText('buy milk')).toBeInTheDocument();

  fireEvent.doubleClick(screen.getByText('buy milk'));
  const cancelInput = screen.getByRole('textbox', { name: /edit task/i });
  fireEvent.change(cancelInput, { target: { value: 'discard me' } });
  fireEvent.keyDown(cancelInput, { key: 'Escape' });
  expect(screen.getByText('buy milk')).toBeInTheDocument();
  expect(screen.queryByText('discard me')).not.toBeInTheDocument();
});

test('trims whitespace around a new todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: '  buy milk  ' } });
  fireEvent.submit(input.closest('form'));
  expect(screen.getByText('buy milk')).toBeInTheDocument();
});

test('labels the delete button with the todo text', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'walk the dog' } });
  fireEvent.submit(input.closest('form'));
  expect(screen.getByRole('button', { name: /delete walk the dog/i })).toBeInTheDocument();
});

test('removes a todo when its delete button is clicked', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'renew the passport' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByRole('button', { name: /delete renew the passport/i }));
  expect(screen.queryByText('renew the passport')).not.toBeInTheDocument();
  expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
});

test('keeps focus in the input after adding a todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'call the plumber' } });
  fireEvent.submit(input.closest('form'));
  expect(input).toHaveFocus();
});

test('disables the add button until there is a task to add', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  fireEvent.change(input, { target: { value: 'read a book' } });
  expect(screen.getByRole('button', { name: /^add$/i })).toBeEnabled();
  fireEvent.change(input, { target: { value: '   ' } });
  expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
});

test('renders todo app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Todo App/i);
  expect(titleElement).toBeInTheDocument();
});

test('clears completed todos but keeps the open ones', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'water the plants' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'take out the bins' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('water the plants'));
  fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
  expect(screen.queryByText('water the plants')).not.toBeInTheDocument();
  expect(screen.getByText('take out the bins')).toBeInTheDocument();
});

test('counts the todos that are still open', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(input, { target: { value: 'water the plants' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'take out the bins' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('water the plants'));
  expect(screen.getByText('1 of 2 remaining')).toBeInTheDocument();
});

test('shows all todos when the All filter is selected', () => {
  window.localStorage.clear();
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);

  fireEvent.change(input, { target: { value: 'active task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'completed task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('completed task'));

  fireEvent.click(screen.getByRole('button', { name: 'All' }));

  expect(screen.getByText('active task')).toBeInTheDocument();
  expect(screen.getByText('completed task')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
});

test('shows only active todos when the Active filter is selected', () => {
  window.localStorage.clear();
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);

  fireEvent.change(input, { target: { value: 'active task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'completed task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('completed task'));

  fireEvent.click(screen.getByRole('button', { name: 'Active' }));

  expect(screen.getByText('active task')).toBeInTheDocument();
  expect(screen.queryByText('completed task')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
});

test('shows only completed todos when the Completed filter is selected', () => {
  window.localStorage.clear();
  render(<App />);
  const input = screen.getByPlaceholderText(/Add a new task/i);

  fireEvent.change(input, { target: { value: 'active task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.change(input, { target: { value: 'completed task' } });
  fireEvent.submit(input.closest('form'));
  fireEvent.click(screen.getByText('completed task'));

  fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

  expect(screen.queryByText('active task')).not.toBeInTheDocument();
  expect(screen.getByText('completed task')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
});

test('moves the first todo down', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  ['Task A', 'Task B', 'Task C'].forEach((task) => {
    fireEvent.change(input, { target: { value: task } });
    fireEvent.submit(input.closest('form'));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Move Task A down' }));

  const items = screen.getAllByRole('listitem');
  expect(items.map(item =>
    item.querySelector('span')?.textContent
  )).toEqual(['Task B', 'Task A', 'Task C']);
});

test('moves the last todo up', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  ['Task A', 'Task B', 'Task C'].forEach((task) => {
    fireEvent.change(input, { target: { value: task } });
    fireEvent.submit(input.closest('form'));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Move Task C up' }));

  const items = screen.getAllByRole('listitem');
  expect(items.map(item =>
    item.querySelector('span')?.textContent
  )).toEqual(['Task A', 'Task C', 'Task B']);
});

test('moves a focused todo down with j', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  ['Task A', 'Task B', 'Task C'].forEach((task) => {
    fireEvent.change(input, { target: { value: task } });
    fireEvent.submit(input.closest('form'));
  });

  const taskB = screen.getByText('Task B').closest('li');
  taskB.focus();
  fireEvent.keyDown(taskB, { key: 'j' });

  const items = screen.getAllByRole('listitem');
  expect(items.map(item =>
    item.querySelector('span')?.textContent
  )).toEqual(['Task A', 'Task C', 'Task B']);
});

test('updates browser title when remaining todos change', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  fireEvent.change(input, { target: { value: 'Task A' } });
  fireEvent.submit(input.closest('form'));

  fireEvent.change(input, { target: { value: 'Task B' } });
  fireEvent.submit(input.closest('form'));

  expect(document.title).toBe('(2) todo-app');

  fireEvent.click(screen.getByText('Task A'));

  expect(document.title).toBe('(1) todo-app');
});

test('moves a focused todo up with k', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  ['Task A', 'Task B', 'Task C'].forEach((task) => {
    fireEvent.change(input, { target: { value: task } });
    fireEvent.submit(input.closest('form'));
  });

  const taskB = screen.getByText('Task B').closest('li');
  taskB.focus();
  fireEvent.keyDown(taskB, { key: 'k' });

  const items = screen.getAllByRole('listitem');
  expect(items.map(item =>
    item.querySelector('span')?.textContent
  )).toEqual(['Task B', 'Task A', 'Task C']);
});

test('persists the reordered todos in localStorage', () => {
  window.localStorage.clear();
  render(<App />);

  const input = screen.getByPlaceholderText(/Add a new task/i);

  ['Task A', 'Task B', 'Task C'].forEach((task) => {
    fireEvent.change(input, { target: { value: task } });
    fireEvent.submit(input.closest('form'));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Move Task A down' }));

  const savedTodos = JSON.parse(window.localStorage.getItem('todos'));

  expect(savedTodos.map(todo => todo.text)).toEqual([
    'Task B',
    'Task A',
    'Task C',
  ]);
});
