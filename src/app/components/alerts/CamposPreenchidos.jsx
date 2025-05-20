import Swal from "sweetalert2";

export default function preencherCampos() {
    return Swal.fire({
        icon: "error",
        title: "Falta de informação!",
        text: "Todos os campos precisam ser preenchidos."
    });
}