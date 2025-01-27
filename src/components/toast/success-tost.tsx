import { toast } from "sonner";

interface SuccessToastProps {
  message: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  duration?: number;
}

export const showSuccessToast = ({
  message,
  position = "bottom-right",
  duration = 3000,
}: SuccessToastProps) => {
  toast.success(message, {
    style: {
      background: "#1a1a1a",
      color: "#ffffff",
      border: "1px solid #333333",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    icon: "✅",
    duration,
    position,
  });
};
