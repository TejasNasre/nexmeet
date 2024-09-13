import React from "react";
import { motion } from "framer-motion";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const ConfirmationDialog = ({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) => {
  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-md w-full max-w-md">
        <p className="text-black text-center">{message}</p>
        <div className="flex justify-center mt-4">
          <button className= "bg-green-500 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg mr-2 md:mr-4" onClick={onConfirm}>Confirm</button>
          <button className="bg-red-500 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;