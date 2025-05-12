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

    const router = useRouter();

    useEffect(() => {
        // Pegando o token do localStorage
        const authToken = localStorage.getItem('authToken');
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
                    </React.Fragment>
                ))}
            </ul>
            <Link href={"cultos/forms"} className="btn btn-success">Criar Culto</Link>
        </div>
    );
}