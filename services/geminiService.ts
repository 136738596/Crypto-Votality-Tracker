import { GoogleGenAI } from "@google/genai";
import { CoinData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchVolatileCoins = async (): Promise<CoinData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Using Google Search to find the latest real-time data, list the top 12 cryptocurrencies on the Binance exchange with the highest price volatility in the last hour. Respond ONLY with a JSON array of objects. Each object must represent a coin and contain these exact keys: "name", "symbol", "currentPrice" (number, in USD), "volatility1hPercentage" (number, e.g., 5.25 for +5.25% or -3.1 for -3.1%), "volume24h" (number, in USD), and "reason" (string, a brief explanation for the volatility). Do not include any text, titles, or markdown formatting before or after the JSON array.`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    // Clean the response to ensure it's valid JSON, removing potential markdown fences
    const jsonText = response.text.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
    const data = JSON.parse(jsonText);
    
    if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        throw new Error("Received malformed data from the AI. Expected an array of coins.");
    }
    
    // Sort data by the absolute volatility percentage, descending
    return (data as CoinData[]).sort((a, b) => Math.abs(b.volatility1hPercentage) - Math.abs(a.volatility1hPercentage));
  } catch (error) {
    console.error("Error fetching volatile coins:", error);
    // Provide a more specific error message if parsing fails
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the data from the AI. The response was not valid JSON.");
    }
    throw new Error("Failed to fetch data from the Gemini API. Please check your network connection.");
  }
};