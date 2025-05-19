'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../../services/ordemCulto";
import Spinners from "../../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaExclamationTriangle, FaSearch, FaTimes } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';

export default function MainWindowComponent() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true); //Loading
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null); //Token

    // States das modals
    const [modal, setModal] = useState(false); //Modal de visualização
    const [modalAvisos, setModalAvisos] = useState(false)
    const [cultoSelecionado, setCultoSelecionado] = useState(false) //state de culto buscado

    // States da paginação
    const [pagina, setPagina] = useState(0)
    const [itens, setItens] = useState(3) //Total itens que será exibida em cada page
    const [totalPaginas, setTotalPaginas] = useState(1); //Total de páginas que deverão ter

    // States de filtragem
    const [filtroTitulo, setFiltroTitulo] = useState('');

    const router = useRouter();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setToken(authToken);

        async function countCultos() {
            try {
                const resposta = await ordemCulto.get(`culto/qtd`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Enviando o token no cabeçalho
                    }
                });
                setTotalPaginas(Math.ceil(resposta.data.quantidade / itens)); //Sempre arredonda um pra cima
            } catch (error) {
                setError(error);
                alert(`Sessão expirada, por favor faça login novamente.`);
                router.push("/login");
            }
        }

        countCultos()

        async function carregarCultos() {
            try {
                setLoading(true)
                const resposta = await ordemCulto.get('culto', {
                    params: {
                        pagina,
                        itens
                    },
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setCultos(resposta.data);
            } catch (error) {
                setError(error);
                alert(`Sessão expirada, por favor faça login novamente.`);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        carregarCultos();
    }, [pagina, token]);

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
        }
    }

    // Setando a pagina
    async function pagination(pag) {
        setPagina(pag)
    }

    async function buscarPorTitulo(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await ordemCulto.get("culto/filtroTitulo", {
                params: { titulo: filtroTitulo }, // Aqui vão os parâmetros de busca
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCultos(response.data); // Aqui você acessa os dados retornados
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Sessão expirada, por favor faça login novamente.");
                router.push("/login");
            } else {
                setError(error);
                alert("Erro ao buscar culto.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function removerFiltroTitulo() {
        try {
            setLoading(true)
            const resposta = await ordemCulto.get('culto', {
                params: {
                    pagina,
                    itens
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCultos(resposta.data);
            setFiltroTitulo('')
        } catch (error) {
            setError(error);
            alert(`Sessão expirada, por favor faça login novamente.`);
            router.push("/login");
        } finally {
            setLoading(false);
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
        <section className="bg-body-tertiary" style={{ paddingTop: '100px' }}>
            <Container>
                <h1 className="text-center">Cultos</h1>
                <Form onSubmit={buscarPorTitulo}>
                    <Row className="mb-3 justify-content-center align-items-center">
                        <Col md={6}>
                            <Form.Group controlId="filtroTitulo" className="mb-0">
                                <Form.Control
                                    required
                                    name="filtroTitulo"
                                    type="text"
                                    placeholder="Busque por título de culto"
                                    value={filtroTitulo}
                                    onChange={(e) => setFiltroTitulo(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="auto" className="d-flex gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                style={{ minWidth: '56px', height: '38px' }}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <FaSearch />
                            </Button>
                            <Button
                                onClick={removerFiltroTitulo}
                                variant="danger"
                                style={{ minWidth: '56px', height: '38px' }}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <FaTimes />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    {cultos.length === 0 ? (
                        <Col>
                            <div className="text-center my-5">
                                <h5>Nenhum culto encontrado.</h5>
                            </div>
                        </Col>
                    ) : (
                        cultos.map(culto => (
                            <Col key={culto.id} md={4}>
                                <Card className="mb-3">
                                    {culto.tipoCulto === 'QUINTA_RESTAURACAO' && (
                                        <Card.Img variant="top" src="/images/quintaFeira.png" style={{ width: '100%', height: '300px' }} />
                                    )}
                                    {culto.tipoCulto === 'DOMINGO_EM_FAMILIA' && (
                                        <Card.Img variant="top" src="/images/domingo.jpg" />
                                    )}
                                    {culto.tipoCulto === 'SABADOU' && (
                                        <Card.Img variant="top" src="holder.js/100px180" />
                                    )}
                                    {culto.tipoCulto === 'EVENTO' && (
                                        <Card.Img variant="top" src="holder.js/100px180" />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{culto.tituloCulto}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <b>Data:</b> {new Date(culto.dataCulto).toLocaleDateString('pt-BR')}
                                        </Card.Subtitle>
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
                                                Avisos <FaExclamationTriangle className="ms-2" />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => pagina > 0 && pagination(pagina - 1)}
                            disabled={pagina === 0}
                        />
                        {[...Array(totalPaginas).keys()]
                            .filter(i => {
                                const start = Math.max(0, pagina - 2);
                                const end = Math.min(totalPaginas, start + 5);
                                return i >= start && i < end;
                            })
                            .map(i => (
                                <Pagination.Item
                                    key={i}
                                    active={i === pagina}
                                    onClick={() => pagination(i)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        <Pagination.Next
                            onClick={() => pagina < totalPaginas - 1 && pagination(pagina + 1)}
                            disabled={pagina === totalPaginas - 1}
                        />
                    </Pagination>
                </div>
            </Container>
            {/* Modal de ver detalhes de culto */}
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {cultoSelecionado.tituloCulto} - {new Date(cultoSelecionado.dataCulto).toLocaleDateString('pt-BR')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Lista de avisos */}
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
                        // Se não for um array
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
                    {/* Lista de intercessores */}
                    <h3>Intercessão</h3>
                    {Array.isArray(cultoSelecionado.equipeIntercessao) ? (
                        cultoSelecionado.equipeIntercessao.map((intercessor, index) => (
                            <ListGroup className="list-group-flush" key={index}>
                                <ListGroup.Item>
                                    <b>Nome: </b> {intercessor.nomeObreiro} |
                                    <b> Cargo: </b>
                                    {intercessor.cargo == 'OBREIRO' && (
                                        <span>Obreiro</span>
                                    )}
                                    {intercessor.cargo == 'OBREIRA' && (
                                        <span>Obreira</span>
                                    )}
                                    {intercessor.cargo == 'VOLUNTARIO' && (
                                        <span>Voluntário</span>
                                    )}
                                    {intercessor.cargo == 'VOLUNTARIA' && (
                                        <span>Voluntária</span>
                                    )}
                                    {intercessor.cargo == 'DIACONO' && (
                                        <span>Diácono</span>
                                    )}
                                    {intercessor.cargo == 'DIACONISA' && (
                                        <span>Diaconisa</span>
                                    )}
                                    {intercessor.cargo == 'PRESBITERO' && (
                                        <span>Presbítero</span>
                                    )}
                                    {intercessor.cargo == 'EVANGELISTA' && (
                                        <span>Evangelista</span>
                                    )}
                                    {intercessor.cargo == 'PASTOR' && (
                                        <span>Pastor</span>
                                    )}
                                    {intercessor.cargo == 'PASTORA' && (
                                        <span>Pastora</span>
                                    )}
                                    <br /> <hr />
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                        // Se não for um array
                    ) : cultoSelecionado.equipeIntercessao ? (
                        <ListGroup className="list-group-flush" key={index}>
                            <ListGroup.Item>
                                <b>Nome: </b> {cultoSelecionado.equipeIntercessao.nomeObreiro} |
                                <b> Cargo: </b>
                                {cultoSelecionado.equipeIntercessao.cargo == 'OBREIRO' && (
                                    <span>Obreiro</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'OBREIRA' && (
                                    <span>Obreira</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'VOLUNTARIO' && (
                                    <span>Voluntário</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'VOLUNTARIA' && (
                                    <span>Voluntária</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'DIACONO' && (
                                    <span>Diácono</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'DIACONISA' && (
                                    <span>Diaconisa</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'PRESBITERO' && (
                                    <span>Presbítero</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'EVANGELISTA' && (
                                    <span>Evangelista</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'PASTOR' && (
                                    <span>Pastor</span>
                                )}
                                {cultoSelecionado.equipeIntercessao.cargo == 'PASTORA' && (
                                    <span>Pastora</span>
                                )}
                                <br /> <hr />
                            </ListGroup.Item>
                        </ListGroup>
                    ) : (
                        <p>Nenhum intercessor escalado.</p>
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
                                    <b>Data: </b>
                                    {/* Formatando as multiplas datas */}
                                    {(Array.isArray(avisos.diasEvento) ? avisos.diasEvento : [avisos.diasEvento])
                                        .map((dia, i) => {
                                            const data = new Date(dia);
                                            return (
                                                <span key={i}>
                                                    {data.toLocaleDateString("pt-BR")}
                                                    {i < (Array.isArray(avisos.diasEvento) ? avisos.diasEvento.length : 1) - 1 ? ", " : ""}
                                                </span>
                                            );
                                        })}<br />
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