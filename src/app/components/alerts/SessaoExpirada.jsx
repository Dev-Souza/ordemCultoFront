import Swal from "sweetalert2";

export default function SessaoExpirida() {
    return Swal.fire({
        icon: "error",
        title: "Sessão expirada!",
        text: "Por favor, faça login novamente.",
    });
}
