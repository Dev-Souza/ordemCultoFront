'use client'

export default function PaginaErro({error}) {
    return (
        <>
            <h1>Aconteceu um erro</h1>
            <p>Contante ao administrador</p>
            <p>{error}</p>
        </>
    );
}   