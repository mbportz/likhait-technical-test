import { Category, ExpenseFormData } from "../types";
import { ExpenseForm } from "./ExpenseForm";
import { FormModal } from "./FormModal";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  categories,
  onSubmit,
}: AddExpenseModalProps) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <ExpenseForm
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </FormModal>
  );
}
