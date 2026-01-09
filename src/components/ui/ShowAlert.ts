import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getThemeColors } from "../../theme/themeColors";

export async function ShowAlert(
    title: string,
    text: string,
    icon: any,
    options?: {
        confirmColor?: string;
        allowOutsideClick?: boolean;
        allowEscapeKey?: boolean;
        showConfirmButton?: boolean;
    }
) {
    const { primary } = getThemeColors();
    const {
        confirmColor = primary,
        allowOutsideClick = false,
        allowEscapeKey = false,
        showConfirmButton = true,
    } = options || {};

    return withReactContent(Swal).fire({
        title,
        text,
        icon,
        confirmButtonColor: confirmColor,
        allowOutsideClick,
        allowEscapeKey,
        showConfirmButton,
        background: getThemeColors().paper,
        color: getThemeColors().text,
    });
}

export async function ShowConfirm(
  title: string,
  text: string,
    icon: any, // "warning" | "info" | "error" | "question" | "success"
    options?: {
        confirmButtonText?: string;
        cancelButtonText?: string;
        confirmColor?: string;
        cancelColor?: string;
        allowOutsideClick?: boolean;
        allowEscapeKey?: boolean;
    }
) {
    const { primary, textSecondary } = getThemeColors();
    const {
        confirmButtonText = "Confirm",
        cancelButtonText = "Cancel",
        confirmColor = primary,
        cancelColor = textSecondary,
        allowOutsideClick = false,
        allowEscapeKey = true,
    } = options || {};

  const result = await withReactContent(Swal).fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
    focusCancel: true,
    allowOutsideClick,
    allowEscapeKey,
    background: getThemeColors().paper,
    color: getThemeColors().text,
  });

  return !!result.isConfirmed;
}

export function alertClose() {
    return Swal.close();
}

// Pre-configured alert types using theme colors
export const Alert = {
  success: (title: string, text: string, options?: any) => 
    ShowAlert(title, text, "success", { 
      confirmColor: getThemeColors().success, 
      ...options 
    }),
  
  error: (title: string, text: string, options?: any) => 
    ShowAlert(title, text, "error", { 
      confirmColor: getThemeColors().error, 
      ...options 
    }),
  
  warning: (title: string, text: string, options?: any) => 
    ShowAlert(title, text, "warning", { 
      confirmColor: getThemeColors().warning, 
      ...options 
    }),
  
  info: (title: string, text: string, options?: any) => 
    ShowAlert(title, text, "info", { 
      confirmColor: getThemeColors().info, 
      ...options 
    }),
};

// Pre-configured confirm types
export const Confirm = {
  delete: (title: string, text: string, options?: any) => 
    ShowConfirm(title, text, "warning", { 
      confirmButtonText: "Delete",
      confirmColor: getThemeColors().error,
      cancelColor: getThemeColors().textSecondary,
      ...options 
    }),
  
  logout: (title: string, text: string, options?: any) => 
    ShowConfirm(title, text, "question", { 
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmColor: getThemeColors().warning,
      cancelColor: getThemeColors().textSecondary,
      ...options 
    }),
  
  save: (title: string, text: string, options?: any) => 
    ShowConfirm(title, text, "info", { 
      confirmButtonText: "Save",
      cancelButtonText: "Discard",
      confirmColor: getThemeColors().primary,
      cancelColor: getThemeColors().textSecondary,
      ...options 
    }),
};