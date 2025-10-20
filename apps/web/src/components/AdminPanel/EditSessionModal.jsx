import { Modal } from "./Modal";
import { SessionForm } from "./SessionForm";

export function EditSessionModal({ 
  isOpen, 
  onClose, 
  session, 
  onSessionChange, 
  onSubmit, 
  submitting 
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !session.name ||
      !session.date ||
      !session.startTime ||
      !session.endTime ||
      !session.arriveByTime
    ) {
      return;
    }
    const success = await onSubmit(session);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Session">
      <SessionForm
        session={session}
        onChange={onSessionChange}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={submitting}
        isEdit={true}
      />
    </Modal>
  );
}
