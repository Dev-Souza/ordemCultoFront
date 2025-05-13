import { Container, Navbar } from "react-bootstrap";

export default function HeaderLoginComponent() {
    return (
        <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
            <Navbar className="bg-white py-3">
                <Container>
                    <Navbar.Brand href="/login">
                        MAVA
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    )
}