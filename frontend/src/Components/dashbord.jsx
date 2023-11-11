import React, { useEffect } from 'react'
import { useState} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {TiTick} from "react-icons/ti"
import {RxCross2} from "react-icons/rx"
import {HiOutlinePencilSquare} from "react-icons/hi2"
import {RiDeleteBin4Fill} from "react-icons/ri"
const Dashbord = () => {
  const history = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [taskData , setTaskdata] = useState([])
    const [keyForRerender, setKeyForRerender] = useState(0);
    const first = localStorage.getItem("first")
    const last = localStorage.getItem("last")
    const [currentTask, setCurrentTask] = useState(null);
    const [isUpdateModalOpen, SetisUpdateModalOpen] = useState(false)

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleUpdateModal = () => {
      SetisUpdateModalOpen(true)
    }
    
    const handleCloseModal = () => {
      SetisUpdateModalOpen(false)
      setIsModalOpen(false);
    };
    const [task, setTask] = useState({
        name: '',
        description: '',
        dueDate: '',
        status: false,
      });
      

      useEffect(() => {
        setIsLoading(true); 
        axios.get("http://127.0.0.1:8000/get_data/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("Token")}`
          }
        }).then((response) => {
          setTaskdata(response.data);
          console.log(response.data);
          setIsLoading(false); 
        });
      }, [keyForRerender]);
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({
          ...task,
          [name]: type === 'checkbox' ? checked : value,
        });
      };
      console.log(task.name, task.description);

      const handleChange2 = (e) => {
        const { name, value, type, checked } = e.target;
        setEditTask({
          ...editTask,
          [name]: type === 'checkbox' ? checked : value,
        });
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          setIsLoading(true);
      
          const token = localStorage.getItem("Token");
          const response = await axios.post(
            "http://127.0.0.1:8000/create/",
            {
              name: task.name,
              description: task.description,
              due_date: task.dueDate,
              status: task.status,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          setTaskdata((prevTasks) => [...prevTasks, response.data]);
          handleCloseModal();
          setKeyForRerender((prevKey) => prevKey + 1); 
        } catch (error) {
          console.error("Error:", error);
        }finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      };
    

      const [editTask, setEditTask] = useState({
        name: '',
        description: '',
        dueDate: '',
        status: false,
      });

      const handleEdit = (task) => {
        setCurrentTask(task);
        setEditTask({
          name: task.name,
          description: task.description,
          dueDate: task.due_date,
          status: task.status,
        });
        handleUpdateModal();
      };



      const handleUpdate = async (e) => {
        e.preventDefault(); 
      
        try {
          setIsLoading(true);
          const token = localStorage.getItem("Token");
      
          const response = await axios.put(
            `http://127.0.0.1:8000/update/${currentTask.id}`,
            {
              name: editTask.name,
              description: editTask.description,
              due_date: editTask.dueDate,
              status: editTask.status,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          setTaskdata((prevTasks) =>
            prevTasks.map((prevTask) =>
              prevTask.id === currentTask.id ? response.data : prevTask
            )
          );
      
          handleCloseModal();
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      

      const handleDelete = async (taskId) => {
        try {
          const token = localStorage.getItem("Token");
          await axios.delete(`http://127.0.0.1:8000/delete/${taskId}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          });
    
          setTaskdata((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const logoutMe = () => {
        localStorage.removeItem('Token');
        history("/")
      }

  return (
    <>
    <div className="bg-blue-500 p-4 flex justify-between items-center">

  <div className="text-white text-xl font-bold">
    Crud Application
  </div>


  <div className="text-white text-xl font-medium">
    {first} {last}
  </div>


  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={logoutMe}>
    Logout
  </button>
</div>

    <div className='container mx-auto'>

  
<h3 className='text-center text-4xl mt-2'>Task Manager</h3>
<button onClick={handleOpenModal} className="custom-button bg-purple-600 text-white font-medium py-2 px-4 rounded-md hover:bg-purple-700">
        Add Task
      </button>


      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Add Task</h2>
            <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Task Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-gray-700 font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Status
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={task.status}
              onChange={handleChange}
              className="form-checkbox text-purple-600"
            />
            <span className="ml-2 text-gray-700">Completed</span>
          </label>
        </div>
        <div className="mb-2 text-center">
        <button
  type="submit"
  className="custom-button bg-purple-600 text-white font-medium py-2 px-4 rounded-md hover:bg-purple-700"
>
  Add Task
</button>

        </div>
      </form> 
            <button onClick={handleCloseModal} className="text-gray-600 text-sm mt-4 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}

{isUpdateModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Task Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={editTask.name}
            onChange={handleChange2}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={editTask.description}
            onChange={handleChange2}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-gray-700 font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={editTask.dueDate}
            onChange={handleChange2}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Status
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={editTask.status}
              onChange={handleChange2}
              className="form-checkbox text-purple-600"
            />
            <span className="ml-2 text-gray-700">Completed</span>
          </label>
        </div>
        <div className="mb-2 text-center">
        <button
  type="submit"
  className="custom-button bg-purple-600 text-white font-medium py-2 px-4 rounded-md hover:bg-purple-700"
>
  Update Task
</button>

        </div>
      </form>
            <button onClick={handleCloseModal} className="text-gray-600 text-sm mt-4 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}

  <h2 class="text-2xl font-semibold mb-4">Task Table</h2>


  <table class="min-w-full bg-white border border-gray-300 mb-3">
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">Title</th>
        <th class="py-2 px-4 border-b">Description</th>
        <th class="py-2 px-4 border-b">Date</th>
        <th class="py-2 px-4 border-b">Status</th>
        <th class="py-2 px-4 border-b">Actions</th>
      </tr>
    </thead>
    {isLoading ? (
  <p>Loading...</p>
) : (
  <tbody>
  {taskData.map((value, index) => (
        <tr key={value.id}>
        <td class="py-2 px-4 border-b">{value.name}</td>
        <td class="py-2 px-4 border-b max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{value.description}</td>
        <td class="py-2 px-4 border-b">{value.due_date}</td>
        <td class="py-2 px-4 border-b">{value.status ? (<><p className='text-green-500'><TiTick /></p></>) : (<> <p className='text-red-500'><RxCross2 /></p></>)}</td>
        <td class="py-2 px-4 border-b">
        <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleEdit(value)}
                    >
                      <p className="text-green-700">
                        {<HiOutlinePencilSquare />}
                      </p>
                    </button>
          <button class="text-red-800 hover:underline" onClick={() => handleDelete(value.id)}><p className='text-red-500'>{<RiDeleteBin4Fill />}</p></button>
        </td>
      </tr>
))}


  </tbody>
)}

  </table>


</div>
    </>

  )
}

export default Dashbord