import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { isTestEnvironment } from "../constants";

// Initialize OpenAI provider with your API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Normal chat model
        "chat-model": openai.languageModel("gpt-4o-mini"),

        // Chat model with reasoning middleware
        "chat-model-reasoning": wrapLanguageModel({
          model: openai.languageModel("gpt-4o"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // Title model (lightweight, cheap model)
        "title-model": openai.languageModel("gpt-4o-mini"),

        // Artifact model (use full GPT-4o or similar)
        "artifact-model": openai.languageModel("gpt-4o"),
      },
    });
