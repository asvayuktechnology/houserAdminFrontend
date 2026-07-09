import Button from "../Button";
import Modal from "./Modal";

export default function FormModal({
    open,
    title,
    children,
    loading,
    onClose,
    onSubmit,
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="xl"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary"
                        className="bg-[#232A47]"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button variant="primary"
                        onClick={onSubmit}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            }
        >
            <div className="space-y-3">

            {children}
            </div>
        </Modal>
    );
}