import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Claude API credentials are not configured");
}

const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default claude;
