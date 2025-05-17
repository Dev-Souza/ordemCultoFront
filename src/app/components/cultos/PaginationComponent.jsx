import Pagination from 'react-bootstrap/Pagination';

export default function PaginationComponent(params) {

    console.log(params.pagina)

    let active = params.pagina + 1;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                <span>
                    {number}
                </span>
            </Pagination.Item>,
        );
    }

    return (
        <Pagination>{items}</Pagination>
    )
}