import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import Loading from '../components/Loading';
import { BACKEND_URL } from '../config';

function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoad] = useState(false);

  const navigate = useNavigate();

  const signIn = async () => {
    setLoad(true);
    await axios.post(`${BACKEND_URL}/api/user/signin`, {
      username: email,
      password: password
    })
      .then((response) => {
        if (response.status == 200) {
          localStorage.setItem("user", JSON.stringify(`Bearer ${response.data.token}`));
          console.log("redirecting...... to dashborad.");
          navigate('/home');
        } else {
          setLoad(false);
          alert(response.data.message);
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err.response.data.message);
        alert("error: " + err.response.data.message);
        console.log(err);
      })
  }

  return (
    <>
      <div className='h-screen  flex items-center justify-center  gradient'>
        <div className='shadow-2xl h-4/6 min-h-[450px] sm:w-4/5 min-w-80 max-w-md rounded-xl bg-white flex items-center justify-around flex-col absolute z-0'>
          <div className='font-bold text-5xl drop-shadow-3xl mt-4' >Sign In</div>
          <div className='w-5/6'>
            <div className='text-xl text-center text-gray-500 ' >Enter your credentials to access your account</div>
          </div>
          <div className='w-4/5 flex flex-col gap-1.5'>
            <div className='text-xl font-semibold mt-2'>Email</div>
            <input type="text" onChange={e => setEmail(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='leafvillage@example.com' />
            <div className='text-xl font-semibold mt-2'>Password</div>
            <input type="password" onChange={e => setPassword(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl mb-6' placeholder='' />
            <Button label='Sign In' onClick={signIn} />
          </div>
          <div className='font-semibold mb-2'>Dont have an account? <a href="/signup" className='text-blue-500 underline'>Sign Up</a></div>
        </div>
        {loading && <Loading label={"Signing in..."} />}
      </div>
    </>
  )
}


export default Signin