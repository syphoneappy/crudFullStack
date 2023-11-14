import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import Lottie from "lottie-react";
import groovyWalkAnimation from "./lottieAnimation1.json";
import {BsFillArrowLeftCircleFill} from 'react-icons/bs'
import {BsFillArrowRightCircleFill} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import Api from './Api';
import { useNavigate } from 'react-router-dom';
import { adminUser } from '../features/counters/CounterSlice';
import { useDispatch } from 'react-redux'
const Home = () => {
  const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const dispach = useDispatch()
    const [change,SetChange] = useState()
    const [validPassword, setValidPassword] = useState(true);
    const [validEmail, setValidEmail] = useState(true)
    const [step, setStep] = useState(1);
    const [EmailAvailiblity, setEmailAvailiblity] = useState(false)
    const [UsernameAvailibility, setUsernameAvailibility] = useState(false)
    const [MyMessage, SetMyMessage] = useState({});
    const [user,SetUser] = useState()
    const [password, SetPassword] = useState()

    const uniqueId = (name) => `inline-${name}`;

    const validatePassword = (password) => {
      const hasValidLength = password.length >= 8;
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    
      return hasValidLength && hasNumber && hasSpecialChar;
    };

    const isEmailValid = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const [formData, setFormData] = useState({
      fullName: '',
      username: '',
      email: '',
      password: '',
      subscribe: false,
    });
    

    useEffect(() => {
  
      if (formData.email && validEmail) {
        checkEmailAvailability(formData.email);
        checkUserAvailability(formData.username);
      }
    }, [formData.email, formData.username,  validEmail]);

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;

      

      if (name === 'email') {
        setValidEmail(isEmailValid(value));
      }
      

      if (name === 'password') {

        setValidPassword(validatePassword(value));
      }

      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });


    };
  
    const handleNextStep = () => {
      setStep(step + 1);
    };

    const handlePrevStep = () => {
      setStep(step - 1)
    }

    const handleSubmit = () => {
      setLoading(true);
    

      const fullName = formData.fullName;
      const spaceIndex = fullName.indexOf(' ')

      let firstName, lastName;

      if (spaceIndex !== -1){
        firstName = fullName.substring(0 , spaceIndex);
        lastName = fullName.substring(spaceIndex + 1)
      }
      else{
        firstName = fullName;
        lastName = '';
      }
      Api.post("/register/", {
          "username": formData.username,
          "email": formData.email,
          "password": formData.password,
          "first_name": firstName,
          "last_name": lastName,
          "is_subscribed": formData.subscribe
        })
          .then((response) => {
            if (response.status === 201){
              SetChange(true)
              SetMyMessage(true);  
            }
        
          })
          .catch((error) => {
            console.error('Error during registration:', error.response);
              SetMyMessage({ error: 'An error occurred during registration. Please check the details and try again.' });
          
            
        }).finally(() => {
          setLoading(false);
        })

    };

    const handlelogin = () => {
      setLoading(true);
      Api.post("/login/",{
        "username":user,
        "password":password
      }).then((response) => {
      
        if (response.data.access_token !== null && response.status === 200){
          localStorage.setItem('Token',response.data.access_token);
          localStorage.setItem("first",response.data.first_name);
          localStorage.setItem("last",response.data.last_name)
          dispach(adminUser(true)); 
          history('/tasks');
        }}
      ).catch((error) => {
      
        dispach(adminUser(false)); 
        SetMyMessage({error:"The Username or password is incorrect!"})

      }).finally(() => {
        setLoading(false);
      }
      )
    }
  
    const formVariants = {
        hidden: { x: '-100%' }, 
        visible: { x: '0%' },  
      };
    
      const checkEmailAvailability = async (email) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/check_email/?email=${email}`);

          const data = await response.json();

          if (data.isAvailable) {
            setEmailAvailiblity(true)
          }
          else{
            setEmailAvailiblity(false)
          }
        } catch (error) {
          console.error('Error checking email availability:', error);
        }
      };
      const checkUserAvailability = async (username) => {
        try{
          const response = await fetch(`http://127.0.0.1:8000/check_user/?user=${username}`)
    
          const data = await response.json();
       
          if (data.isAvailable){
            setUsernameAvailibility(true)
          }
          else{
            setUsernameAvailibility(false)
          }
        }catch(error){
          console.error("Error checking user availability",error);
        }
      }
  return (
    <>
    <div className="container mx-auto relative">
    <div
        className={`transition-opacity duration-500 ${
          !change ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 h-full w-full object-cover z-0"
        >
          <source src="https://handloomss3bucket.s3.amazonaws.com/media/background.mp4" type="video/mp4" />
        </video>
        {change && (
          <div
            className="fixed inset-0 bg-black opacity-50 h-full w-full object-cover z-1"
            style={{ pointerEvents: 'none' }}
          ></div>
        )}
      </div>
    <div className='min-h-screen flex items-center justify-center z-10 relative'>


  <div className='w-full max-w-xl'>
  <div className='flex justify-end'>
    {change ? (
          <a href="#" className="flex items-center m-1 justify-center bg-red-500 text-white font-bold rounded-full p-4 w-40 h-12 md:mb-7 " onClick={() => SetChange(false)}>
          <BsFillArrowLeftCircleFill className='mr-2  hover:-translate-x-3 hover:scale-110 hover:duration-300' />
          Register
        </a>
    ) : (
        <a href="#" className="flex items-center m-1 justify-center bg-blue-500 text-white font-bold rounded-full p-4 w-40 h-12 md:mb-7 " onClick={() => SetChange(true)}>
            <BsFillArrowRightCircleFill className='mr-2  hover:-translate-x-3 hover:scale-110 hover:duration-300' />
        Login
        
      </a>
    )}

</div>
<div className="hidden md:block md:flex">
<motion.form
        initial="hidden" 
        animate={change ? 'visible' : 'hidden'} 
        variants={formVariants} 
        transition={{ duration: 0.5 }} 
        className="w-full max-w-md md:flex-col md:items-center"
      >
    {change ? (

           <>

                      <div className="mb-6">
              <label htmlFor="" className='block text-gray-500 font-bold mb-1 pr-4'>
              {MyMessage.success && (
  <p className="text-green-500">Register Sucess Now Login</p>
)}
              </label>
              <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor={uniqueId(`user`)}>
                User
              </label>
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id={uniqueId("User")} type="text" placeholder="username and email" onChange={(e) => SetUser(e.target.value)} />
            </div>
   
       
            <div className="mb-6">
              <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-password">
                Password
              </label>
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password-full" type="password" placeholder="******************" onChange={(e) => SetPassword(e.target.value)}/>
            </div>
            <div className="mb-6">
              <label className="block text-gray-500 font-bold">
                <span className="text-sm text-red-400 hover:text-red-500 hover:scale-110 hover:duration-300">
                  <a href="">Forget Password</a>
                  {MyMessage.error && (
              <p className="text-red-500">{MyMessage.error}</p>
              )}
                </span>
              </label>
             
            </div>
            <div>
            <button
      className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${loading ? 'bg-gray-500 cursor-not-allowed ' : 'bg-purple-500 hover:bg-purple-400'} text-white`}
      type="button"
      disabled={loading}
      onClick={handlelogin}
    >
      {loading ? 'Loading...' : 'Sign In'}
    </button>
            </div>
           </>
 
          
    ):(
        <>
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {step === 1 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-full-name">
              Full Name
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id={uniqueId("full-name")}
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-Email">
              Email
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id={uniqueId("email")}
              type="email"
              name="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {!validEmail && <p className="text-red-500">Invalid email format</p>}
            {EmailAvailiblity && (
           <p className='flex items-center text-red-500'>
           <AiFillCloseCircle className='mr-2' />
           <p>Email Already Available!</p>
         </p>
              )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-password">
              Password
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id={uniqueId("password")}
              type="password"
              name="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleInputChange}
            />
                      {!validPassword && (
                <p className='text-red-500'> Password must have 8 characters, 1 number, and 1 special
                character.</p>
              )}
            
          </div>

          <div className="mb-6">
        <label className="block text-gray-500 font-bold">
          <input
            className="mr-2 leading-tight"
            id={uniqueId("subscribe")}
            type="checkbox"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleInputChange}
          />
          <span className="text-sm">Send me your newsletter!</span>
        </label>
      </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor={uniqueId("Username")}>
              Username
            </label>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id={uniqueId("username")}
              type="text"
              name="username"
              placeholder="user123"
              value={formData.username}
              onChange={handleInputChange}
            />
            { UsernameAvailibility && (
                            <p className='flex items-center text-red-500'>
                            <AiFillCloseCircle className='mr-2' />
                            <p>Username Already Exits</p>
                          </p>
            )}

          </div>

          
        </>
      )}



      {step === 1 && (
        <button
        className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${!validPassword || !validEmail || EmailAvailiblity || !formData.fullName || !formData.email || !formData.password? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
          disabled={!validPassword || !validEmail || EmailAvailiblity || !formData.fullName || !formData.email || !formData.password}
          onClick={handleNextStep}
        >
          Next
        </button>
      )}

      {step === 2 && (
        <>
        <button
        className="text-blue-500 hover:text-purple-400 focus:outline-none mr-6"
        type="button"
        onClick={handlePrevStep}
      >
        Previous
      </button>
      <button
         className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${UsernameAvailibility || !formData.username ? 'opacity-50 cursor-not-allowed' : '' || loading ? 'bg-gray-500 cursor-not-allowed ' : 'bg-purple-500 hover:bg-purple-400'}`}
          type="button"
          disabled={loading || UsernameAvailibility || !formData.username}
          onClick={handleSubmit}
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>


{MyMessage.error && (
  <p className="text-red-500">{MyMessage.error}</p>
)}
        </>
      
      )}
    </div>


        </>

      
    )}

    </motion.form>
    
    
    {!change && (
            <div>

            <Lottie animationData={groovyWalkAnimation} loop={true} />
      
            </div>
    )}

    </div>

    <div className="m-2 md:hidden">
<form
        className="w-full max-w-xm md:flex-col md:items-center"
      >
            {!change && (
            <div>

            <Lottie animationData={groovyWalkAnimation} loop={true} />
      
            </div>
    )}
    {change ? (

<>

           <div className="mb-6">
   <label htmlFor="" className='block text-gray-500 font-bold mb-1 pr-4'>
   {MyMessage.success && (
<p className="text-green-500">Register Sucess Now Login</p>
)}
   </label>
   <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor={uniqueId(`user-mobile`)}>
     User
   </label>
   <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id={uniqueId("User-mobile")} type="text" placeholder="username and email" onChange={(e) => SetUser(e.target.value)} />
 </div>


 <div className="mb-6">
   <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-password-mobile">
     Password
   </label>
   <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password-mobile-input" type="password" placeholder="******************" onChange={(e) => SetPassword(e.target.value)}/>
 </div>
 <div className="mb-6">
   <label className="block text-gray-500 font-bold">
     <span className="text-sm text-red-400 hover:text-red-500 hover:scale-110 hover:duration-300">
       <a href="">Forget Password</a>
       {MyMessage.error && (
   <p className="text-red-500">{MyMessage.error}</p>
   )}
     </span>
   </label>
  
 </div>
 <div>
 <button       className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${
        loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-400'
      } text-white`} type="button" onClick={handlelogin}>
                {loading ? 'Loading...' : 'Sign In'}
              </button>
 </div>
</>


):(
<>
<div className="max-w-md mx-auto">
<h1 className="text-2xl font-bold mb-4">Sign Up</h1>
{step === 1 && (
<>
<div className="mb-6">
 <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-full-name-mobile">
   Full Name
 </label>
 <input
   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
   id={uniqueId("full-name-mobile")}
   type="text"
   name="fullName"
   placeholder="Jane Doe"
   value={formData.fullName}
   onChange={handleInputChange}
 />
</div>
<div className="mb-6">
 <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-Email-mobile">
   Email
 </label>
 <input
   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
   id={uniqueId("email-mobile")}
   type="email"
   name="email"
   placeholder="example@example.com"
   value={formData.email}
   onChange={handleInputChange}
 />
 {!validEmail && <p className="text-red-500">Invalid email format</p>}
 {EmailAvailiblity && (
<p className='flex items-center text-red-500'>
<AiFillCloseCircle className='mr-2' />
<p>Email Already Available!</p>
</p>
   )}
</div>
<div className="mb-6">
 <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor="inline-password-mobile">
   Password
 </label>
 <input
   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
   id={uniqueId("password")}
   type="password"
   name="password"
   placeholder="******************"
   value={formData.password}
   onChange={handleInputChange}
 />
           {!validPassword && (
     <p className='text-red-500'> Password must have 8 characters, 1 number, and 1 special
     character.</p>
   )}
 
</div>

<div className="mb-6">
<label className="block text-gray-500 font-bold">
<input
 className="mr-2 leading-tight"
 id={uniqueId("subscribe-mobile")}
 type="checkbox"
 name="subscribe"
 checked={formData.subscribe}
 onChange={handleInputChange}
/>
<span className="text-sm">Send me your newsletter!</span>
</label>
</div>
</>
)}

{step === 2 && (
<>
<div className="mb-6">
 <label className="block text-gray-500 font-bold mb-1 pr-4" htmlFor={uniqueId("Username-mobile")}>
   Username
 </label>
 <input
   className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
   id={uniqueId("username")}
   type="text"
   name="username"
   placeholder="user123"
   value={formData.username}
   onChange={handleInputChange}
 />
 { UsernameAvailibility && (
                 <p className='flex items-center text-red-500'>
                 <AiFillCloseCircle className='mr-2' />
                 <p>Username Already Exits</p>
               </p>
 )}

</div>


</>
)}



{step === 1 && (
<button
className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${!validPassword || !validEmail || EmailAvailiblity || !formData.fullName || !formData.email || !formData.password? 'opacity-50 cursor-not-allowed' : ''}`}
type="button"
disabled={!validPassword || !validEmail || EmailAvailiblity || !formData.fullName || !formData.email || !formData.password}
onClick={handleNextStep}
>
Next
</button>
)}

{step === 2 && (
<>
<button
className="text-blue-500 hover:text-purple-400 focus:outline-none mr-6"
type="button"
onClick={handlePrevStep}
>
Previous
</button>
<button
className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${ UsernameAvailibility || !formData.username? 'opacity-50 cursor-not-allowed' : ''}`}
type="button"
disabled={ UsernameAvailibility || !formData.username}
onClick={handleSubmit}
>
Sign Up
</button>


{MyMessage.error && (
<p className="text-red-500">{MyMessage.error}</p>
)}
</>

)}
</div>


</>


)}
         
    </form>
    </div>
  </div>
</div>
    </div>

    </>
  )
}

export default Home