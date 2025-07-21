import { useEffect, useRef } from "react";

const ApplicationDetailsModal = ({ application, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (application && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [application]);

  if (!application) return null;

  return (
    <dialog ref={modalRef} id="application_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">{application.universityName}</h3>
        <p><strong>Address:</strong> {application.address || "N/A"}</p>
        <p><strong>Subject:</strong> {application.subjectCategory}</p>
        <p><strong>Degree:</strong> {application.degree}</p>
        <p><strong>Fees:</strong> ৳{application.amountPaid}</p>
        <p><strong>Feedback:</strong> {application.feedback || "N/A"}</p>
        <p><strong>Status:</strong> {application.status || "pending"}</p>
        <p><strong>Phone:</strong> {application.phone}</p>
        <p><strong>SSC Result:</strong> {application.ssc}</p>
        <p><strong>HSC Result:</strong> {application.hsc}</p>
        <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleString()}</p>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ApplicationDetailsModal;
