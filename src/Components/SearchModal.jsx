import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
  const elRef = useRef(null);

  // Create a div element for the modal if it doesn't already exist
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    // Append the modal to the modal root
    const modalRoot = document.getElementById("modal-root");
    modalRoot.appendChild(elRef.current);

    // Clean up by removing the modal from the DOM when unmounting
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    elRef.current
  );
};

export default Modal;
