import React from "react";
import { Modal } from "../vibes";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      {children}
    </Modal>
  );
}
