import { toast } from "sonner";

interface InfoToastProps {
  message: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
}

export const showInfoToast = ({
  message,
  position = "bottom-right",
}: InfoToastProps) => {
  toast.info(message, {
    style: {
      background: "#1a1a1a",
      color: "#ffffff",
      border: "1px solid #333333",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    icon: "🔔",
    duration: 3000,
    position,
  });
};
