import { Container, Navbar } from "react-bootstrap";

export default function HeaderLoginComponent() {
    return (
        <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
            <Navbar className="bg-white py-3">
                <Container>
                    <Navbar.Brand href="/login">
                        <img src="/images/Logo.png" style={{height: 50, width: '100%'}}/>
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    )
}