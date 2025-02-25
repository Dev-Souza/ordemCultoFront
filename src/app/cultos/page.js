'use client';

import { useState, useEffect } from "react";
import ordemCulto from "../services/ordemCulto";
import Spinners from "../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Pegando o token do localStorage
    const authToken = localStorage.getItem('authToken');
    const router = useRouter();

    async function carregarCultos() {
        try {
            const resposta = await ordemCulto.get('culto', {
                headers: {
                    'Authorization': `Bearer ${authToken}`  // Enviando o token no cabeçalho
                }
            });
            setCultos(resposta.data); // Carrega os cultos
            setLoading(false); // Marca como carregado
        } catch (error) {
            setError(error);
            alert(`Sessão expirada, por favor faça login novamente.`);
            router.push("/login");  // Redireciona para a página de login
        }
    }

    useEffect(() => {
        carregarCultos();
    }, []);

    if (loading) {
        return <Spinners />; // Chamando o component
    }

    if (error) {
        return <p>Erro ao carregar cultos: {error}</p>; // Exibindo mensagem de erro
    }

    return (
        <div>
            <h1>Cultos</h1>
            <ul>
                {cultos.map(culto => (
                    <li key={culto.id}>{culto.tituloCulto}</li> // Exibe o nome do culto
                ))}
            </ul>
            <Link href={"cultos/forms"} className="btn btn-success">Criar Culto</Link>
        </div>
    );
}