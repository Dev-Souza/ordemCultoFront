import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function HeaderComponent(props) {
  return (
    <Navbar className="bg-white py-3">
      <Container>
        <Navbar.Brand href="/cultos">MAVA</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Link href={`/${props.caminho}`}>Voltar</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;