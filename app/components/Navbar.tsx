// components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
    return (
        <AppBar position="static" style={{ background: "white", padding: "1rem 0" }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ color: "black", display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        <Link href="/" passHref>
                            <Button
                                color="inherit"
                                variant="text"
                                style={{ fontWeight: "bold", color: "black", fontSize: "1.2rem" }}
                            >
                                Furtune Teller
                            </Button>
                        </Link>
                    </Typography>
                    <Box>
                        <Link href="/" passHref>
                            <Button color="inherit" variant="text" style={{ color: "black", fontSize: "1.2rem" }}>
                                Home
                            </Button>
                        </Link>
                        <Link href="/findDog" passHref>
                            <Button color="inherit" variant="text" style={{ color: "black", fontSize: "1.2rem" }}>
                                Find Dog
                            </Button>
                        </Link>
                        <Button
                            variant="outlined"
                            color="inherit"
                            component="a"
                            href="https://github.com/madData24/petRecommend"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "2rem", fontSize: "1.2rem" }}
                        >
                            Github Repository
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
