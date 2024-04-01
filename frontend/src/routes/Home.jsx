import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading, { LoadingDiv } from '../components/Loading';
import { Datepicker, Dropdown } from 'flowbite-react';
import ProgressCard from '../components/ProgressCard';
import CreateTaskDialog from '../components/CreateTaskDialog';
import { Button } from '@material-tailwind/react';

import { RiAccountCircleFill } from "react-icons/ri";
import { BACKEND_URL } from '../config';

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teams, setTeam] = useState(null)

    const navigate = useNavigate();
    const userToken = JSON.parse(localStorage.getItem('user'));
    if (!userToken) {
        navigate('/signin');
    }

    useEffect(() => {
        // getting user details
        axios.get(`${BACKEND_URL}/api/user/user`, {
            headers: {
                Authorization: userToken
            }
        }).then((response) => {
            (response.data.user.team.length === 0) && navigate('/teams');
            // console.log(response.data.user);
            setUser(response.data.user);
            setLoading(false);
        }).catch((err) => {
            console.log("Error: ", err);
            setLoading(false);
        })

        //  gettting all teams

        axios.get(`${BACKEND_URL}/api/team/all-team`, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('user'))
            }
        }).then((response) => {
            setTeam(response.data.teams);
            // setCurrentTeam(response.data.teams[0]);
        }).catch((err) => {
            console.log("Error: ", err);
        })

    }, [])
    return (
        <div>
            {/* {loading && <Loading label={"Loading..."} />} */}
            {(user && teams) ? <Taskboard user={user} teams={teams} /> : <Loading label={"Loading..."} />}
        </div>
    )
}

function Taskboard({ user, teams }) {

    const [currentTeam, setCurrentTeam] = useState(teams[0]);
    const [members, setMembers] = useState(null);

    useEffect(() => {
        console.log("user: ", user);
        console.log("teams: ", teams);
    })

    useEffect(() => {
        console.log("Current Team: ", currentTeam);
    }, [currentTeam]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/user/all-team?teamId=${currentTeam._id}`, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('user'))
            }
        }).then((response) => {
            console.log(response.data.users);
            setMembers(response.data.users);
        }).catch((err) => {
            console.log("Error: ", err);
        })
    }, [currentTeam])

    return (
        <div className='gradient bg-gradient-to-r from-'>
            <Navbar user={user} />
            <div className='h-5/6  p-12 pt-0 '>
                <div className='h-full w-full border-4 border-white rounded-xl p-6'>
                    <FirstRow currentTeam={currentTeam} members={members} />
                    <SecondRow teams={teams} />
                    {currentTeam && <TaskSection currentTeam={currentTeam} />}
                </div>
            </div>
        </div>
    )
}

function Navbar({ user }) {
    function logout() {
        localStorage.removeItem('user');
        window.location.href = '/signin';
    }
    return (
        <div className='flex justify-between items-center  h-1/6 px-14'>
            <div className='font-bold text-3xl'>Task Board</div>
            <div className='flex items-center gap-4'>
                <div className='font-semibold text-2xl'>
                    {user.firstname} {user.lastname}
                </div>
                <RiAccountCircleFill className='h-14 w-16' />
                <Button onClick={logout} className='hover:bg-black bg-black/70 text-white  rounded-md'>Logout</Button>
            </div>
        </div>
    )
}

function FirstRow({ currentTeam, members }) {
    return (
        <div className='flex justify-between '>
            <div className='flex gap-4 font-semibold items-center'>
                <p className='text-lg'>Filter By:</p>
                <input type="text" placeholder='Assignee Name' className='border-none px-2 w-32 rounded p-2' />

                <select name="priority" id="priority" className='border-none rounded-lg'>
                    <option value="P0">P0</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                </select>


                <Datepicker></Datepicker>
                to
                <Datepicker></Datepicker>
            </div>
            {(members && currentTeam) && <CreateTaskDialog team={currentTeam} members={members} />}
        </div>
    )
}

function SecondRow({teams, setCurrentTeam}) {
    return (
        <div className='flex gap-4 font-semibold items-center mt-4'>
            <p className='text-lg pr-5'>Team:</p>
            <select
                onChange={(e) => {
                    const selectedTeam = teams.find(team => team._id === e.target.value);
                    setCurrentTeam(selectedTeam);
                }}
                name="team"
                id="team"
                className='border-none rounded-lg shadow-none'>
                {teams && teams.map((team, index) => {
                    return <option value={team._id} key={index}>{team.name}</option>
                })}
            </select>
        </div>
    )
}


function TaskSection({ currentTeam }) {
    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/task/all-team`, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('user'))
            },
            data: {
                teamId: currentTeam._id
            }
        }).then((response) => {
            console.log(response.data.tasks);
            setTasks(response.data.tasks);
            setLoading(false);
        }).catch((err) => {
            console.log("Error: ", err);
        })
    }, [currentTeam])

    return (
        <div className='h-5/6 mt-4'>
            {loading && <LoadingDiv label={"Loading..."} />}
            <div className='grid grid-cols-4 gap-4 mt-4'>
                {tasks && tasks.map((task, index) => {
                    return <ProgressCard key={index} task={task} />
                })}
            </div>
        </div>
    )
}

export default Home