"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTicketForm } from "./CreateTicketForm";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Submit a new support ticket and we&apos;ll get back to you as soon
            as possible.
          </DialogDescription>
        </DialogHeader>
        <CreateTicketForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
