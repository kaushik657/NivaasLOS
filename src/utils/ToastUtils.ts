// src/utils/toastUtils.ts
import Toast from "react-native-toast-message";

export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    position: "top",
  });
};

export const showErrorToast = (title: string, message?: string) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    position: "top",
  });
};

export const showInfoToast = (title: string, message?: string) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    position: "bottom",
  });
};
