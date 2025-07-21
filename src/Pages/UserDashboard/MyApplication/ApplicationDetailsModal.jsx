// components/shared/Modal.jsx
import React, { useEffect, useRef } from "react";

const ApplicationDetailsModal = ({ isOpen, onClose, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={ref} id="modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>
  );
};

export default ApplicationDetailsModal;
