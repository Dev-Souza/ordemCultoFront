'use client';

import { Formik } from "formik";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { FaCheck, FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import ordemCulto from "../services/ordemCulto";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    async function autenticar(values) {
        try {
            const resultado = await ordemCulto.post('auth/login', values);
            const resposta = resultado.data;
            const token = resposta.token;
            // Armazene o token no localStorage
            localStorage.setItem('authToken', token);
            router.push('/cultos');
        } catch (error) {
            alert("Usuário ou senha incorretos!");
        }        
    }
    

    return (
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
                            placeholder="Digite sua password"
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
                    <div className="text-center">
                        <Button
                            type="submit" // Corrigido para funcionar com Formik
                            variant="success"
                            className="w-100 d-flex align-items-center justify-content-center"
                        >
                            <FaCheck className="me-2" /> Login
                        </Button>
                    </div>
                    <div className="mt-1">
                        <Link href="/users/register" passHref>
                            <Button variant="link" className="text-decoration-none">
                                <FaUserPlus /> Não é cadastrado? Cadastre-se
                            </Button>
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}