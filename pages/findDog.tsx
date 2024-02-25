import { NextPage } from "next";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import {
    Container,
    Typography,
    MenuItem,
    Select,
    TextField,
    Grid,
    Button,
    Card,
    CardContent,
    SelectChangeEvent,
    LinearProgress,
} from "@mui/material";
import Navbar from "../app/components/Navbar";
import Image from "next/image";

interface Dog {
    id: string;
    name: string;
    url: string;
    age: string;
    attributes: {
        spayed_neutered: boolean;
        house_trained: boolean;
        declawed: boolean;
        special_needs: boolean;
        shots_current: boolean;
    };
    breeds: {
        primary: string;
        secondary: string;
        mixed: boolean;
        unknown: boolean;
    };
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    contact: {
        email: string;
        phone: string;
        address: {
            address1: string;
            address2: string;
            city: string;
            state: string;
            postcode: string;
            country: string;
        };
    };
    description: string;
    environment: {
        children: boolean;
        dogs: boolean;
        cats: boolean;
    };
    gender: string;
    size: string;
    organization_id: string;
    organization_animal_id: string;
    published_at: string;
    photos: {
        small: string;
        medium: string;
        large: string;
        full: string;
    }[];
    primary_photo_cropped: {
        small: string;
        medium: string;
        large: string;
        full: string;
    };
}

const FindDog: NextPage = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // State for loading status
    const [Breed, setBreed] = useState<string>("");
    const [Size, setSize] = useState<string[]>(["small", "medium", "large", "xlarge"]);
    const [Gender, setGender] = useState<string[]>(["male", "female"]);
    const [Age, setAge] = useState<string[]>(["baby", "young", "adult", "senior"]);
    const [Location, setLocation] = useState<string>("");

    const [page, setPage] = useState<number>(1); // Track the current page
    const [hasMore, setHasMore] = useState<boolean>(true); // Track if there is more data to load

    // Use useRef to access the last element in the list
    const observer = useRef<IntersectionObserver | null>(null);
    const lastDogRef = useRef<HTMLDivElement | null>(null);

    const [selectedBreed, setSelectedBreed] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedAge, setSelectedAge] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    // const handleBreedChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setSelectedBreed(event.target.value as string);
    // };

    const handleSizeChange = (event: SelectChangeEvent<string>) => {
        setSelectedSize(event.target.value as string);
    };

    const handleGenderChange = (event: SelectChangeEvent<string>) => {
        setSelectedGender(event.target.value as string);
    };

    const handleAgeChange = (event: SelectChangeEvent<string>) => {
        setSelectedAge(event.target.value as string);
    };

    const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedLocation(event.target.value);
    };

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (lastDogRef.current) {
            observer.current.observe(lastDogRef.current);
        }

        return () => observer.current?.disconnect();
    }, [hasMore, lastDogRef]);

    useEffect(() => {
        // Observe the lastDogRef when it changes
        if (lastDogRef.current) {
            observer.current?.observe(lastDogRef.current);
        }

        // Clean up the observer when the component unmounts
        return () => {
            observer.current?.disconnect();
        };
    }, [dogs]); // Re-run the effect when dogs change

    useEffect(() => {
        const fetchDogs = async () => {
            setLoading(true);
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

                // Construct URL with query parameters
                const url = new URL("https://api.petfinder.com/v2/animals");
                url.searchParams.append("type", "dog");
                url.searchParams.append("status", "adoptable");
                url.searchParams.append("limit", "30");
                url.searchParams.append("page", page.toString());
                if (selectedSize) url.searchParams.append("size", selectedSize);
                if (selectedGender) url.searchParams.append("gender", selectedGender);
                if (selectedAge) url.searchParams.append("age", selectedAge);
                if (selectedLocation) url.searchParams.append("location", selectedLocation);

                const dogsResponse = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                if (!dogsResponse.ok) {
                    throw new Error("Failed to fetch dogs");
                }

                const { animals, pagination } = await dogsResponse.json();
                const { count_per_page, total_count, current_page, total_pages, _links } = pagination;
                const { previous, next } = _links;

                if (next && next.href) {
                    // If there is a next page, set hasMore to true
                    setHasMore(true);
                } else {
                    // Otherwise, there are no more pages to load
                    setHasMore(false);
                }

                // Append new dogs to the existing dogs array
                setDogs((prevDogs) => [...prevDogs, ...animals]);
            } catch (error) {
                console.error("Error fetching dogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDogs();
    }, [page, selectedSize, selectedGender, selectedAge, selectedLocation]);

    const handleFindClick = async () => {
        setLoading(true); // Set loading to true when submitting form
        setPage(1); // Reset to the first page
        setDogs([]); // Clear existing dogs data
        setHasMore(true); // Reset hasMore to true
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

            // Construct URL with query parameters
            const url = new URL("https://api.petfinder.com/v2/animals");
            url.searchParams.append("type", "dog");
            url.searchParams.append("status", "adoptable");
            url.searchParams.append("limit", "30");
            // if (selectedBreed) url.searchParams.append("breed", selectedSize);
            if (selectedSize) url.searchParams.append("size", selectedSize);
            if (selectedGender) url.searchParams.append("gender", selectedGender);
            if (selectedAge) url.searchParams.append("age", selectedAge);
            if (selectedLocation) url.searchParams.append("location", selectedLocation);

            const dogsResponse = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!dogsResponse.ok) {
                throw new Error("Failed to fetch dogs");
            }

            const { animals, pagination } = await dogsResponse.json();
            const { count_per_page, total_count, current_page, total_pages, _links } = pagination;
            const { previous, next } = _links;
            console.log("Fetched dogs:", animals);
            console.log("Pagination:", pagination);
            setDogs(animals); // Set the dogs data
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false); // Set loading to false after receiving response or error
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
                    <Typography variant="h4">Find Your Perfect Dog Companion</Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <p className="text-gray-500 mb-12 text-base animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
                            Select the Size, Gender, Age, and Location of the dog you are looking for. <br></br>{" "}
                            Location must be in the format of &quot;City, State&quot; or &quot;Zip Code&quot; <br></br>{" "}
                            If you don&apos;t choose any, we will show you all the dogs available.
                        </p>
                    </Typography>
                </Container>
                <Container>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Select
                                value={selectedSize}
                                onChange={handleSizeChange}
                                displayEmpty
                                style={{ minWidth: 200 }}
                            >
                                <MenuItem value="" disabled>
                                    Size
                                </MenuItem>
                                {Size.map((size, index) => (
                                    <MenuItem key={index} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Select
                                value={selectedGender}
                                onChange={handleGenderChange}
                                displayEmpty
                                style={{ minWidth: 200 }}
                            >
                                <MenuItem value="" disabled>
                                    Gender
                                </MenuItem>
                                {Gender.map((gender, index) => (
                                    <MenuItem key={index} value={gender}>
                                        {gender}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Select
                                value={selectedAge}
                                onChange={handleAgeChange}
                                displayEmpty
                                style={{ minWidth: 200 }}
                            >
                                <MenuItem value="" disabled>
                                    Age
                                </MenuItem>
                                {Age.map((age, index) => (
                                    <MenuItem key={index} value={age}>
                                        {age}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Location"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                                variant="outlined"
                                style={{ minWidth: 200 }}
                            />
                        </Grid>
                    </Grid>
                </Container>
                <Container maxWidth="md" style={{ textAlign: "center", marginTop: "32px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFindClick}
                        style={{ marginTop: 16, marginBottom: "40px", width: 200, height: 48, color: "black" }}
                    >
                        Find
                    </Button>
                    {loading && <LinearProgress sx={{ height: 10 }} />}

                    {!hasMore && (
                        <Typography variant="subtitle1" color="textSecondary">
                            You've reached the end of the list.
                        </Typography>
                    )}
                </Container>
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: "40px" }}>
                    {dogs.map((dog, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                            key={dog.id}
                            ref={index === dogs.length - 1 ? lastDogRef : null}
                            style={{ height: "100%", minHeight: "300px" }}
                        >
                            <Card style={{ height: "100%" }}>
                                <CardContent style={{ textAlign: "center", height: "100%" }}>
                                    {dog.primary_photo_cropped ? (
                                        <img
                                            src={dog.primary_photo_cropped.full}
                                            alt={dog.name}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <Typography>No photo available</Typography>
                                    )}
                                    <Typography variant="h6" style={{ textAlign: "center" }}>
                                        Name: {dog.name}
                                    </Typography>
                                    <Typography style={{ textAlign: "center" }}>Breed: {dog.breeds.primary}</Typography>
                                    <Typography style={{ textAlign: "center" }}>Age: {dog.age}</Typography>
                                    <Typography style={{ textAlign: "center" }}>Gender: {dog.gender}</Typography>
                                    <Typography style={{ textAlign: "center" }}>Size: {dog.size}</Typography>
                                    <Typography style={{ textAlign: "left" }}>
                                        Description: {dog.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ color: "black" }}
                                        onClick={() => window.open(dog.url, "_blank", "noopener noreferrer")}
                                    >
                                        Adopt Me!
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default FindDog;
