"use client";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
}

export function DeleteButton({ action, label = "刪除" }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("確定要刪除嗎？此動作無法復原。")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  );
}
