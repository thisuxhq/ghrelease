import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
