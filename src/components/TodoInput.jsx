import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TodoInput = ({ setTodos }) => {

    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    
    const [todo, setTodo] = useState('');
    const navigate = useNavigate();

    const handleAddTodo = async () => {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: todo }),
        });

        const newTodo = await response.json();
        setTodos(prev => [newTodo, ...prev]); // ažuriraj state u parentu
        setTodo('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <div>
            <div style={{ border: '1px solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Todo List</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center'}}>
                <input type="text" value={todo} onChange={e => setTodo(e.target.value)} />
                <button onClick={handleAddTodo}>Add</button>
            </div>
        </div>
    );
};

export default TodoInput;
