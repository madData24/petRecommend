import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import Navbar from "../app/components/Navbar";

const FindDog: NextPage = () => {
    const [dogs, setDogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const tokenResponse = await fetch("https://api.petfinder.com/v2/oauth2/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        grant_type: "client_credentials",
                        client_id: "RYkL8o0DxVBE98vMdkRvVCEGTw7SkgIAXhNsISaahLGML34szc",
                        client_secret: "JXf2XvJnSxUnunToKxAQWfJVZo9qwrF0i1wh555r",
                    }),
                });

                if (!tokenResponse.ok) {
                    throw new Error("Failed to obtain token");
                }

                const { access_token } = await tokenResponse.json();

                const dogsResponse = await fetch("https://api.petfinder.com/v2/animals", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                if (!dogsResponse.ok) {
                    throw new Error("Failed to fetch dogs");
                }

                const { animals } = await dogsResponse.json();
                setDogs(animals);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchDogs();
    }, []);

    return (
        <div>
            <Navbar />
            <Container maxWidth="md" style={{ marginTop: "50px", textAlign: "center" }}>
                <Typography variant="h4">Find Your Perfect Dog Companion</Typography>
                <ul>
                    {dogs.map((dog) => (
                        <li key={dog.id}>{dog.name}</li>
                    ))}
                </ul>
            </Container>
        </div>
    );
};

export default FindDog;
