import React from 'react'
import { useState } from 'react';

import { Button, Checkbox, Label, Modal, TextInput, Dropdown } from "flowbite-react";


function CreateTaskDialog({ team }) {

    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState('');

    function onCloseModal() {
        setOpenModal(false);
        setEmail('');
    }

    return (
        <>
            <Button className='text-white bg-blue-700/60 px-5 rounded' onClick={() => setOpenModal(true)}>Add New Task</Button>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white pb-6">Add a new task</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label value="Title" />
                            </div>
                            <TextInput
                                placeholder=""
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label value="Description" />
                            </div>
                            {/* <TextInput required /> */}
                            <textarea className='w-full h-24 border-gray-300 rounded' name="" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div className='flex items-center justify-between'>
                            <Label value="Team" className='w-fit' />
                            <div className='border w-fit rounded-md py-1 px-2 bg-blue-gray-100/50' >{team.name}</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <Label value="Assigne" className='w-fit' />
                            <div className='border w-fit rounded-md py-1 px-2 bg-blue-gray-100/50' >
                                <Dropdown className='' label="Assign task" inline>
                                    <Dropdown.Item>P0</Dropdown.Item>
                                    <Dropdown.Item>P1</Dropdown.Item>
                                    <Dropdown.Item>P2</Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>


                        <div className="w-full">
                            <Button>Add task</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateTaskDialog