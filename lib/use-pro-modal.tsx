/*This code allows you to manage the state of a modal component in your application. 
You can use the useProModal hook to access the isOpen state and the onOpen and onClose 
methods to control the modal's visibility. */

import { create } from 'zustand';

interface useProModalStore {
    isOpen: boolean; //represents whether the modal is currently open or closed
    onOpen: () => void; //method is used to open the modal and takes no arguments and return nothing
    onClose: () => void; //method is used to close the modal and is also void
}

export const useProModal = create<useProModalStore>((set) => ({
    isOpen: false, //modal is initially close
    onOpen: () => set({ isOpen: true }), //function that set IsOpen to true effectively opening the modal
    onClose: () => set({ isOpen: false }), //function that sets isOpen to false effectively closing the modal
}));