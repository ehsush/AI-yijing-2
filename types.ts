export enum TabKey {
  Home = 'home',
  Divination = 'divination',
  Library = 'library',
  Profile = 'profile'
}

export type LineValue = 6 | 7 | 8 | 9;

export interface LineResult {
  coins: [number, number, number]; // 2 (Yin/Tail) or 3 (Yang/Head)
  sum: LineValue;
  isYang: boolean;
  isChanging: boolean;
  changedToYang: boolean;
}

export interface HexagramData {
  number: number;
  name: string;
  binary: string; // Bottom to Top, 0=Yin, 1=Yang
  judgment: string; // 卦辞 excerpt
  nature: string; // e.g. "元亨利贞"
  description: string;
}

// Full Text Structure for Library
export interface HexagramTextDetail extends HexagramData {
    fullJudgment: string; // 完整卦辞
    image: string; // 象传
    lines: {
        position: number; // 1-6
        name: string; // 初九, 六二 etc.
        text: string; // 爻辞
        image?: string; // 小象
        nature: '刚' | '柔';
    }[];
}

export interface DetailedAnalysis {
  concreteStrategy: string; // 具体方针指南
  original: string;    // 卦辞原文
  vernacular: string;  // 白话解释
  masterQuotes: {      // 精简后的大师断语
     summary: string;  // 综合断语
     advice: string;   // 核心告诫
  }; 
  traditional: {       // 传统解卦
    description: string;
    career: string;
    business: string;
    fame: string;
    love: string;
    decision: string;
  };
  zhangMingren: {      // 张铭仁解
    explanation: string; // 解释
    characteristics: string; // 特性
    luck: string;       // 运势
    family: string;     // 家运
    sickness: string;   // 疾病
    lost: string;       // 失物/寻人
    travel: string;     // 外出
    lawsuit: string;    // 诉讼
    business: string;   // 买卖
  };
  lineAnalysis: string; // 针对动爻的详解
}

export interface LibraryDetail {
    originalText: string;  // 易经原文及白话
    philosophy: string;    // 深度解析
    divinationMeaning: string; // 占卜中的含义
}

export interface DivinationRecord {
  id: string;
  date: string;
  question: string;
  lines: LineResult[];
  primaryHexagram: HexagramData;
  relatingHexagram?: HexagramData;
  aiInterpretation?: DetailedAnalysis;
}

// Navigation Params
export interface LibraryTarget {
    hexagramId: number;
    highlightLine?: number; // 0 for judgment, 1-6 for lines
}