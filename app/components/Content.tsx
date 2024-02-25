import { Typography, Button, Container, Card, CardContent, Grid, LinearProgress } from "@mui/material";
import { SubmitButton } from "./SubmitButton";
import { useState, FormEvent } from "react";

const Content = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // State for loading status

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("User word:", inputValue);
        setLoading(true); // Set loading to true when submitting form
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
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false); // Set loading to false after receiving response or error
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
                    style={{ height: "60px", marginBottom: "20px" }}
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
                {loading && <LinearProgress sx={{ height: 10 }} />}
            </Container>
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: "120px" }}>
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
