import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function Teams() {
    const naviagate = useNavigate();
    function createTeam() {
        naviagate('/teams/create');
        console.log("Create Team");
    }
    function joinTeam() {
        naviagate('/teams/join');
        console.log("Join Team");
    }

    return (
        <div className='gradient flex flex-col md:flex-row '>
            <div className='w-full md:h-full  text-center bg-black/30 backdrop-blur-sm'>
                Teams 
            </div>
            <div className='w-full md:h-full my-5 flex justify-center items-center'>
                <div className='bg-white/80 backdrop-blur-sm w-3/5 shadow-2xl p-8 rounded-xl  '>
                    <div className='font-bold text-xl'>
                        <div>
                            <div>Create Or Join Teams</div>
                            <div>and track your workflow seamlessly.</div>
                        </div>
                        <div className='font-medium text-sm pt-4 max-w-64'>
                            Task manager lets you be a part of a team
                            and stay upto date with the progress.
                            Either Create or Join a team
                        </div>


                        <div className='pt-6 flex justify justify-between'>
                            <Button onClick={createTeam} label={"Create Team"} />
                            <Button onClick={joinTeam} label={" Join Team "} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}



export default Teams;