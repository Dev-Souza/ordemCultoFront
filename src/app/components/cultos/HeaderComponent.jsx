import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

function HeaderComponent(props) {
  return (
    <Navbar className="bg-white py-3 fixed-top shadow-sm">
      <Container>
        <Navbar.Brand href="/cultos">
          <img src='/images/Logo.png' style={{height: 50}}/>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex align-items-center gap-3">
            <Link href="/cultos/forms" className="btn btn-success btn-md text-white d-flex align-items-center gap-2">
              Criar Culto <FaPlus />
            </Link>
            <Link href={`/${props.caminho}`} className="btn btn-danger text-white">
              <FaArrowLeft /> Voltar
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;