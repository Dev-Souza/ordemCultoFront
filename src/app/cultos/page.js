'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../services/ordemCulto";
import Spinners from "../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    const router = useRouter();

    useEffect(() => {
        // Pegando o token do localStorage
        const authToken = localStorage.getItem('authToken');
        setToken(authToken)

        async function carregarCultos() {
            try {
                const resposta = await ordemCulto.get('culto', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Enviando o token no cabeçalho
                    }
                });
                setCultos(resposta.data || []); // Carrega os cultos
            } catch (error) {
                setError(error);
                alert(`Sessão expirada, por favor faça login novamente.`);
                router.push("/login");  // Redireciona para a página de login
            } finally {
                setLoading(false); // Marca como carregado
            }
        }
        carregarCultos();
    }, []);

    async function deletarCulto(id) {
        try {
            if (!confirm('Deseja realmente excluir?')) return;
            const resposta = await ordemCulto.delete(`culto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Enviando o token no cabeçalho
                }
            });
            alert('Culto excluído com sucesso!')
            router.push("/cultos")
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Sessão expirada, por favor faça login novamente.");
                router.push("/login");
            } else {
                setError(error);
                alert("Erro ao excluir culto.");
            }
        } finally {
            setLoading(false); // Marca como carregado
        }
    }

    if (loading) {
        return <Spinners />; // Chamando o component
    }

    return (
        <div>
            <h1>Cultos</h1>
            <ul>
                {cultos.map(culto => (
                    <React.Fragment key={culto.id}>
                        <li>{culto.tituloCulto}</li>
                        <Link href={`cultos/forms/${culto.id}`}>Editar</Link>
                        <button onClick={() => deletarCulto(culto.id)}>Deletar</button>
                    </React.Fragment>
                ))}
            </ul>
            <Link href={"cultos/forms"} className="btn btn-success">Criar Culto</Link>
        </div>
    );
}