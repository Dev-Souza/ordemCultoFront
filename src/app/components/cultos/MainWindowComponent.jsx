'use client';

import React, { useState, useEffect } from "react";
import ordemCulto from "../../services/ordemCulto";
import Spinners from "../../components/Spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Col, Container, Dropdown, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { FaFilterCircleXmark } from "react-icons/fa6";
import Pagination from 'react-bootstrap/Pagination';
import SessaoExpirida from "../alerts/SessaoExpirada";
import { confirmarExclusao, erroExclusao, sucessoExclusao } from "../alerts/Exclusao";
import erroCulto from "../alerts/ErroCulto";
import preencherCampos from "../alerts/CamposPreenchidos";
import erroData from "../alerts/ErroData";

export default function MainWindowComponent() {
    const [cultos, setCultos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    // States da modal
    const [modal, setModal] = useState(false);
    const [modalAvisos, setModalAvisos] = useState(false);
    const [cultoSelecionado, setCultoSelecionado] = useState(false);

    // States da pagination
    const [pagina, setPagina] = useState(0);
    const [itens, setItens] = useState(3);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // States de filtro
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFim, setDataFim] = useState('');

    const router = useRouter();

    //Function padrão para verificar sessão
    function verificaSessaoExpirada(error) {
        if (error?.response && (error.response.status === 401 || error.response.status === 403)) {
            SessaoExpirida().then(() => {
                router.push("/login");
            });
            return true;
        }
        return false;
    }


    //Chamando as principais functions 
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setToken(authToken);

        async function countCultos() {
            try {
                const resposta = await ordemCulto.get(`culto/qtd`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setTotalPaginas(Math.ceil(resposta.data.quantidade / itens));
            } catch (error) {
                if (verificaSessaoExpirada(error)) return;
                setError(error);
            }
        }

        async function carregarCultos() {
            try {
                setLoading(true);
                const resposta = await ordemCulto.get('culto', {
                    params: { pagina, itens },
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setCultos(resposta.data);
            } catch (error) {
                if (verificaSessaoExpirada(error)) return;
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        countCultos();
        carregarCultos();
    }, [pagina]);

    // deletando um culto
    async function deletarCulto(id) {
        try {
            const confirmacao = await confirmarExclusao();
            if (!confirmacao.isConfirmed) return;

            await ordemCulto.delete(`culto/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Exibe alerta de sucesso e após fechar, recarrega a página
            sucessoExclusao("Culto", "excluído").then(() => {
                window.location.reload();
            });

        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
            erroExclusao();
        }
    }

    // Ver detalhes
    async function verDetalhes(id) {
        try {
            const resposta = await ordemCulto.get(`culto/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setModal(true);
            setCultoSelecionado(resposta.data);
        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
            erroCulto();
        }
    }

    // ver detalhes de avisos
    async function verDetalhesAvisos(id) {
        try {
            const resposta = await ordemCulto.get(`culto/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setModalAvisos(true);
            setCultoSelecionado(resposta.data.avisos);
        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
            erroCulto()
        }
    }


    // Setando a página da pagination
    function pagination(pag) {
        setPagina(pag);
    }

    // FIltro de buscar por titulo
    async function buscarPorTitulo(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const resposta = await ordemCulto.get("culto/filtroTitulo", {
                params: { titulo: filtroTitulo },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCultos(resposta.data);
            setFiltroTitulo('');
        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
            erroCulto()
        } finally {
            setLoading(false);
        }
    }

    // Remover filtro
    async function removerFiltro(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const resposta = await ordemCulto.get('culto', {
                params: { pagina, itens },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCultos(resposta.data);
        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    // Filtro de buscar por data
    async function buscarPorData(e) {
        e.preventDefault();
        if (!dataInicial || !dataFim) return preencherCampos();
        if (dataInicial > dataFim) return erroData();

        try {
            const resposta = await ordemCulto.post('/culto/filtroData',
                { dataInicial, dataFinal: dataFim },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setCultos(resposta.data);
            setDataInicial('');
            setDataFim('');
        } catch (error) {
            if (verificaSessaoExpirada(error)) return;
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    // Fechando as modais
    const handleClose = () => setModal(false);
    const handleCloseAvisos = () => setModalAvisos(false);

    if (loading) return <Spinners />;

    return (
        <section className="bg-body-tertiary min-vh-100" style={{ paddingTop: '100px' }}>
            <Container>
                <h1 className="text-center">Cultos</h1>
                <Form onSubmit={buscarPorTitulo}>
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center mb-3">
                        <Form.Group controlId="filtroTitulo" className="mb-0 flex-grow-1" style={{ minWidth: 0 }}>
                            <Form.Control
                                required
                                name="filtroTitulo"
                                type="text"
                                placeholder="Busque por título de culto"
                                value={filtroTitulo}
                                onChange={(e) => setFiltroTitulo(e.target.value)}
                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            />
                        </Form.Group>
                        <div className="d-flex">
                            <Button
                                type="submit"
                                variant="primary"
                                style={{
                                    minWidth: '56px',
                                    height: '38px',
                                    borderRadius: 0,
                                    borderTopRightRadius: '0.375rem',
                                }}
                            >
                                <FaSearch />
                            </Button>
                            <Button
                                onClick={removerFiltro}
                                variant="danger"
                                style={{
                                    minWidth: '56px',
                                    height: '38px',
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderTopRightRadius: '0.375rem',
                                    marginLeft: '1px',
                                }}
                            >
                                <FaTimes />
                            </Button>
                        </div>
                    </div>
                </Form>
                <Row className="mb-3">
                    <Col className="d-flex justify-content-end">
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="d-flex align-items-center gap-2">
                                <FaFilter />
                                Filtros
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="p-3" style={{ minWidth: '300px' }}>
                                <Form onSubmit={buscarPorData}>
                                    <Form.Group controlId="dataInicial" className="mb-3">
                                        <Form.Label>Data Inicial</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={dataInicial}
                                            onChange={(e) => setDataInicial(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="dataFim" className="mb-3">
                                        <Form.Label>Data Final</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={dataFim}
                                            onChange={(e) => setDataFim(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="w-100">
                                        Buscar
                                    </Button>
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Botão de limpar filtro */}
                        <Button
                            className="btn btn-danger d-flex align-items-center gap-2"
                            onClick={removerFiltro}
                        >
                            <FaFilterCircleXmark />
                        </Button>
                    </Col>
                </Row>
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
                                    {culto.tipoCulto === 'QUINTA_PROFETICA' && (
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
                                        <ListGroup.Item><b>Preleitor: </b>{culto.preleitor}</ListGroup.Item>
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
                    <Button onClick={handleClose} className="btn btn-danger">Fechar</Button>
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