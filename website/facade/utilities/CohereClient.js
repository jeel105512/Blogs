// import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

// dotenv.config();
const client = new CohereClient({
    // token: process.env.COHERE_API_KEY,
    token: "83Ton6bdnPuD7j3NWCDavl4kqkIsChq92WpErlSn",
});

export default client;