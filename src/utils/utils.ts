import Swal from "sweetalert2";

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return seconds + "s atrás";
  } else if (minutes < 60) {
    return minutes + "m atrás";
  } else if (hours < 24) {
    return hours + "h atrás";
  } else if (days === 1) {
    return "1 dia atrás";
  } else {
    return days + " dias atrás";
  }
}


export const checkTokenExpiration = (token: string | null): boolean => {
  let jwt = require('jsonwebtoken');
  if (!token) {
    return true;
  }
  try {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return true;
  }
};

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});