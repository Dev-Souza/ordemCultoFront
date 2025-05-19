'use client'

import DatePickerField from "@/app/components/DatePickerField";
import HeaderComponent from "@/app/components/cultos/HeaderComponent";
import PaginaErro from "@/app/components/PaginaErro";
import Spinners from "@/app/components/Spinners";
import ordemCulto from "@/app/services/ordemCulto";
import { Field, FieldArray, Formik } from "formik";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";
import { Button, Container, Form, ProgressBar, Row, Col, Card, ListGroup, Badge, Alert } from "react-bootstrap";
import { FaCheck, FaAngleLeft, FaAngleRight, FaArrowLeft, FaUsers, FaClock, FaUser, FaMusic, FaSmile, FaHeart, FaTrash, FaPlusCircle, FaCalendarAlt, FaUserTie, FaBullhorn, FaInfoCircle, FaCalendarCheck, FaCalendarDay, FaBell, FaChurch, FaHeading, FaListAlt } from "react-icons/fa";
import { FaHandsPraying } from "react-icons/fa6";


export default function Page() {
    const [loading, setLoading] = useState(false); //pagina carregando
    const [error, setError] = useState(null); //login
    const [step, setStep] = useState(1); //próximo form
    const [cultoBuscado, setCultoBuscado] = useState(null); //Culto que for buscado
    const authToken = localStorage.getItem('authToken');
    const router = useRouter();
    const { id } = useParams() // pega o ID da URL

    //Próximo
    const handleNext = () => {
        setStep(step + 1);
    };

    //Anterior
    const handlePrevious = () => {
        setStep(step - 1);
    };

    async function cadastrarCulto(values) {
        setLoading(true);
        // Regra para fazer o update em culto
        if (id) {
            try {
                const cultoAlterado = await ordemCulto.put(`/culto/${id}`, values, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                console.log(cultoAlterado) //ATENÇÃO, tenta jogar isso no alert
                alert('Culto alterado com sucesso!')
                router.push("/cultos")
            } catch (error) {
                console.log(error)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("Sessão expirada, por favor faça login novamente.");
                    router.push("/login");
                } else {
                    setError(error);
                    console.error(error);
                    router.push(<PaginaErro />)
                }
            } finally {
                setLoading(false); //Marcar como carregado
            }
            // Fim da regra de update
            // Regra para cadastrar culto caso não venha nenhum ID
        } else {
            try {
                const resposta = await ordemCulto.post('/culto', values, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(resposta) //ATENÇÃO, tenta jogar isso no alert
                alert('Culto cadastrado com sucesso!')
                router.push("/cultos")
            } catch (error) {
                console.log(error)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("Sessão expirada, por favor faça login novamente.");
                    router.push("/login");
                } else {
                    setError(error);
                    console.error(error);
                    router.push(<PaginaErro />)
                }
            } finally {
                setLoading(false);
            }
        }
        // Fim da regra de create
    }

    // Função de verificar se aquele culto realmente existe
    useEffect(() => {
        if (id) {
            async function buscarCulto() {
                setLoading(true);
                try {
                    // Buscando Culto
                    const response = await ordemCulto.get(`/culto/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setCultoBuscado(response.data);
                    setLoading(false);
                } catch (error) {
                    setError(error);
                    alert("Culto não encontrado!")
                    router.push('/cultos')
                    console.error("Culto não encontrado:", error);
                }
            }

            buscarCulto();
        }
    }, [id]);

    const culto = {
        tituloCulto: '',
        tipoCulto: 'EVENTO',
        dataCulto: '',
        dirigente: '',
        horaProsperar: '',
        oportunidades: [{
            nomePessoa: '',
            momentoOportunidade: '',
            cultoId: ''
        }],
        equipeIntercessao: [{
            nomeObreiro: '',
            cargoEquipeIntercessao: '',
            cultoId: ''
        }],
        avisos: [{
            nomeAviso: '',
            referente: '',
            horarioEvento: '',
            diasEvento: [],
            cultoId: ''
        }]
    };

    if (loading) {
        return <Spinners />;
    }

    return (
        <>
            <HeaderComponent caminho="cultos" />
            <section className="bg-body-tertiary min-vh-100" style={{ paddingTop: '100px' }}>
                <Container>
                    <Formik
                        initialValues={cultoBuscado || culto}
                        // validationSchema={}
                        onSubmit={values => cadastrarCulto(values)}
                    >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            errors,
                        }) => {

                            return (
                                <Form className="">
                                    {step === 1 && (
                                        <Container className="py-4">
                                            <Row className="justify-content-center mb-5">
                                                <Col lg={10} xl={8}>
                                                    <Card className="border-0 shadow-sm">
                                                        <Card.Body className="p-4">
                                                            <div className="text-center mb-4">
                                                                <h2 className="fw-bold text-primary mb-3">
                                                                    <FaChurch className="me-2" />
                                                                    Informações do Culto
                                                                </h2>
                                                            </div>

                                                            {/* Título do culto */}
                                                            <Form.Group className="mb-4" controlId="tituloCulto">
                                                                <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                    <FaHeading className="me-2" size={12} />
                                                                    Título do Culto
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Digite o título do Culto"
                                                                    name="tituloCulto"
                                                                    value={values.tituloCulto}
                                                                    onChange={handleChange('tituloCulto')}
                                                                    isInvalid={errors.tituloCulto}
                                                                    className="py-2"
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.tituloCulto}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>

                                                            {/* Tipo do culto */}
                                                            <Form.Group className="mb-4" controlId="tipoCulto">
                                                                <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                    <FaListAlt className="me-2" size={12} />
                                                                    Tipo do Culto
                                                                </Form.Label>
                                                                <Form.Select
                                                                    aria-label="Tipo do Culto"
                                                                    name="tipoCulto"
                                                                    value={values.tipoCulto || ''}
                                                                    onChange={handleChange('tipoCulto')}
                                                                    isInvalid={!!errors.tipoCulto}
                                                                    className="py-2"
                                                                >
                                                                    <option value={''}>Selecione o tipo de culto...</option>
                                                                    <option value={'QUINTA_RESTAURACAO'}>Quinta Restauração</option>
                                                                    <option value={'DOMINGO_EM_FAMILIA'}>Domingo em Família</option>
                                                                    <option value={'SABADOU'}>Sabadou</option>
                                                                    <option value={'EVENTO'}>Evento</option>
                                                                </Form.Select>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.tipoCulto}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>

                                                            {/* Data do Culto */}
                                                            <Form.Group className="mb-4" controlId="dataCulto">
                                                                <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                    <FaCalendarAlt className="me-2" size={12} />
                                                                    Data do Culto
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    name="dataCulto"
                                                                    value={values.dataCulto}
                                                                    onChange={handleChange('dataCulto')}
                                                                    isInvalid={!!errors.dataCulto}
                                                                    className="py-2"
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.dataCulto}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>

                                                            {/* Dirigente */}
                                                            <Form.Group className="mb-4" controlId="dirigente">
                                                                <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                    <FaUserTie className="me-2" size={12} />
                                                                    Dirigente
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Digite o nome do dirigente"
                                                                    name="dirigente"
                                                                    value={values.dirigente}
                                                                    onChange={handleChange('dirigente')}
                                                                    isInvalid={errors.dirigente}
                                                                    className="py-2"
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.dirigente}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>

                                                            {/* Hora de Prosperar */}
                                                            <Form.Group className="mb-4" controlId="horaProsperar">
                                                                <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                    <FaClock className="me-2" size={12} />
                                                                    Hora de Prosperar
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Digite quem vai ter essa oportunidade"
                                                                    name="horaProsperar"
                                                                    value={values.horaProsperar}
                                                                    onChange={handleChange('horaProsperar')}
                                                                    isInvalid={errors.horaProsperar}
                                                                    className="py-2"
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.horaProsperar}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Container>
                                    )}
                                    {/* Oportunidades */}
                                    {step === 2 && (
                                        <Container className="py-4">
                                            <Row className="justify-content-center mb-5">
                                                <Col lg={10} xl={8}>
                                                    <Card className="border-0 shadow-sm">
                                                        <Card.Body className="p-4">
                                                            <div className="text-center mb-4">
                                                                <h2 className="fw-bold text-primary mb-3">
                                                                    <FaUsers className="me-2" />
                                                                    Oportunidades no Culto
                                                                </h2>
                                                            </div>

                                                            <FieldArray name="oportunidades">
                                                                {({ remove, push }) => (
                                                                    <>
                                                                        {values.oportunidades.length > 0 ? (
                                                                            <ListGroup variant="flush" className="mb-4">
                                                                                {values.oportunidades.map((_, index) => (
                                                                                    <ListGroup.Item key={index} className="py-3 px-0 border-bottom">
                                                                                        <Row className="g-3 align-items-center">
                                                                                            {/* Número */}
                                                                                            <Col xs={1} className="text-center">
                                                                                                <Badge pill bg="light" text="primary" className="fw-normal fs-6">
                                                                                                    {index + 1}
                                                                                                </Badge>
                                                                                            </Col>

                                                                                            {/* Nome */}
                                                                                            <Col md={5}>
                                                                                                <Form.Group controlId={`nomePessoa-${index}`}>
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaUser className="me-2" size={12} />
                                                                                                        Nome do Participante
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        name={`oportunidades[${index}].nomePessoa`}
                                                                                                        as={Form.Control}
                                                                                                        placeholder="Digite o nome completo"
                                                                                                        className="py-2"
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>

                                                                                            {/* Momento */}
                                                                                            <Col md={4}>
                                                                                                <Form.Group controlId={`momento-${index}`}>
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaClock className="me-2" size={12} />
                                                                                                        Momento
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        name={`oportunidades[${index}].momento`}
                                                                                                        as={Form.Select}
                                                                                                        className="py-2"
                                                                                                    >
                                                                                                        <option value="">Selecione...</option>
                                                                                                        <option value="LOUVOR_OFERTA">Louvor da Oferta</option>
                                                                                                        <option value="LOUVOR">Louvor</option>
                                                                                                        <option value="SAUDACAO">Saudação</option>
                                                                                                        <option value="TESTEMUNHO">Testemunho</option>
                                                                                                    </Field>
                                                                                                </Form.Group>
                                                                                            </Col>

                                                                                            {/* Botão Remover - Alinhado com o input */}
                                                                                            <Col md={2} className="d-flex">
                                                                                                <Button
                                                                                                    variant="outline-danger"
                                                                                                    size="sm"
                                                                                                    onClick={() => remove(index)}
                                                                                                    className="px-3 d-flex align-items-center ms-auto"
                                                                                                    style={{
                                                                                                        height: '38px',
                                                                                                        marginTop: '24px' // Ajuste para compensar a altura do label
                                                                                                    }}
                                                                                                >
                                                                                                    <FaTrash className="me-2" />
                                                                                                    Remover
                                                                                                </Button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </ListGroup.Item>
                                                                                ))}
                                                                            </ListGroup>
                                                                        ) : (
                                                                            <Alert variant="light" className="text-center py-4 mb-4">
                                                                                <div className="mb-3 text-muted">
                                                                                    <FaCalendarAlt size={40} />
                                                                                </div>
                                                                                <h5 className="fw-semibold">Nenhuma oportunidade cadastrada</h5>
                                                                                <p className="text-muted mb-0">
                                                                                    Adicione os participantes que terão momentos especiais no culto
                                                                                </p>
                                                                            </Alert>
                                                                        )}

                                                                        <div className="d-grid">
                                                                            <Button
                                                                                variant="primary"
                                                                                onClick={() => push({ nomePessoa: '', momento: '' })}
                                                                                className="py-2 fw-semibold d-flex align-items-center justify-content-center"
                                                                            >
                                                                                <FaPlusCircle className="me-2" size={18} />
                                                                                Adicionar Oportunidade
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </FieldArray>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Container>
                                    )}
                                    {/* Equipe Intercessão */}
                                    {step === 3 && (
                                        <Container className="py-4">
                                            <Row className="justify-content-center mb-5">
                                                <Col lg={10} xl={8}>
                                                    <Card className="border-0 shadow-sm">
                                                        <Card.Body className="p-4">
                                                            <div className="text-center mb-4">
                                                                <h2 className="fw-bold text-primary mb-3">
                                                                    <FaHandsPraying className="me-2" />
                                                                    Equipe de Intercessão
                                                                </h2>
                                                            </div>

                                                            <FieldArray name="equipeIntercessao">
                                                                {({ remove, push }) => (
                                                                    <>
                                                                        {values.equipeIntercessao.length > 0 ? (
                                                                            <ListGroup variant="flush" className="mb-4">
                                                                                {values.equipeIntercessao.map((_, index) => (
                                                                                    <ListGroup.Item key={index} className="py-3 px-0 border-bottom">
                                                                                        <Row className="g-3 align-items-start">
                                                                                            <Col xs={1} className="text-center">
                                                                                                <Badge pill bg="light" text="primary" className="fw-normal fs-6">
                                                                                                    {index + 1}
                                                                                                </Badge>
                                                                                            </Col>
                                                                                            <Col md={5}>
                                                                                                <Form.Group controlId={`nomeObreiro-${index}`}>
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaUser className="me-2" size={12} />
                                                                                                        Nome do Obreiro
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        name={`equipeIntercessao[${index}].nomeObreiro`}
                                                                                                        as={Form.Control}
                                                                                                        placeholder="Digite o nome completo"
                                                                                                        className="py-2"
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            <Col md={4}>
                                                                                                <Form.Group controlId={`cargo-${index}`}>
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaUserTie className="me-2" size={12} />
                                                                                                        Cargo/Ministerio
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        as={Form.Select}
                                                                                                        name={`equipeIntercessao[${index}].cargo`}
                                                                                                        className="py-2"
                                                                                                    >
                                                                                                        <option value="">Selecione o cargo...</option>
                                                                                                        <option value="OBREIRO">Obreiro</option>
                                                                                                        <option value="OBREIRA">Obreira</option>
                                                                                                        <option value="VOLUNTARIO">Voluntário</option>
                                                                                                        <option value="VOLUNTARIA">Voluntária</option>
                                                                                                        <option value="DIACONO">Diácono</option>
                                                                                                        <option value="DIACONISA">Diaconisa</option>
                                                                                                        <option value="PRESBITERO">Presbítero</option>
                                                                                                        <option value="EVANGELISTA">Evangelista</option>
                                                                                                        <option value="PASTOR">Pastor</option>
                                                                                                        <option value="PASTORA">Pastora</option>
                                                                                                    </Field>
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            {/* Botão Remover - Alinhado com o input */}
                                                                                            <Col md={2} className="d-flex">
                                                                                                <Button
                                                                                                    variant="outline-danger"
                                                                                                    size="sm"
                                                                                                    onClick={() => remove(index)}
                                                                                                    className="px-3 d-flex align-items-center ms-auto"
                                                                                                    style={{
                                                                                                        height: '38px',
                                                                                                        marginTop: '30px' // Ajuste para compensar a altura do label
                                                                                                    }}
                                                                                                >
                                                                                                    <FaTrash className="me-2" />
                                                                                                    Remover
                                                                                                </Button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </ListGroup.Item>
                                                                                ))}
                                                                            </ListGroup>
                                                                        ) : (
                                                                            <Alert variant="light" className="text-center py-4 mb-4">
                                                                                <div className="mb-3 text-muted">
                                                                                    <FaUsers size={40} />
                                                                                </div>
                                                                                <h5 className="fw-semibold">Nenhum membro cadastrado</h5>
                                                                                <p className="text-muted mb-0">
                                                                                    Adicione os membros da equipe de intercessão
                                                                                </p>
                                                                            </Alert>
                                                                        )}

                                                                        <div className="d-grid">
                                                                            <Button
                                                                                variant="primary"
                                                                                onClick={() => push({ nomeObreiro: '', cargo: '' })}
                                                                                className="py-2 fw-semibold d-flex align-items-center justify-content-center"
                                                                            >
                                                                                <FaPlusCircle className="me-2" size={18} />
                                                                                Adicionar Obreiro
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </FieldArray>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Container>
                                    )}
                                    {/* Avisos */}
                                    {step === 4 && (
                                        <Container className="py-4">
                                            <Row className="justify-content-center mb-5">
                                                <Col lg={10} xl={8}>
                                                    <Card className="border-0 shadow-sm">
                                                        <Card.Body className="p-4">
                                                            <div className="text-center mb-4">
                                                                <h2 className="fw-bold text-primary mb-3">
                                                                    <FaBullhorn className="me-2" />
                                                                    Avisos do Culto
                                                                </h2>
                                                            </div>

                                                            <FieldArray name="avisos">
                                                                {({ remove, push }) => (
                                                                    <>
                                                                        {values.avisos.length > 0 ? (
                                                                            <ListGroup variant="flush" className="mb-4">
                                                                                {values.avisos.map((_, index) => (
                                                                                    <ListGroup.Item key={index} className="py-3 px-0 border-bottom">
                                                                                        <Row className="g-3 align-items-start">
                                                                                            <Col xs={1} className="text-center pt-4">
                                                                                                <Badge pill bg="light" text="primary" className="fw-normal fs-6">
                                                                                                    {index + 1}
                                                                                                </Badge>
                                                                                            </Col>
                                                                                            <Col md={4}>
                                                                                                <Form.Group controlId={`nomeAviso-${index}`} className="mb-3">
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaInfoCircle className="me-2" size={12} />
                                                                                                        Nome do Aviso
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        name={`avisos[${index}].nomeAviso`}
                                                                                                        as={Form.Control}
                                                                                                        placeholder="Título do aviso"
                                                                                                        className="py-2"
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            <Col md={4}>
                                                                                                <Form.Group controlId={`referente-${index}`} className="mb-3">
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaCalendarCheck className="me-2" size={12} />
                                                                                                        Referente
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        name={`avisos[${index}].referente`}
                                                                                                        as={Form.Control}
                                                                                                        placeholder="Sobre o que é este aviso?"
                                                                                                        className="py-2"
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            <Col md={3}>
                                                                                                <Form.Group controlId={`horarioEvento-${index}`} className="mb-3">
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaClock className="me-2" size={12} />
                                                                                                        Horário
                                                                                                    </Form.Label>
                                                                                                    <Field
                                                                                                        type="time"
                                                                                                        name={`avisos[${index}].horarioEvento`}
                                                                                                        as={Form.Control}
                                                                                                        className="py-2"
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            <Col md={1}></Col>
                                                                                            <Col md={7}>
                                                                                                <Form.Group controlId={`diasEvento-${index}`} className="mb-3">
                                                                                                    <Form.Label className="small fw-semibold text-uppercase text-muted d-flex align-items-center">
                                                                                                        <FaCalendarDay className="me-2" size={12} />
                                                                                                        Dias do Evento
                                                                                                    </Form.Label>
                                                                                                    <DatePickerField
                                                                                                        name={`avisos[${index}].diasEvento`}
                                                                                                        className="py-2"
                                                                                                        minDate={new Date()} // Não permite datas passadas
                                                                                                        sort // Ordena as datas selecionadas
                                                                                                        showOtherDays // Mostra dias de outros meses
                                                                                                        fixMainPosition="top" // Posiciona o calendário acima do input
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                            <Col md={4} className="pt-4">
                                                                                                <Button
                                                                                                    variant="outline-danger"
                                                                                                    size="sm"
                                                                                                    onClick={() => remove(index)}
                                                                                                    className="px-3 d-flex align-items-center ms-auto"
                                                                                                    style={{ height: '38px' }}
                                                                                                >
                                                                                                    <FaTrash className="me-2" />
                                                                                                    Remover
                                                                                                </Button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </ListGroup.Item>
                                                                                ))}
                                                                            </ListGroup>
                                                                        ) : (
                                                                            <Alert variant="light" className="text-center py-4 mb-4">
                                                                                <div className="mb-3 text-muted">
                                                                                    <FaBell size={40} />
                                                                                </div>
                                                                                <h5 className="fw-semibold">Nenhum aviso cadastrado</h5>
                                                                                <p className="text-muted mb-0">
                                                                                    Adicione os avisos importantes para a congregação
                                                                                </p>
                                                                            </Alert>
                                                                        )}

                                                                        <div className="d-grid">
                                                                            <Button
                                                                                variant="primary"
                                                                                onClick={() => push({ nomeAviso: '', referente: '', horarioEvento: '', diasEvento: [] })}
                                                                                className="py-2 fw-semibold d-flex align-items-center justify-content-center"
                                                                            >
                                                                                <FaPlusCircle className="me-2" size={18} />
                                                                                Adicionar Aviso
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </FieldArray>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Container>
                                    )}
                                    <div className="d-flex justify-content-between">
                                        {step === 1 && (
                                            <Link href={"/cultos"} className="btn btn-danger"><FaArrowLeft />Voltar</Link>
                                        )}
                                        {step > 1 && (
                                            <Button variant="secondary" onClick={handlePrevious}>
                                                <FaAngleLeft />Anterior
                                            </Button>
                                        )}
                                        <div className="ms-auto">
                                            {step < 4 ? (
                                                <Button variant="success" onClick={handleNext}>
                                                    Próximo<FaAngleRight />
                                                </Button>
                                            ) : (
                                                <Button variant="success" className="ms-1" onClick={handleSubmit}>
                                                    <FaCheck /> Salvar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Form>

                            );
                        }}
                    </Formik>
                    {/* Barra de progresso */}
                    <ProgressBar now={(step / 4) * 100} className="mt-5" />
                </Container>
            </section>
        </>
    );
}