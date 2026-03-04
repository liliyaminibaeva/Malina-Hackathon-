import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default claude;
