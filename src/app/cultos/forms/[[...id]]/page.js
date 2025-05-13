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
import { Button, Container, Form, ProgressBar } from "react-bootstrap";
import { FaCheck, FaAngleLeft, FaAngleRight } from "react-icons/fa";

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
            <HeaderComponent caminho="cultos"/>
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
                        setFieldValue,
                        errors,
                    }) => {

                        return (
                            <Form className="mt-3">
                                {step === 1 && (
                                    <>
                                        {/* Título do culto */}
                                        <Form.Group className="mb-3" controlId="tituloCulto">
                                            <Form.Label>Título do Culto</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o título do Culto"
                                                name="tituloCulto"
                                                value={values.tituloCulto}
                                                onChange={handleChange('tituloCulto')}
                                                isInvalid={errors.tituloCulto}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.tituloCulto}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Tipo do culto */}
                                        <Form.Group className="mb-3" controlId="tipoCulto">
                                            <Form.Label>Tipo do Culto</Form.Label>
                                            <Form.Select
                                                aria-label="Tipo do Culto"
                                                name="tipoCulto"
                                                value={values.tipoCulto || ''}
                                                onChange={handleChange('tipoCulto')}
                                                isInvalid={!!errors.tipoCulto}
                                            >
                                                <option value={''}>Selecione</option>
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
                                        <Form.Group className="mb-3" controlId="dataCulto">
                                            <Form.Label>Data do Culto</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="dataCulto"
                                                value={values.dataCulto}
                                                onChange={handleChange('dataCulto')}
                                                isInvalid={!!errors.dataCulto}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dataCulto}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Dirigente */}
                                        <Form.Group className="mb-3" controlId="dirigente">
                                            <Form.Label>Dirigente</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o nome do dirigente"
                                                name="dirigente"
                                                value={values.dirigente}
                                                onChange={handleChange('dirigente')}
                                                isInvalid={errors.dirigente}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dirigente}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Hora de Prosperar */}
                                        <Form.Group className="mb-3" controlId="horaProsperar">
                                            <Form.Label>Hora de Prosperar</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite a Hora de Prosperar"
                                                name="horaProsperar"
                                                value={values.horaProsperar}
                                                onChange={handleChange('horaProsperar')}
                                                isInvalid={errors.horaProsperar}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.horaProsperar}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </>
                                )}
                                {/* Oportunidades */}
                                {step === 2 && (
                                    <>
                                        <h1>Oportunidades</h1>
                                        <FieldArray name="oportunidades">
                                            {({ remove, push }) => (
                                                <div>
                                                    {values.oportunidades.map((_, index) => (
                                                        <div key={index}>
                                                            <Field name={`oportunidades[${index}].nomePessoa`} placeholder="Digite o nome da pessoa" />
                                                            <Field as="select" name={`oportunidades[${index}].momento`}>
                                                                <option value="">Selecione uma opção</option>
                                                                <option value="LOUVOR_OFERTA">Louvor da oferta</option>
                                                                <option value="LOUVOR">Louvor</option>
                                                                <option value="SAUDACAO">Saudação</option>
                                                                <option value="TESTEMUNHO">Testemunho</option>
                                                            </Field>
                                                            <button type="button" onClick={() => remove(index)}>Remover</button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => push({ nomePessoa: '', momentoOportunidade: '' })}>Adicionar oportunidade</button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </>
                                )}
                                {/* Equipe Intercessão */}
                                {step === 3 && (
                                    <>
                                        <h1>Equipe Intercessão</h1>
                                        <FieldArray name="equipeIntercessao">
                                            {({ remove, push }) => (
                                                <div>
                                                    {values.equipeIntercessao.map((_, index) => (
                                                        <div key={index}>
                                                            <Field name={`equipeIntercessao[${index}].nomeObreiro`} />
                                                            <Field as="select" name={`equipeIntercessao[${index}].cargo`} >
                                                                <option value="">Selecione uma opção</option>
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
                                                            <button type="button" onClick={() => remove(index)}>Remover</button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => push({})}>Adicionar obreiro</button>
                                                </div>
                                            )}

                                        </FieldArray>
                                    </>
                                )}
                                {/* Avisos */}
                                {step === 4 && (
                                    <>
                                        <h1>Avisos</h1>
                                        <FieldArray name="avisos">
                                            {({ remove, push }) => (
                                                <div>
                                                    {values.avisos.map((_, index) => (
                                                        <div key={index}>
                                                            <Field name={`avisos[${index}].nomeAviso`} />
                                                            <Field name={`avisos[${index}].referente`} />
                                                            <Field type="time" name={`avisos[${index}].horarioEvento`} />
                                                            {/* Componente personalisado do DataPicker para se unir com formik */}
                                                            <DatePickerField name={`avisos[${index}].diasEvento`} />
                                                            <button type="button" onClick={() => remove(index)}>Remover</button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => push({ nomeAviso: '', referente: '', horarioEvento: '', diasEvento: [] })}>
                                                        Adicionar Aviso
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </>
                                )}
                                <div className="d-flex justify-content-between">
                                    {step === 1 && (
                                        <Link href={"/cultos"} className="btn btn-danger"><FaAngleLeft />Voltar</Link>
                                    )}
                                    {step > 1 && (
                                        <Button variant="secondary" onClick={handlePrevious}>
                                            <FaAngleLeft />Anterior
                                        </Button>
                                    )}
                                    <div className="ms-auto">
                                        {step < 4 ? (
                                            <Button variant="primary" onClick={handleNext}>
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
                <ProgressBar now={(step / 4) * 100} />
            </Container>
        </>
    );
}