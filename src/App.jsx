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

	// Состояние темы приложения
	const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

	// Переключение темы
    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

	// Применяем тему к body
    useEffect(() => {
        document.body.style.backgroundColor = theme === 'light' ? '#fff' : '#222';
        document.body.style.color = theme === 'light' ? '#333' : '#eee';
    }, [theme]);

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
			fontFamily: 'Arial, sans-serif',
			backgroundColor: theme === 'light' ? '#fff' : '#222',
			color: theme === 'light' ? '#333' : '#eee',
		}}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ color: theme === 'light' ? '#333' : '#eee' }}>Менеджер задач</h1>
                <button onClick={toggleTheme} style={{
                    padding: '6px 12px',
                    background: theme === 'light' ? '#333' : '#eee',
                    color: theme === 'light' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
                </button>
            </div>
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
							theme={theme}
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