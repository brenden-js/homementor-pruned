import { OpenAIStream, type OpenAIStreamPayload } from "~/utils/OpenAIStream";

if (!process.env.OPENAI_SECRET_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { house, question } = (await req.json()) as {
    house?: string,
    question?: string,
  };

  if (!house || !question) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{role: "system", content: "You are a real estate agent who makes recommendations about houses to the user."}, { role: "user", content: `Answer this question: ${question}, about the following house ${house}` }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
