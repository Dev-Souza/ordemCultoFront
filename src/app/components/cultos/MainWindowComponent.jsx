'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../../services/ordemCulto";
import Spinners from "../../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

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
            setCultoSelecionado(cultoBuscado.data)
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
        <section className="bg-body-tertiary" style={{ height: '100dvh', paddingTop: '100px' }}>
            <Container>
                <h1 className="text-center">Cultos</h1>
                <Row>
                    {cultos.map(culto => (
                        <Col key={culto.id} md={4}>
                            {/* Estrutura da page principal */}
                            <Card>
                                {culto.tipoCulto == 'QUINTA_RESTAURACAO' && (
                                    <Card.Img variant="top" src="/images/quintaFeira.png" style={{ width: '100%', height: '300px' }} />
                                )}
                                {culto.tipoCulto == 'DOMINGO_EM_FAMILIA' && (
                                    <Card.Img variant="top" src="/images/domingo.jpg" />
                                )}
                                {culto.tipoCulto == 'SABADOU' && (
                                    <Card.Img variant="top" src="holder.js/100px180" />
                                )}
                                {culto.tipoCulto == 'EVENTO' && (
                                    <Card.Img variant="top" src="holder.js/100px180" />
                                )}
                                <Card.Body>
                                    <Card.Title>{culto.tituloCulto}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"><b>Data:</b> {new Date(culto.dataCulto).toLocaleDateString('pt-BR')}</Card.Subtitle>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item><b>Dirigente:</b> {culto.dirigente}</ListGroup.Item>
                                    <ListGroup.Item><b>Hora de Prosperar:</b> {culto.horaProsperar}</ListGroup.Item>
                                </ListGroup>
                                <Card.Body className="d-flex gap-2">
                                    <Link href={`cultos/forms/${culto.id}`} className="btn btn-primary d-flex align-items-center">
                                        Editar <FaEdit className="ms-2" />
                                    </Link>
                                    <Button variant="danger" onClick={() => deletarCulto(culto.id)} className="d-flex align-items-center">
                                        Deletar <FaTrash className="ms-2" />
                                    </Button>
                                    <Button variant="info" onClick={() => verDetalhes(culto.id)} className="d-flex align-items-center">
                                        Visualizar <FaEye className="ms-2" />
                                    </Button>
                                </Card.Body>
                            </Card>

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
                                    <Button onClick={handleClose} className="btn btn-danger">Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-end fixed-bottom p-2 p-sm-2 p-md-2 p-lg-3 p-xl-4">
                    <Link href={"cultos/forms"} className="btn btn-success btn-md">
                        Criar Culto <FaPlus />
                    </Link>
                </div>
            </Container>
        </section>
    )
}