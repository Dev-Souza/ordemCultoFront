'use client';

import { Formik } from "formik";
import Link from "next/link";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { FaCheck, FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import ordemCulto from "../services/ordemCulto";
import { useRouter } from "next/navigation";
import HeaderLoginComponent from "../components/login/HeaderLoginComponent";

export default function Page() {
    const router = useRouter();

    async function autenticar(values) {
        try {
            const resultado = await ordemCulto.post('auth/login', values);
            const resposta = resultado.data;
            const token = resposta.token;
            localStorage.setItem('authToken', token);
            router.push('/cultos');
        } catch (error) {
            console.log(error);
            alert("Usuário ou senha incorretos!");
        }
    }

    return (
        <>
            <HeaderLoginComponent />
            <div style={{
                height: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right,rgb(19, 14, 11),rgb(153, 102, 45),rgb(189, 172, 154))',
                overflow: 'hidden',
            }}>

                <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow-lg">
                    <h3 className="text-center mb-4 text-primary">Acesso ao Sistema</h3>
                    <Formik
                        initialValues={{ login: '', password: '' }}
                        onSubmit={values => autenticar(values)}
                    >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            errors,
                            touched
                        }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="login">
                                    <Form.Label>
                                        <FaUser className="me-2" /> Usuário
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu usuário"
                                        name="login"
                                        value={values.login}
                                        onChange={handleChange}
                                        className="shadow-sm"
                                        isInvalid={touched.login && !!errors.login}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.login}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>
                                        <FaLock className="me-2" /> Senha
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Digite sua senha"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        className="shadow-sm"
                                        isInvalid={touched.password && !!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 d-flex align-items-center justify-content-center mb-2"
                                >
                                    <FaCheck className="me-2" /> Login
                                </Button>
                                <div className="text-center">
                                    <Link href="/users/register" passHref>
                                        <Button variant="link" className="text-white-50 text-decoration-none">
                                            <FaUserPlus className="me-1" /> Não é cadastrado? Cadastre-se
                                        </Button>
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </>
    );
}