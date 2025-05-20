// utils/successAlert.js
import Swal from "sweetalert2";

export function showSuccess(msg, acao) {
  Swal.fire({
    title: `${msg} ${acao} com sucesso!`,
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}