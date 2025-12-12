import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickEditFieldProps {
  value: string | number | null | undefined;
  displayValue?: string;
  onSave: (value: string) => Promise<void>;
  type?: "text" | "number" | "textarea";
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const QuickEditField = ({
  value,
  displayValue,
  onSave,
  type = "text",
  placeholder,
  prefix,
  suffix,
  className
}: QuickEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {type === "textarea" ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="font-body text-sm min-h-[80px]"
            autoFocus
          />
        ) : (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="font-body text-sm h-8"
            autoFocus
          />
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
        >
          <Check size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={saving}
          className="h-8 w-8 p-0"
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("group flex items-center gap-2", className)}>
      <span className="font-body">
        {prefix}{displayValue || value || "Not specified"}{suffix}
      </span>
      <button
        onClick={handleEdit}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-blue-heath/10"
        aria-label="Edit"
      >
        <Pencil size={14} className="text-blue-heath" />
      </button>
    </div>
  );
};

export default QuickEditField;
