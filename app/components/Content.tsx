import { Typography, Button, Container } from "@mui/material";
import { SubmitButton } from "./SubmitButton";
import { useState, FormEvent } from "react";

const Content = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [result, setResult] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("User word:", inputValue);
        try {
            const response = await fetch("https://wdragj.pythonanywhere.com/api/breedRecommend", {
                method: "POST", // or 'GET', depending on your API
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: inputValue }), // adjust this depending on how your API expects the data
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data: ", data);
            setResult(data);
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
                    style={{ height: "60px" }}
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="prompt"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="loyal"
                        className="bg-transparent text-white placeholder:text-gray-400 ring-0 outline-none resize-none py-2.5 px-2 font-mono text-sm h-10 w-full transition-all duration-300"
                    />
                    <input aria-hidden type="text" name="token" value={"token"} className="hidden" readOnly />
                    <SubmitButton />
                </form>
            </Container>
        </>
    );
};

export default Content;
