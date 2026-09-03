import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { shiftFormSchema, type ShiftFormData } from "../../lib/schemas";
import { useCreateShift, useEmployees } from "../../hooks/useShifts";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface ShiftFormModalProps {
  onClose: () => void;
  defaultDate?: string;
}

export default function ShiftFormModal({ onClose, defaultDate }: ShiftFormModalProps) {
  const { data: employees } = useEmployees();
  const createShift = useCreateShift();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      employeeId: "",
      date: defaultDate ?? "",
      startTime: "",
      endTime: "",
    },
  });

  async function onSubmit(data: ShiftFormData) {
    const startTime = new Date(`${data.date}T${data.startTime}`).toISOString();
    const endTime = new Date(`${data.date}T${data.endTime}`).toISOString();

    await createShift.mutateAsync({
      employeeId: data.employeeId ? Number(data.employeeId) : undefined,
      date: data.date,
      startTime,
      endTime,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="bg-paper-raised border border-rule w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-ink">New shift</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink/50 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start time"
              type="time"
              error={errors.startTime?.message}
              {...register("startTime")}
            />
            <Input
              label="End time"
              type="time"
              error={errors.endTime?.message}
              {...register("endTime")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-sm text-ink/70">Assign to</label>
            <select
              {...register("employeeId")}
              className="font-sans text-base text-ink bg-transparent border-0 border-b border-rule py-2 focus:outline-none focus:border-stamp transition-colors"
            >
              <option value="">Unassigned</option>
              {employees?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {createShift.isError && (
            <p className="font-sans text-sm text-stamp-deep" role="alert">
              {createShift.error instanceof Error ? createShift.error.message : "Something went wrong"}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <Button type="submit" isLoading={isSubmitting} className="bg-stamp hover:bg-stamp-deep flex-1">
              Create shift
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}