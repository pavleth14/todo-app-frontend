import { useState } from "react";


const TodoList = ({ todos, setTodos, filterStatus, setFilterStatus, loading }) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleCheckboxCompletedTodo = async (id, completed) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }), // true ili false
            });

            const updatedTodo = await response.json();
            console.log('updated todo: ', updatedTodo)

            setTodos(prev =>
                prev.map(todo => (todo.id === id ? updatedTodo : todo))
            );
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="uncompleted">Uncompleted</option>
                </select>
            </div>
            <div style={{ marginTop: '20px' }}>
                {loading
                    ? <h1 style={{textAlign: 'center'}}>Loading...</h1>
                    : todos.map(todo => (
                        <div key={todo.id} style={{ border: '1px solid white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', border: '1px solid', marginBottom: '5px' }}>
                            <div>
                                <div style={{ color: todo.completed ? 'green' : 'black' }}>{todo.title}</div>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => handleCheckboxCompletedTodo(todo.id, e.target.checked)}
                                />
                            </div>
                            <button onClick={() => handleDelete(todo.id)}>Delete</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default TodoList;
