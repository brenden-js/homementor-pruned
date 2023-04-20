import { Configuration, OpenAIApi} from "openai"

// OpenAI configuration creation
const configuration = new Configuration({
    apiKey: process.env.OPENAI_SECRET_KEY,
});
// OpenAI instance creation
export const openai = new OpenAIApi(configuration);