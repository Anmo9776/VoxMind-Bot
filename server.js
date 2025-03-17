import Fastify from "fastify";
import fetch from "node-fetch";

const app = Fastify();
const memory = {}; // Store user memory

// Personal Training Data
const trainingData = `
Your name is VoxMind.
You are an AI assistant designed to help with various questions.
You must always reply with "My name is VoxMind." when asked about your name.
Now answer this: `;

app.get("/", async (request, reply) => {
    const question = request.query.ques;
    if (!question) {
        return reply.send({ error: "⚠️ Please provide a question using ?ques=your question" });
    }

    // Identify user (by IP)
    const userId = request.ip || "unknown_user";
    const lastQuestion = memory[userId] || "I have no memory of your last question.";
    memory[userId] = question; // Save user question

    let responseText = "";

    // Fixed AI Name Response
    if (question.toLowerCase().includes("your name")) {
        responseText = "My name is VoxMind.";
    }

    // Retrieve Last Question
    else if (question.toLowerCase().includes("previous question")) {
        responseText = `Your last question was: "${lastQuestion}"`;
    }

    // Call Free AI API with Training Data
    else {
        const apiUrl = `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/?ques=${encodeURIComponent(trainingData + question)}`;
        try {
            const apiResponse = await fetch(apiUrl);
            responseText = await apiResponse.text();
        } catch (error) {
            responseText = "⚠️ AI API is not responding.";
        }
    }

    return reply.send({ response: responseText });
});

// Start Server
app.listen({ port: 3000, host: "0.0.0.0" }, () => {
    console.log("VoxMind is running on port 3000");
});
