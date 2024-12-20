import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send('Hello from Codex!');
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      store: true,
      model: "gpt-4o-mini",
      prompt: `${prompt} `,
      temperature: 0,
      max_completion_tokens: 2048, // 3000
      response_format: {
        "type": "text"
      },
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      messages: [
        {"role": "user", "content": "write a haiku about ai"},
      ],
    });

    res.status(200).send({
      bot: response.data.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
})

app.listen(3001, () => console.log('Server is running on http://localhost:3001'));