'use client'

import Spinners from "@/app/components/Spinners";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, ProgressBar } from "react-bootstrap";
import { FaCheck, FaAngleLeft, FaClock, FaCalendar, FaAngleRight } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";

export default function Page({ params }) {
    const [loading, setLoading] = useState(false); //pagina carregando
    const [error, setError] = useState(null); //login
    const [step, setStep] = useState(1); //próximo form
    const [selectedDates, setSelectedDates] = useState([]); //Multiplas datas

    const authToken = localStorage.getItem('authToken');
    const route = useRouter();

    //Próximo
    const handleNext = () => {
        setStep(step + 1);
    };

    //Anterior
    const handlePrevious = () => {
        setStep(step - 1);
    };

    const cadastrarCulto = (values) => {
        console.log(values)
    };

    //Sobre a multi seleção de data
    const handleDateChange = (dates) => {
        setSelectedDates(dates);
        // setFieldValue("datasEvento", dates.map(date => date.format("YYYY-MM-DD"))); // Formato desejado
    };

    const culto = {
        tituloCulto: '',
        tipoCulto: '',
        dataCulto: '',
        dirigente: '',
        horaProsperar: '',
        nomePessoa: '',
        momento: '',
        nomeObreiro: '',
        cargo: '',
        nomeAviso: '',
        referente: '',
        horarioEvento: '',
        datasEvento: [],
        oportunidades: [],
        equipeIntercessao: [],
        avisos: []
    };

    if (loading) {
        return <Spinners />;
    }

    if (error) {
        return <p>Erro ao carregar cultos: {error}</p>;
    }

    return (
        <>
            <Container>
                <Formik
                    initialValues={culto}
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
                        //Adicionar Oportunidade
                        const addOportunidade = () => {
                            // Verificar se todos os campos de uma nova oportunidade estão preenchidos
                            if (!values.nomePessoa || !values.momento) {
                                alert("Preencha todos os campos");
                                return;
                            }

                            const oportunidade = {
                                nomePessoa: values.nomePessoa,
                                momento: values.momento
                            };
                            values.oportunidades.push(oportunidade)
                            setFieldValue('nomePessoa', '');
                            setFieldValue('momento', '');
                            console.log(values); // Verificar o estado atualizado
                        };

                        const removerOportunidade = (index) => {
                            const oportunidade = values.oportunidades.filter((_, i) => i !== index);
                            setFieldValue('oportunidades', oportunidade);
                        };

                        //Adicionar obreiro
                        const addEquipeIntercessao = () => {
                            if (!values.nomeObreiro || !values.cargo) {
                                alert("Preencha todos os campos");
                                return;
                            }
                            const equipe = {
                                nomeObreiro: values.nomeObreiro,
                                cargo: values.cargo
                            };
                            values.equipeIntercessao.push(equipe)
                            setFieldValue('nomeObreiro', '');
                            setFieldValue('cargo', '');
                            console.log(values);
                        }

                        const removerObreiro = (index) => {
                            const equipe = values.equipeIntercessao.filter((_, i) => i !== index);
                            setFieldValue('equipeIntercessao', equipe);
                            console.log(values);
                        }

                        //Adicionar Avisos
                        const addAvisos = () => {
                            if (!values.nomeAviso || !values.referente || !values.horarioEvento) {
                                alert("Preencha todos os campos");
                                return;
                            }
                            // Adcionando o array de datas
                            let datasEvento = [];
                            values.datasEvento.map((item) => {
                                datasEvento.push(item)
                            })
                            const aviso = {
                                nomeAviso: values.nomeAviso,
                                referente: values.referente,
                                horarioEvento: values.horarioEvento,
                                //Datas do evento
                                datasEvento: datasEvento
                            };
                            values.avisos.push(aviso)
                            setFieldValue('nomeAviso', '');
                            setFieldValue('referente', '');
                            setFieldValue('horarioEvento', '');
                            // Limpa o estado do DatePicker
                            setSelectedDates([]);
                            setFieldValue('datasEvento', []);

                            console.log(values);
                        }

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
                                                value={values.tipoCulto}
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
                                        <Form.Group className="mb-3" controlId="nomePessoa">
                                            <Form.Label>Nome Pessoa</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o nome da pessoa"
                                                name="nomePessoa"
                                                value={values.nomePessoa}
                                                onChange={handleChange('nomePessoa')}
                                                isInvalid={!!errors.nomePessoa}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nomePessoa}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="momento">
                                            <Form.Label>Momento da oportunidade</Form.Label>
                                            <Form.Select
                                                aria-label="Momento da oportunidade"
                                                name="momento"
                                                value={values.momento}
                                                onChange={handleChange('momento')}
                                                isInvalid={!!errors.momento}
                                            >
                                                <option value="">Selecione</option>
                                                <option value="LOUVOR_OFERTA">Louvor da Oferta</option>
                                                <option value="LOUVOR">Louvor</option>
                                                <option value="SAUDACAO">Saudação</option>
                                                <option value="TESTEMUNHO">Testemunho</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.momento}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button type="button" variant="success" onClick={addOportunidade}>
                                            Adicionar Oportunidade
                                        </Button>
                                        {values.oportunidades.map((oportunidade, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center">
                                                <h5>{oportunidade.nomePessoa}</h5>
                                                <Button variant="danger" onClick={() => removerOportunidade(index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {/* Equipe Intercessão */}
                                {step === 3 && (
                                    <>
                                        <h1>Equipe Intercessão</h1>
                                        <Form.Group className="mb-3" controlId="nomeObreiro">
                                            <Form.Label>Nome do Intercessor</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o nome do intercessor"
                                                name="nomeObreiro"
                                                value={values.nomeObreiro}
                                                onChange={handleChange('nomeObreiro')}
                                                isInvalid={errors.nomeObreiro}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nomeObreiro}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="cargo">
                                            <Form.Label>Cargo Eclesiástico</Form.Label>
                                            <Form.Select
                                                aria-label="Cargo Eclesiástico"
                                                name="cargo"
                                                value={values.cargo}
                                                onChange={handleChange('cargo')}
                                                isInvalid={!!errors.cargo}
                                            >
                                                <option value={''}>Selecione</option>
                                                <option value={'OBREIRO'}>Obreiro</option>
                                                <option value={'OBREIRA'}>Obreira</option>
                                                <option value={'VOLUNTARIO'}>Volutario</option>
                                                <option value={'VOLUNTARIA'}>Voluntaria</option>
                                                <option value={'DIACONO'}>Diacono</option>
                                                <option value={'DIACONISA'}>Diaconisa</option>
                                                <option value={'PRESBITERO'}>Presbitero</option>
                                                <option value={'EVANGELISTA'}>Evangelista</option>
                                                <option value={'PASTOR'}>Pastor</option>
                                                <option value={'PASTORA'}>Pastora</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.cargo}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button type="button" variant="success" onClick={addEquipeIntercessao}>
                                            Adicionar Obreiro
                                        </Button>
                                        {values.equipeIntercessao.map((equipe, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center">
                                                <h5>{equipe.nomeObreiro}</h5>
                                                <Button variant="danger" onClick={() => removerObreiro(index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {/* Avisos */}
                                {step === 4 && (
                                    <>
                                        <h1>Avisos</h1>
                                        <Form.Group className="mb-3" controlId="nomeAviso">
                                            <Form.Label>Nome do aviso</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o nome do aviso"
                                                name="nomeAviso"
                                                value={values.nomeAviso}
                                                onChange={handleChange('nomeAviso')}
                                                isInvalid={errors.nomeAviso}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nomeAviso}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="referente">
                                            <Form.Label>Referente</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Digite o nome do aviso"
                                                name="referente"
                                                value={values.referente}
                                                onChange={handleChange('referente')}
                                                isInvalid={errors.referente}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.referente}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="horarioEvento">
                                            <Form.Label>Horário do Evento</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaClock />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="time"
                                                    name="horarioEvento"
                                                    value={values.horarioEvento}
                                                    onChange={handleChange('horarioEvento')}
                                                    isInvalid={!!errors.horarioEvento}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.horarioEvento}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>

                                        {/* Multi seleção de data */}
                                        <Form.Group className="mb-3" controlId="datasEvento">
                                            <Form.Label>Datas do Evento</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaCalendar />
                                                </InputGroup.Text>
                                                <DatePicker
                                                    value={selectedDates}
                                                    onChange={handleDateChange}
                                                    multiple
                                                    format="DD/MM/YYYY"
                                                    placeholder="Selecione as datas"
                                                    inputClass="form-control"
                                                />
                                            </InputGroup>
                                            {errors.datasEvento && (
                                                <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                                                    {errors.datasEvento}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Button type="button" variant="success" onClick={addAvisos}>
                                            Adicionar Aviso
                                        </Button>
                                        {values.avisos.map((aviso, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center">
                                                <h5>{aviso.nomeAviso}</h5>
                                                <Button variant="danger" onClick={() => removerObreiro(index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
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