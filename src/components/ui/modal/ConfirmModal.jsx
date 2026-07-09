import Modal from "./Modal";
import Button from "../Button";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    loading,
    confirmText = "Delete",
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="sm"
            title={title}
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button variant="danger"
                        onClick={onConfirm}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </Button>
                </div>
            }
        >
            <p className="text-gray-400">
                {description}
            </p>
        </Modal>
    );
}