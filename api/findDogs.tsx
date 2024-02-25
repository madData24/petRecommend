import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        res.status(200).json({ animals });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
