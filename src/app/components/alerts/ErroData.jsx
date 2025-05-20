import Swal from "sweetalert2";

export default function erroData() {
    return Swal.fire({
        icon: "error",
        title: "Datas inválidas!",
        text: "A data final precisa ser maior que a inicial.",
    });
}