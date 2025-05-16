'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../../services/ordemCulto";
import Spinners from "../../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaExclamationTriangle  } from 'react-icons/fa';

export default function MainWindowComponent() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true); //Loading
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null); //Token
    const [modal, setModal] = useState(false); //Modal de visualização
    const [modalAvisos, setModalAvisos] = useState(false)
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

    async function verDetalhesAvisos(id) {
        try {
            const cultoBuscado = await ordemCulto.get(`culto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Enviando o token no cabeçalho
                }
            });
            setModalAvisos(true) //Abrir modal Avisos
            setCultoSelecionado(cultoBuscado.data.avisos)
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

    //Função de fechar modalAvisos
    const handleCloseAvisos = () => setModalAvisos(false);

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
                            <Card className="mb-3">
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
                                <Card.Body>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link href={`cultos/forms/${culto.id}`} className="btn btn-primary d-flex align-items-center justify-content-center text-center col-12 col-sm-6 col-md-auto">
                                            Editar <FaEdit className="ms-2" />
                                        </Link>
                                        <Button variant="danger" onClick={() => deletarCulto(culto.id)} className="d-flex align-items-center justify-content-center text-center col-12 col-sm-6 col-md-auto">
                                            Deletar <FaTrash className="ms-2" />
                                        </Button>
                                        <Button variant="info" onClick={() => verDetalhes(culto.id)} className="d-flex align-items-center justify-content-center text-center col-12 col-sm-6 col-md-auto">
                                            Visualizar <FaEye className="ms-2" />
                                        </Button>
                                        <Button variant="warning" onClick={() => verDetalhesAvisos(culto.id)} className="d-flex align-items-center justify-content-center text-center col-12 col-sm-6 col-md-auto">
                                            Avisos <FaExclamationTriangle className="ms-2"/>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>


            {/* Modal de ver detalhes de culto */}
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {cultoSelecionado.tituloCulto} - {new Date(cultoSelecionado.dataCulto).toLocaleDateString('pt-BR')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Oportunidades</h3>
                    {Array.isArray(cultoSelecionado.oportunidades) ? (
                        cultoSelecionado.oportunidades.map((oportunidades, index) => (
                            <ListGroup className="list-group-flush" key={index}>
                                <ListGroup.Item>
                                    <b>Nome: </b> {oportunidades.nomePessoa} | 
                                    <b> Momento: </b> 
                                    {oportunidades.momento == 'LOUVOR_OFERTA' && (
                                        <span>Louvor da oferta</span>
                                    )}
                                    {oportunidades.momento == 'LOUVOR' && (
                                        <span>Louvor</span>
                                    )}
                                    {oportunidades.momento == 'SAUDACAO' && (
                                        <span>Saudação</span>
                                    )}
                                    {oportunidades.momento == 'TESTEMUNHO' && (
                                        <span>Testemunho</span>
                                    )}
                                    <br /> <hr />
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    ) : cultoSelecionado.oportunidades ? (
                        <ListGroup className="list-group-flush" key={index}>
                            <ListGroup.Item>
                                    <b>Nome: </b> {oportunidades.nomePessoa} | 
                                    <b> Momento: </b> 
                                    {oportunidades.momento == 'LOUVOR_OFERTA' && (
                                        <span>Louvor da oferta</span>
                                    )}
                                    {oportunidades.momento == 'LOUVOR' && (
                                        <span>Louvor</span>
                                    )}
                                    {oportunidades.momento == 'SAUDACAO' && (
                                        <span>Saudação</span>
                                    )}
                                    {oportunidades.momento == 'TESTEMUNHO' && (
                                        <span>Testemunho</span>
                                    )}
                                    <br /> <hr />
                                </ListGroup.Item>
                        </ListGroup>
                    ) : (
                        <p>Nenhum aviso disponível.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} className="btn btn-danger">Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de ver detalhes dos avisos */}
            <Modal show={modalAvisos} onHide={handleCloseAvisos}>
                <Modal.Header closeButton>
                    <Modal.Title>Avisos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(cultoSelecionado) ? (
                        cultoSelecionado.map((avisos, index) => (
                            <ListGroup className="list-group-flush" key={index}>
                                <ListGroup.Item>
                                    <b>Data:</b> {avisos.diasEvento?.map((dia, i) => <span key={i}>{dia} </span>)} <br />
                                    <b>{avisos.nomeAviso}</b> <br />
                                    <b>Horário:</b> {avisos.horarioEvento}
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    ) : cultoSelecionado ? (
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>
                                <b>Data:</b> {cultoSelecionado.diasEvento?.map((dia, i) => <span key={i}>{dia} </span>)} <br />
                                <b>{cultoSelecionado.nomeAviso}</b> <br />
                                <b>Horário:</b> {cultoSelecionado.horarioEvento}
                            </ListGroup.Item>
                        </ListGroup>
                    ) : (
                        <p>Nenhum aviso disponível.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseAvisos} className="btn btn-danger">Fechar</Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}