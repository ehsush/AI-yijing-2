import { LineResult, LineValue, HexagramData } from '../types';
import { getHexagram } from '../constants';

export const tossCoins = (): LineResult => {
  // 3 coins. 3=Yang(Head), 2=Yin(Tail).
  // Probability: 50/50 for each coin.
  const coins: [number, number, number] = [
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
  ];

  const sum = coins.reduce((a, b) => a + b, 0) as LineValue;
  
  // 6: Old Yin (Changing to Yang)
  // 7: Young Yang (Static Yang)
  // 8: Young Yin (Static Yin)
  // 9: Old Yang (Changing to Yin)
  
  let isYang = false;
  let isChanging = false;
  let changedToYang = false;

  if (sum === 7 || sum === 9) isYang = true;
  if (sum === 6 || sum === 9) isChanging = true;
  
  // Determine Changed State
  if (sum === 6) changedToYang = true; // Yin -> Yang
  if (sum === 9) changedToYang = false; // Yang -> Yin
  if (sum === 7) changedToYang = true; // Stays Yang
  if (sum === 8) changedToYang = false; // Stays Yin

  return { coins, sum, isYang, isChanging, changedToYang };
};

export const calculateHexagrams = (lines: LineResult[]) => {
  // Primary: Based on original 'isYang'
  const primaryBinary = lines.map(l => l.isYang ? '1' : '0').join('');
  
  // Relating: Based on 'changedToYang'
  const relatingBinary = lines.map(l => l.changedToYang ? '1' : '0').join('');
  
  const hasMovingLines = lines.some(l => l.isChanging);

  return {
    primary: getHexagram(primaryBinary),
    relating: hasMovingLines ? getHexagram(relatingBinary) : undefined,
    hasMovingLines
  };
};

export const getMovingLinesDescription = (lines: LineResult[]) => {
    return lines.map((l, idx) => {
        if (!l.isChanging) return null;
        const positionNames = ["初", "二", "三", "四", "五", "上"];
        const nature = l.sum === 6 ? "老阴" : "老阳";
        return `${positionNames[idx]}爻动 (${nature})`;
    }).filter(Boolean).join("，");
}