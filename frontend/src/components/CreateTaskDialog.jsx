import React, { useEffect } from 'react'
import { useState } from 'react';

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import axios from 'axios';
import { BACKEND_URL } from '../config';

function CreateTaskDialog({ team, members }) {

    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [assignee, setAssignee] = useState(members[0]);
    const [priority, setPriority] = useState("P0");

    function onCloseModal() {
        setOpenModal(false);
    }

    // useEffect(() => {
    //     console.log(priority);
    // }, [priority])

    // useEffect(() => {
    //     console.log(assignee);
    // }, [assignee])

    // useEffect(() => {
    //     console.log(description);
    // }, [description])

    // useEffect(() => {
    //     console.log(title);
    // } , [title])

    function addTask() {
        // add task to the database
        axios.post(`${BACKEND_URL}/api/task/create`, {
            title: title,
            description: description,
            assigneeId: assignee._id,
            priority: priority,
            teamId: team._id
        }, {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('user'))
            }
        }).then((response) => {
            console.log(response.data);
            onCloseModal();
        }).catch((err) => {
            console.log("Error: ", err);
        })
    }

    return (
        <>
            <Button className='text-white bg-blue-700/60 px-5 rounded' onClick={() => setOpenModal(true)}>Add New Task</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white pb-4">Add a new task</h3>

                        <div>
                            <div className="mb-2 block">
                                <Label value="Title" />
                            </div>
                            <TextInput
                                placeholder=""
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label value="Description" />
                            </div>
                            <textarea 
                                onChange={(e) => setDescription(e.target.value)} 
                                className='w-full h-24 border-gray-300 rounded' 
                                name="" 
                                id="" 
                                cols="30" 
                                rows="10"
                            >
                            </textarea>                        </div>

                        <div className='flex items-center justify-between'>
                            <Label value="Team" className='w-fit' />
                            <div className='border w-fit rounded-md py-1 px-2 bg-blue-gray-100/50' >{team.name}</div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <Label value="Assigne" className='w-fit' />
                            <select
                                className='w-1/2 border-none rounded-md py-1 px-2 bg-blue-gray-100/50'
                                value={assignee ? assignee._id : ''}
                                onChange={(e) => {
                                    const selectedMember = members.find(member => member._id === e.target.value);
                                    setAssignee(selectedMember);
                                }}
                            >
                                {members.map((member) => {
                                    return <option value={member._id} key={member._id}>{member.firstname} {member.lastname}</option>
                                })}
                            </select>
                        </div>

                        <div className='flex items-center justify-between'>
                            <Label value="Priority" className='w-fit' />
                            <select
                                className='w-1/2 border-none rounded-md py-1 px-2 bg-blue-gray-100/50'
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="P0">P0</option>
                                <option value="P1">P1</option>
                                <option value="P2">P2</option>
                            </select>
                        </div>


                        <div className="w-full">
                            <Button onClick={addTask} >Add task</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateTaskDialog