import { CategoryForm } from "./CategoryForm";
import { FormModal } from "./FormModal";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <CategoryForm onSubmit={onSubmit} onCancel={onClose} />
    </FormModal>
  );
}
