import React from 'react'
import { useRef , useState} from "react";

const Dashbord = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    const [task, setTask] = useState({
        name: '',
        description: '',
        dueDate: '',
        status: false,
      });
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({
          ...task,
          [name]: type === 'checkbox' ? checked : value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
      
        console.log(task);
      };
  return (
    <>
    <div className="bg-blue-500 p-4 flex justify-between items-center">

  <div className="text-white text-xl font-bold">
    Crud Application
  </div>


  <div className="text-white text-xl font-medium">
    Username
  </div>


  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
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

</div>
    </>

  )
}

export default Dashbord