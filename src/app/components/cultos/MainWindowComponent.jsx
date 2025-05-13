'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../../services/ordemCulto";
import Spinners from "../../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Container, Modal } from "react-bootstrap";

export default function MainWindowComponent() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true); //Loading
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null); //Token
    const [modal, setModal] = useState(false); //Modal
    const [cultoSelecionado, setCultoSelecionado] = useState(false) //state de culto buscado

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

    async function verDetalhes(id) {
        try {
            const cultoBuscado = await ordemCulto.get(`culto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Enviando o token no cabeçalho
                }
            });
            console.log(cultoBuscado.data)
            setModal(true) //Abrir modal
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Sessão expirada, por favor faça login novamente.");
                router.push("/login");
            } else {
                setError(error);
                alert("Erro ao buscar culto.");
            }
        } finally {
            setLoading(false); // Marca como carregado
        }
    }

    //Função de fechar modal
    const handleClose = () => setModal(false);

    if (loading) {
        return <Spinners />; // Chamando o component
    }

    return (
        <Container>
            <h1>Cultos</h1>
            <ul>
                {cultos.map(culto => (
                    <React.Fragment key={culto.id}>
                        <li>{culto.tituloCulto}</li>
                        <Link href={`cultos/forms/${culto.id}`}>Editar</Link>
                        <button onClick={() => deletarCulto(culto.id)}>Deletar</button>
                        <button onClick={() => verDetalhes(culto.id)}>Ver Detalhes</button>
                        
                        {/* Modal de ver detalhes de culto */}
                        <Modal show={modal} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {cultoSelecionado.tituloCulto}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h4>Centered Modal</h4>
                                <p>
                                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                                    consectetur ac, vestibulum at eros.
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={handleClose}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </React.Fragment>
                ))}
            </ul>
            <Link href={"cultos/forms"} className="btn btn-success">Criar Culto</Link>
        </Container>
    )
}