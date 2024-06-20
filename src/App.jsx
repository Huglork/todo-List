import './App.css';
import axios from 'axios';
import {useEffect, useState} from 'react';
import trashbin from './assets/trashBin.svg'
function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('')



    const getTasks = async () => {
        const response = await axios.get('https://66716068e083e62ee43b5632.mockapi.io/v1/tasks');
        const tasksWithStatus = response.data.map(task => ({...task, isDone: false}));
        setTasks(tasksWithStatus);
    };


    const toggleTaskStatus = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? {...task, isDone: !task.isDone} : task
        ));
    };

    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    };

    const handleAddTask = async () => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const dayOfWeek = daysOfWeek[today.getDay()];

        const newTaskObject = {
            text: newTask,
            date: dayOfWeek,
            isDone: false
        };

        if(newTaskObject.text !== ''){
            try {
                const response = await axios.post('https://66716068e083e62ee43b5632.mockapi.io/v1/tasks', newTaskObject);
                setTasks([...tasks, response.data]);
                setNewTask('');
            }
            catch (e) {
                alert(e)
            }
        }

    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`https://66716068e083e62ee43b5632.mockapi.io/v1/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


    useEffect(() => {
        getTasks();
    }, []);


    const sortedTasks = [...tasks].sort((a, b) => a.isDone - b.isDone)
    return (
        <ul className="flex flex-col gap-3 items-center">
            <h1 className='mt-20 mb-16 text-3xl font-bold'>Todo List</h1>
            {sortedTasks.map((item) => (
                <li
                    className={item.isDone ? `list__item active` : `list__item`}
                    key={item.id}
                >
                    <p className="mr-2 capitalize">{item.text}</p>
                    <div className='ml-auto'>
                        <span>{item.date}</span>
                        <input
                            className='ml-8'
                            onChange={() => toggleTaskStatus(item.id)}
                            type="checkbox"
                            checked={item.isDone}
                        />
                    </div>
                    <button onClick={()=>handleDeleteTask(item.id)}><img className='trashbin ml-3' src={trashbin} alt="trashbin"/></button>
                </li>
            ))}

            <input className='w-1/4 rounded-lg border-2 px-2 py-1 border-black outline-black'
                   type="text"
                   value={newTask}
                   onChange={handleInputChange}
                   placeholder="Enter new task"
            />

            <button className='border-2 border-black bg-black text-white
            rounded-lg w-1/4 hover:bg-white hover:text-black duration-300' onClick={handleAddTask}>Add task</button>

            <li><h2 className='text-lg mt-4'>Created by Abdulla Khudaibergenov 2024</h2></li>
        </ul>
    );
}

export default App;