import { useState, useEffect } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoFilters from './components/TodoFilters';
import TodoItem from './components/TodoItem';
function App() {

	// Состояние для списка задач
	const [todos, setTodos] = useState(() => {
		// Загружаем сохраненные задачи из localStorage
		const saved = localStorage.getItem('todos');
		return saved ? JSON.parse(saved) : [];
	});

	// Состояние для текущего фильтра
	const [filter, setFilter] = useState('all');
	// Сохраняем задачи в localStorage при каждом изменении
	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	// Добавление новой задачи
	const addTodo = (text) => {
		const newTodo = {
			id: Date.now(),
			text: text,
			completed: false
		};
		setTodos([...todos, newTodo]);
	};

	// Переключение статуса задачи
	const toggleTodo = (id) => {
		setTodos(todos.map(todo =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		));
	};

	const renameTodo = (id, newText) => {
		setTodos(todos.map(todo =>
			todo.id === id ? { ...todo, text : newText } : todo
		));
	};

	// Удаление задачи
	const deleteTodo = (id) => {
		setTodos(todos.filter(todo => todo.id !== id));
	};

	// Фильтрация задач
	const filteredTodos = todos.filter(todo => {
		if (filter === 'active') return !todo.completed;
		if (filter === 'completed') return todo.completed;
		return true; // 'all'
	});

	// Подсчет активных задач
	const activeCount = todos.filter(todo => !todo.completed).length;
	return (
		<div style={{
			maxWidth: '600px',
			margin: '0 auto',
			padding: '20px',
			fontFamily: 'Arial, sans-serif'
		}}>
			<h1 style={{ textAlign: 'center', color: '#333' }}>Менеджер задач</h1>
			<AddTodoForm onAdd={addTodo} />
			<TodoFilters
				filter={filter}
				onFilterChange={setFilter}
				activeCount={activeCount}
			/>
			{filteredTodos.length === 0 ? (
				<p style={{ textAlign: 'center', color: '#999' }}>
					{filter === 'all' ? 'Задач пока нет' :
						filter === 'active' ? 'Нет активных задач' : 'Нет выполненных задач'}
				</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{filteredTodos.map(todo => (
						<TodoItem
							key={todo.id}
							task={todo}
							onToggle={toggleTodo}
							onDelete={deleteTodo}
							onEdit={renameTodo}
						/>
					))}
				</ul>
			)}
			{todos.length > 0 && (
				<button
					onClick={() => setTodos([])}
					style={{
						marginTop: '20px',
						padding: '8px 16px',
						background: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						width: '100%'
					}}
				>
					Очистить всё
				</button>
			)}
		</div>
	);
}

export default App;