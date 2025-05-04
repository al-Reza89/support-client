import { toast as toastify } from "react-toastify";

export const toast = ({ title, description, variant }) => {
  toastify(`${title}: ${description}`, {
    type: variant === "destructive" ? "error" : "success",
  });
};
