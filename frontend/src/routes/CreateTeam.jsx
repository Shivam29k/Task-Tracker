import React from 'react'
import Loading from '../components/Loading'
import { Button } from '../components/Button'
import axios from 'axios'

function CreateTeam() {
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [teamId, setteamId] = React.useState('');

  const userToken = JSON.parse(localStorage.getItem('user'));

  const createTeam = async () => {
    setLoading(true);
    // await axios.post('http://localhost:3000/api/v1/user/signin', {
    await axios.post('http://localhost:3000/api/team/create', {
      name: name,
      teamId: teamId
    }, {
      headers: {
        Authorization: userToken
      }
    })
      .then((response) => {
        if (response.status == 200) {
          // localStorage.setItem("user", JSON.stringify(`Bearer ${response.data.token}`));
          // navigate('/home');
          console.log("Team created successfully");
          setLoading(false);
        } else {
          setLoading(false);
          alert(response.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response.data.message);
        alert("error: " + err.response.data.message); 
        console.log(err);
      })
  }

  return (
    <div className='gradient'>
      <div className='h-screen  flex items-center justify-center  gradient'>
        <div className='shadow-2xl h-4/6 min-h-[450px] sm:w-4/5 min-w-80 max-w-md rounded-xl bg-white flex items-center justify-around flex-col absolute z-0'>
          <div className='font-bold text-5xl drop-shadow-3xl mt-4' >Create Team</div>
          <div className='w-5/6'>
            <div className='text-xl text-center text-gray-500 ' >Give a name and a unique ID to your team.</div>
          </div>
          <div className='w-4/5 flex flex-col gap-1.5'>
            <div className='text-xl font-semibold mt-2'>Team Name</div>
            <input type="text" onChange={e => setName(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='RCB' />
            <div className='text-xl font-semibold mt-2'>Team Id</div>
            <input  onChange={e => setteamId(e.target.value)} className='border-2 rounded-md w-full p-2 text-xl' placeholder='rcbwillwin' />
            <p className='italic text-xs text-red-400 mb-4'>Team id can be any text without any space which will be used to uniquely identify your Team</p>
            {/* <button onClick={signIn} className='border-2 rounded-md w-full p-2 text-xl bg-black text-white mt-2'>Sign In</button> */}
            <Button label='Create Team' onClick={createTeam} />
          </div>
          <div className='font-semibold mb-2'>Want to join a team? <a href="/signup" className='text-blue-500 underline'>Join a team</a></div>
        </div>
        {loading && <Loading label={"Creating Team..."} />}
      </div>
    </div>
  )
}

export default CreateTeam