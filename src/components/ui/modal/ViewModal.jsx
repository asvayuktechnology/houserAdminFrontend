import Modal from "./Modal";
import Button from "../Button";

function ViewModal({
    open,
    title,
    children,
    onClose,
    maxWidth = "max-w-3xl",
}) {
    return (
        <Modal open={open} onClose={onClose} maxWidth={maxWidth}>
            <div className="space-y-5">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>

                {children}

                <div className="flex justify-end pt-4 border-t border-[#2A3052]">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ViewModal;