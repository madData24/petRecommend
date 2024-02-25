import { useState, FormEvent } from "react";

export default function Home() {
    const [inputValue, setInputValue] = useState<string>("");
    const [result, setResult] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitting", inputValue);
        try {
            const response = await fetch("/api/breedRecommend", {
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
            <h1>Hello, world!</h1>
            <p>This is a simple example of a Next.js app with TypeScript and Tailwind CSS.</p>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={inputValue} onChange={handleChange} />
                    <button type="submit">Submit</button>
                </form>
                {result && <div>Recommended Breeds: {JSON.stringify(result)}</div>}
            </div>
        </>
    );
}
