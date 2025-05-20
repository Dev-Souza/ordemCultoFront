import Swal from "sweetalert2";

// Alerta de confirmação com retorno
export function confirmarExclusao() {
  return Swal.fire({
    title: "Tem certeza?",
    text: "Essa ação não pode ser desfeita.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar"
  });
}

// Alerta de sucesso
export function sucessoExclusao(msg = "Item", acao = "excluído") {
  return Swal.fire({
    title: `${msg} ${acao} com sucesso!`,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
}

// Alerta de erro
export function erroExclusao() {
  return Swal.fire({
    title: "Erro!",
    text: "Erro ao excluir culto.",
    icon: "error",
    confirmButtonText: "OK",
  });
}