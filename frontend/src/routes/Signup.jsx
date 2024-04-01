import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import Loading from '../components/Loading';
import { BACKEND_URL } from '../config';

function Signup() {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoad] = useState(false);

    const navigate = useNavigate()

    const signUp = async () => {
        setLoad(true);
        await axios.post(`${BACKEND_URL}/api/user/signup`, {
            firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1),
            lastname: lastname.charAt(0).toUpperCase() + lastname.slice(1),
            username: email,
            password: password
        })
            .then((response) => {
                if (response.status == 200) {
                    localStorage.setItem("user", JSON.stringify(`Bearer ${response.data.token}`));
                    console.log("redirecting...... to dashborad.");
                    navigate('/home');
                }else{
                    alert(response.data.message);
                    setLoad(false);
                }
            })
            .catch((err) => {
                setLoad(false);
                alert("error: " + err.response.data.message);
                console.log(err);
            })
        // await axios.get('http://localhost:3000/');
    }

    return (
        <>
            <div className='h-screen gradient flex items-center justify-center '>
                <div className='shadow-2xl h-4/5 min-h-[633px] sm:w-4/5 min-w-80 max-w-md rounded-xl bg-white flex items-center justify-around flex-col  absolute z-0'>
                    <div className='font-bold text-5xl drop-shadow-3xl mt-4' >Sign Up</div>
                    <div className='w-5/6'>
                        <div className='text-xl text-center text-gray-500 ' >Enter your information to create an account</div>
                    </div>
                    <div className='w-4/5 flex flex-col gap-1'>
                        <div className='text-xl font-semibold mt-2'>First Name</div>
                        <input type="text" onChange={e => setFirstName(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='Naruto' />
                        <div className='text-xl font-semibold mt-2'>Last Name</div>
                        <input type="text" onChange={e => setLastName(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='Uzumaki' />
                        <div className='text-xl font-semibold mt-2'>Email</div>
                        <input type="text" onChange={e => setEmail(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='leafvillage@example.com' />
                        <div className='text-xl font-semibold mt-2'>Password</div>
                        <input type="password" onChange={e => setPassword(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl mb-2' placeholder='' />
                        {/* <button onClick={signUp} className='border-2 rounded-md w-full p-2 text-xl bg-black text-white mt-2'>Sign up</button> */}
                        <Button label='Sign Up' onClick={signUp} />
                    </div>
                    <div className='font-semibold mb-2'>Already have an account? <a href="/signin" className='text-blue-500 underline'>Sign In</a></div>
                </div>
                {loading&& <Loading label={"Signing up..."} />}
            </div>
        </>
    )
}


export default Signup