import Swal from "sweetalert2";

export default function erroCulto() {
    return Swal.fire({
        icon: "error",
        title: "Erro ao buscar culto!",
        text: "Aconteceu algum erro ao buscar culto.",
    });
}