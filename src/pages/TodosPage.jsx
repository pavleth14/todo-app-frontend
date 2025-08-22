import { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';
import TodoInput from '../components/TodoInput';

const TodosPages = () => {

    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

    const [todos, setTodos] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token'); // uzmi token iz localStorage

    useEffect(() => {
        const fetchTodos = async () => {
            if (!token) {
                // Ako nema tokena, možda redirect ili logout
                setTodos([]);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/todos?filter=${filterStatus}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    // Možeš dodati logiku za nevalidan token ili 401
                    setTodos([]);
                    return;
                }
                const data = await response.json();
                setTodos(data);
                setLoading(false)
            } catch (error) {
                console.error('Greška pri fetchovanju todos:', error);
                setTodos([]);
            }
        };

        fetchTodos();
    }, [filterStatus, token]);

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                border: '1px solid',
                padding: '10px',
                boxSizing: 'border-box',
            }}
        >
            <TodoInput setTodos={setTodos} token={token} />
            <TodoList
                todos={todos}
                setTodos={setTodos}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                token={token} // ovde mozda ne treba token, u TodoList ga svakako ne koristim za sada
                loading={loading}
            />
        </div>
    );
};

export default TodosPages;
