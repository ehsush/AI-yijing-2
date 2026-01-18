import { GoogleGenAI, Type } from "@google/genai";
import { HexagramData, LineResult, DetailedAnalysis, LibraryDetail } from "../types";
import { getMovingLinesDescription } from "../utils/iching";

let aiClient: GoogleGenAI | null = null;

const LIB_CACHE_KEY_PREFIX = 'iching_lib_v1_';
const DIV_CACHE_KEY_PREFIX = 'iching_div_v1_';

const getClient = () => {
    if (!aiClient && process.env.API_KEY) {
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiClient;
};

// Cache Helpers
const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn("Cache read error", e);
  }
  return null;
};

const saveToCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
     console.warn("Cache write error", e);
  }
};

const mockDetailedInterpretation: DetailedAnalysis = {
    concreteStrategy: "时机未到，建议韬光养晦，切勿轻举妄动。",
    original: "乾。元，亨，利，贞。\n象曰：天行健，君子以自强不息。",
    vernacular: "乾卦：大吉大利，吉利的贞卜。\n《象辞》说：天道刚健，运行不已。君子观此卦象，从而以天为法，自强不息。",
    masterQuotes: {
        summary: "刚健旺盛，发育之功；完事顺利，谨防太强。",
        advice: "宜把握机会，争取成果，但忌过于刚直。"
    },
    traditional: {
        description: "天行刚健，自强不息。",
        career: "大吉大利，万事如意，但阳气已达顶点，盛极必衰。",
        business: "十分顺利，有发展向上的大好机会。",
        fame: "潜在能力尚未充分发挥，只要进一步努力，必成君子之名。",
        love: "阳盛阴衰，但刚柔可相济，形成美满结果。",
        decision: "可成就大的事业。坚持刚健、正直、公允的实质。"
    },
    zhangMingren: {
        explanation: "刚健稳固。",
        characteristics: "积极，刚毅，努力，认真，有耐性。",
        luck: "有地位擢升、名利双收之象。",
        family: "繁昌兴隆，须小心口舌之争。",
        sickness: "病情恶化，宜细心调养。",
        lost: "可望寻回。",
        travel: "利于出行。",
        lawsuit: "宜据理力争。",
        business: "小利可得，大则勿取。"
    },
    lineAnalysis: "初九：潜龙，勿用。此时应坚定信念，隐忍待机。"
};

const mockLibraryDetail: LibraryDetail = {
    originalText: "数据加载中...",
    philosophy: "AI正在深度解析卦象哲理...",
    divinationMeaning: "正在读取占卜含义..."
};

// Main Divination Analysis
export const generateInterpretation = async (
  question: string,
  primary: HexagramData,
  relating: HexagramData | undefined,
  lines: LineResult[]
): Promise<DetailedAnalysis> => {
  
  // 1. Generate Cache Key
  const signature = `${primary.number}-${relating?.number || 0}-${lines.map(l=>l.sum).join('')}-${question.trim()}`;
  const cacheKey = DIV_CACHE_KEY_PREFIX + signature;

  // 2. Check Cache
  const cached = getFromCache<DetailedAnalysis>(cacheKey);
  if (cached) {
      console.log("Hit Divination Cache");
      return cached;
  }

  const client = getClient();
  if (!client) return mockDetailedInterpretation;

  const movingDesc = getMovingLinesDescription(lines);

  // Optimized Prompt: Explicitly ask for conciseness to speed up generation
  const prompt = `
    作为周易大师，请快速解析"${question}"。
    本卦:${primary.name}(${primary.nature}), 变卦:${relating ? relating.name : "无"}, 动爻:${movingDesc || "无"}。

    JSON输出，严禁Markdown，内容需简练深刻：
    1.concreteStrategy: 一句具体可行方针。
    2.original: 原文。
    3.vernacular: 白话。
    4.masterQuotes: {summary:综合断语, advice:核心告诫}。
    5.traditional: {description:大象, career:事业, business:经商, fame:求名, love:婚恋, decision:决策}。
    6.zhangMingren: {explanation:解释, characteristics:特性, luck:运势, family:家运, sickness:疾病, lost:失物, travel:外出, lawsuit:诉讼, business:买卖}。
    7.lineAnalysis: 动爻或卦辞精解。
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      concreteStrategy: { type: Type.STRING },
      original: { type: Type.STRING },
      vernacular: { type: Type.STRING },
      masterQuotes: {
          type: Type.OBJECT,
          properties: {
              summary: { type: Type.STRING },
              advice: { type: Type.STRING }
          }
      },
      traditional: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          career: { type: Type.STRING },
          business: { type: Type.STRING },
          fame: { type: Type.STRING },
          love: { type: Type.STRING },
          decision: { type: Type.STRING },
        }
      },
      zhangMingren: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          characteristics: { type: Type.STRING },
          luck: { type: Type.STRING },
          family: { type: Type.STRING },
          sickness: { type: Type.STRING },
          lost: { type: Type.STRING },
          travel: { type: Type.STRING },
          lawsuit: { type: Type.STRING },
          business: { type: Type.STRING },
        }
      },
      lineAnalysis: { type: Type.STRING }
    },
    required: ["concreteStrategy", "original", "vernacular", "masterQuotes", "traditional", "zhangMingren", "lineAnalysis"]
  };

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const result = JSON.parse(response.text!) as DetailedAnalysis;
    saveToCache(cacheKey, result); // Save to cache
    return result;
  } catch (error) {
    console.error("AI Error:", error);
    return mockDetailedInterpretation;
  }
};

// Library Detail Analysis
export const generateLibraryDetail = async (hexagram: HexagramData): Promise<LibraryDetail> => {
    const cacheKey = LIB_CACHE_KEY_PREFIX + hexagram.number;
    const cached = getFromCache<LibraryDetail>(cacheKey);
    if (cached) {
        console.log("Hit Library Cache");
        return cached;
    }

    const client = getClient();
    if (!client) return mockLibraryDetail;

    const prompt = `
      解析周易第${hexagram.number}卦：${hexagram.name}。
      JSON输出：
      1.originalText: 原文与白话。
      2.philosophy: 哲学解析(200字内)。
      3.divinationMeaning: 占卜含义(150字内)。
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            originalText: { type: Type.STRING },
            philosophy: { type: Type.STRING },
            divinationMeaning: { type: Type.STRING }
        }
    };

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        const result = JSON.parse(response.text!) as LibraryDetail;
        saveToCache(cacheKey, result);
        return result;
    } catch (error) {
        return mockLibraryDetail;
    }
};