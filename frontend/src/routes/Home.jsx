import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Datepicker, Dropdown } from 'flowbite-react';
import ProgressCard from '../components/ProgressCard';
import CreateTaskDialog from '../components/CreateTaskDialog';

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teams, setTeam] = useState(null)

    const navigate = useNavigate();
    const userToken = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // getting user details
        axios.get('http://localhost:3000/api/user/user', {
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

        axios.get(`http://localhost:3000/api/team/all-team`, {
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
    const [tasks, setTasks] = useState(null);


    useEffect(() => {
        console.log("user: ", user);
        console.log("teams: ", teams);
    })

    useEffect(() => {
        console.log("Current Team: ", currentTeam);
    }, [currentTeam]);

    function p0() {
        console.log("P0");
    }
    function p1() {
        console.log("P1");
    }
    function p2() {
        console.log("P2");
    }

    return (
        <div className='gradient bg-gradient-to-r from-'>
            <Navbar user={user} />
            <div className='h-5/6  p-12 pt-0 '>
                <div className='h-full w-full border-4 border-white rounded-xl p-6'>
                    <div className='flex justify-between '>
                        <div className='flex gap-4 font-semibold items-center'>
                            <p className='text-lg'>Filter By:</p>
                            <input type="text" placeholder='Assignee Name' className='border-none px-2 w-32 rounded p-1' />
                            <span className='bg-white py-1 px-4 rounded'>
                                <Dropdown label="Priority" inline>
                                    <Dropdown.Item>P0</Dropdown.Item>
                                    <Dropdown.Item>P1</Dropdown.Item>
                                    <Dropdown.Item>P2</Dropdown.Item>
                                </Dropdown>
                            </span>

                            <Datepicker></Datepicker>
                            to
                            <Datepicker></Datepicker>
                        </div>
                        <button className='text-white bg-blue-700/60 px-5 rounded'>Add New Task</button>
                        <CreateTaskDialog team={currentTeam}/>
                    </div>
                    <div className='flex gap-4 font-semibold items-center mt-4'>
                        <p className='text-lg pr-2'>Team:</p>
                        <span className='bg-white py-1 px-4 rounded'>
                            <Dropdown label={currentTeam.name} inline>
                                {teams && teams.map((team, index) => {
                                    return <Dropdown.Item key={index}>{team.name}</Dropdown.Item>
                                })}
                            </Dropdown>
                        </span>

                    </div>
                    <ProgressCard status={"status"} />
                </div>
            </div>
        </div>
    )
}

function Navbar({ user }) {
    return (
        <div className='flex justify-between items-center  h-1/6 px-14'>
            <div className='font-bold text-xl'>Task Board</div>
            <div className='flex items-center gap-4'>
                <div className='font-semibold'>
                    {user.firstname} {user.lastname}
                </div>
                <div className='bg-black text-white py-1 px-2 rounded-md'>Logout</div>
            </div>
        </div>
    )
}

export default Home