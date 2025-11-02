import { GoogleGenAI, Type } from "@google/genai";
import { CoinData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const coinSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'Full name of the cryptocurrency, e.g., "Bitcoin".',
    },
    symbol: {
      type: Type.STRING,
      description: 'The ticker symbol for the cryptocurrency, e.g., "BTC".',
    },
    volatility1hPercentage: {
      type: Type.NUMBER,
      description: 'The percentage price change in the last hour, e.g., 5.25 for +5.25% or -3.1 for -3.1%.',
    },
    reason: {
      type: Type.STRING,
      description: 'A brief, one-sentence explanation for the high volatility.',
    },
    currentPrice: {
      type: Type.NUMBER,
      description: 'The current market price of the cryptocurrency in USD.',
    },
    volume24h: {
        type: Type.NUMBER,
        description: 'The trading volume over the last 24 hours in USD.',
    }
  },
  required: ['name', 'symbol', 'volatility1hPercentage', 'reason', 'currentPrice', 'volume24h'],
};

export const fetchVolatileCoins = async (): Promise<CoinData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `List the top 12 cryptocurrencies on the Binance exchange with the highest price volatility in the last hour. For each coin, provide: its name, symbol, current price in USD, the 1-hour price change percentage, the 24-hour trading volume in USD, and a brief reason for its volatility.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: coinSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        throw new Error("Received malformed data from the AI. Expected an array of coins.");
    }
    
    // Sort data by the absolute volatility percentage, descending
    return (data as CoinData[]).sort((a, b) => Math.abs(b.volatility1hPercentage) - Math.abs(a.volatility1hPercentage));
  } catch (error) {
    console.error("Error fetching volatile coins:", error);
    throw new Error("Failed to fetch data from the Gemini API. Please check your API key and network connection.");
  }
};