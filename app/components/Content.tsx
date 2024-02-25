import { Typography, Button, Container, Card, CardContent, Grid } from "@mui/material";
import { SubmitButton } from "./SubmitButton";
import { useState, FormEvent } from "react";

const Content = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [result, setResult] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("User word:", inputValue);
        try {
            const response = await fetch("https://wdragj.pythonanywhere.com/api/breedRecommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: inputValue }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const breeds = data.data.breed;
            console.log("Breeds:", breeds);
            setBreedNames(breeds); // Set the breed names

            // Check if data has the 'breed' property
            // if (breeds) {
            //     try {
            //         const tokenResponse = await fetch("https://api.petfinder.com/v2/oauth2/token", {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({
            //                 grant_type: "client_credentials",
            //                 client_id: "RYkL8o0DxVBE98vMdkRvVCEGTw7SkgIAXhNsISaahLGML34szc",
            //                 client_secret: "JXf2XvJnSxUnunToKxAQWfJVZo9qwrF0i1wh555r",
            //             }),
            //         });

            //         if (!tokenResponse.ok) {
            //             throw new Error("Failed to obtain token");
            //         }

            //         const { access_token } = await tokenResponse.json();

            //         // Convert array of breed names to a single comma-separated string
            //         const breedNames = breeds.join(", ").trim();

            //         console.log("Breed names: ", breedNames);

            //         // Construct URL with query parameters
            //         const url = new URL("https://api.petfinder.com/v2/animals");
            //         url.searchParams.append("breed", breedNames);

            //         const dogsResponse = await fetch(url.toString(), {
            //             method: "GET",
            //             headers: {
            //                 Authorization: `Bearer ${access_token}`,
            //             },
            //         });

            //         if (!dogsResponse.ok) {
            //             throw new Error("Failed to fetch dogs");
            //         }

            //         const { animals, pagination } = await dogsResponse.json();
            //         const { count_per_page, total_count, current_page, total_pages, _links } = pagination;
            //         const { previous, next } = _links;
            //         console.log("Fetched dogs:", animals);
            //         console.log("Pagination:", pagination);
            //         setResult(animals); // Set the dogs data
            //     } catch (error) {
            //         console.error("Error:", error);
            //     }
            // } else {
            //     console.error("Error: Invalid data format or missing 'breed' property");
            // }
        } catch (error) {
            console.error("Error fetching data: ", error);
            setResult(null);
        }
    };

    return (
        <>
            <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h4" gutterBottom>
                    Find Your Perfect Dog Companion <br />
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <p className="text-gray-500 mb-12 text-base animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
                        Discover dogs nearby and get recommendations for your perfect companion.
                    </p>
                </Typography>

                <form
                    action={"/findDog"}
                    className="bg-black rounded-xl shadow-lg h-fit flex flex-row px-1 items-center w-full"
                    style={{ height: "60px", marginBottom: "120px" }}
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="prompt"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Type one or more pawsonalities to meet Fur-ever Friends! 🐾🐶🐾"
                        className="bg-transparent text-white placeholder:text-gray-400 ring-0 outline-none resize-none py-2.5 px-2 font-mono text-sm h-10 w-full transition-all duration-300"
                    />
                    <input aria-hidden type="text" name="token" value={"token"} className="hidden" readOnly />
                    <SubmitButton />
                </form>
            </Container>
            <Grid container spacing={2} justifyContent="center">
                {breedNames.map((name, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                        key={index}
                        style={{ height: "100%", minHeight: "300px" }}
                    >
                        <Card style={{ height: "100%" }}>
                            <CardContent style={{ textAlign: "left", height: "100%" }}>
                                <Typography variant="h6" style={{ textAlign: "center" }}>
                                    {name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Content;
