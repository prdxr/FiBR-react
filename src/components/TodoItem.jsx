import { useState } from "react";

function TodoItem({ task, onToggle, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleSave = () => {
        if (editText.trim() !== '') {
            onEdit(task.id, editText);
        } else {
            // можно не сохранять пустую строку или восстановить старое значение
            onEdit(task.id, task.text);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditText(task.text); // возвращаем исходное значение
        }
    };

    return (
        <li style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            borderBottom: '1px solid #eee'
        }}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
            />
            {isEditing ? (
                <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus // полезно для автоматического фокуса
                />
            ) : (
                <span style={{
                        flex: 1,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#999' : '#333'
                    }}
                    onDoubleClick={() => {
                        setIsEditing(true);
                        setEditText(task.text);
                    }}
                >
                    {task.text}
                </span>
            )}
            <button
                onClick={() => onDelete(task.id)}
                style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                }}
            >
                Удалить
            </button>
        </li>
    );
}
export default TodoItem;