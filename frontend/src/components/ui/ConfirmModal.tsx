import Button from "./Button";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirm",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="bg-paper-raised border border-rule w-full max-w-sm p-7">
        <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>
        <p className="font-sans text-sm text-ink/60 mb-6">{description}</p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-stamp hover:bg-stamp-deep flex-1"
          >
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}