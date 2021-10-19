import { useEffect } from 'react';
import { useState } from 'react';

export function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  async function fetchTodos() {
    try {
      const response = await fetch(
        'http://localhost:8000/todos/'
      );
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (err) {
      console.log('Error: ', err);
      return [];
    }
  }

  function createTodo(event) {
    event.preventDefault();
    if (title) {
      fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
        }),
      })
        .then((response) => response.json())
        // .then((response) => JSON.parse(response))
        .then((todo) => {
          setTodos((todos) => [...todos, todo]);
          setTitle('');
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    fetchTodos().then((todos) => setTodos(todos));
  }, []);

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        <ul>
          {todos.map((todo, index) => (
            <li key={todo.id || index} style={{ padding: '0.5rem' }}>
              <span>{index + 1}.</span> {todo.title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '5px' }}>
            <button disabled={title == ''} onClick={createTodo}>
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
