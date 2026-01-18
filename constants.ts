import { HexagramData, HexagramTextDetail } from './types';

// 文王卦序 (King Wen Sequence) Complete 1-64
// Binary is Bottom -> Top (0=Yin, 1=Yang)
export const HEXAGRAMS: HexagramData[] = [
  { number: 1, name: "乾", binary: "111111", judgment: "元亨利贞。", nature: "刚健中正", description: "天行健，君子以自强不息。" },
  { number: 2, name: "坤", binary: "000000", judgment: "元亨，利牝马之贞。", nature: "厚德载物", description: "地势坤，君子以厚德载物。" },
  { number: 3, name: "屯", binary: "100010", judgment: "元亨，利贞。", nature: "万物始生", description: "云雷屯，君子以经纶。" },
  { number: 4, name: "蒙", binary: "010001", judgment: "亨。匪我求童蒙，童蒙求我。", nature: "启蒙智慧", description: "山下出泉，蒙；君子以果行育德。" },
  { number: 5, name: "需", binary: "111010", judgment: "有孚，光亨，贞吉。", nature: "饮食宴乐", description: "云上于天，需；君子以饮食宴乐。" },
  { number: 6, name: "讼", binary: "010111", judgment: "有孚，窒惕，中吉。", nature: "慎争戒讼", description: "天与水违行，讼；君子以作事谋始。" },
  { number: 7, name: "师", binary: "010000", judgment: "贞，丈人吉，无咎。", nature: "行军用师", description: "地中有水，师；君子以容民畜众。" },
  { number: 8, name: "比", binary: "000010", judgment: "吉。原筮，元永贞。", nature: "亲密比辅", description: "地上有水，比；先王以建万国，亲诸侯。" },
  { number: 9, name: "小畜", binary: "111011", judgment: "亨。密云不雨。", nature: "蓄养待进", description: "风行天上，小畜；君子以懿文德。" },
  { number: 10, name: "履", binary: "110111", judgment: "履虎尾，不咥人，亨。", nature: "礼仪规范", description: "上天下泽，履；君子以辨上下，定民志。" },
  { number: 11, name: "泰", binary: "111000", judgment: "小往大来，吉，亨。", nature: "通达安泰", description: "天地交，泰；后以财成天地之道。" },
  { number: 12, name: "否", binary: "000111", judgment: "否之匪人，不利君子贞。", nature: "闭塞不通", description: "天地不交，否；君子以俭德辟难。" },
  { number: 13, name: "同人", binary: "101111", judgment: "同人于野，亨。", nature: "上下和同", description: "天与火，同人；君子以类族辨物。" },
  { number: 14, name: "大有", binary: "111101", judgment: "元亨。", nature: "盛大丰有", description: "火在天上，大有；君子以遏恶扬善。" },
  { number: 15, name: "谦", binary: "001000", judgment: "亨，君子有终。", nature: "谦虚受益", description: "地中有山，谦；君子以裒多益寡。" },
  { number: 16, name: "豫", binary: "000100", judgment: "利建侯行师。", nature: "和乐豫悦", description: "雷出地奋，豫；先王以作乐崇德。" },
  { number: 17, name: "随", binary: "100110", judgment: "元亨利贞，无咎。", nature: "随顺时势", description: "泽中有雷，随；君子以向晦入宴息。" },
  { number: 18, name: "蛊", binary: "011001", judgment: "元亨，利涉大川。", nature: "振疲起衰", description: "山下有风，蛊；君子以振民育德。" },
  { number: 19, name: "临", binary: "110000", judgment: "元亨利贞。", nature: "督导亲临", description: "泽上有地，临；君子以教思无穷。" },
  { number: 20, name: "观", binary: "000011", judgment: "盥而不荐，有孚颙若。", nature: "观摩省察", description: "风行地上，观；先王以省方，观民设教。" },
  { number: 21, name: "噬嗑", binary: "100101", judgment: "亨。利用狱。", nature: "刑法整治", description: "雷电，噬嗑；先王以明罚敕法。" },
  { number: 22, name: "贲", binary: "101001", judgment: "亨。小利有攸往。", nature: "文饰美化", description: "山下有火，贲；君子以明庶政。" },
  { number: 23, name: "剥", binary: "000001", judgment: "不利有攸往。", nature: "剥落侵蚀", description: "山附于地，剥；上以厚下，安宅。" },
  { number: 24, name: "复", binary: "100000", judgment: "亨。出入无疾。", nature: "万物复兴", description: "雷在地中，复；先王以至日闭关。" },
  { number: 25, name: "无妄", binary: "100111", judgment: "元亨利贞。", nature: "真实无妄", description: "天下雷行，物与无妄；先王以茂对时。" },
  { number: 26, name: "大畜", binary: "111001", judgment: "利贞。不家食吉。", nature: "大有积蓄", description: "天在山中，大畜；君子以多识前言。" },
  { number: 27, name: "颐", binary: "100001", judgment: "贞吉。观颐，自求口实。", nature: "颐养之道", description: "山下有雷，颐；君子以慎言语，节饮食。" },
  { number: 28, name: "大过", binary: "011110", judgment: "栋桡，利有攸往，亨。", nature: "非常之举", description: "泽灭木，大过；君子以独立不惧。" },
  { number: 29, name: "坎", binary: "010010", judgment: "习坎，有孚，维心亨。", nature: "险阻重重", description: "水流而不盈，行险而不失其信。" },
  { number: 30, name: "离", binary: "101101", judgment: "利贞，亨。", nature: "附丽光明", description: "明两作，离；大人以继明照于四方。" },
  { number: 31, name: "咸", binary: "001110", judgment: "亨，利贞，取女吉。", nature: "感应沟通", description: "山上有泽，咸；君子以虚受人。" },
  { number: 32, name: "恒", binary: "011100", judgment: "亨，无咎，利贞。", nature: "恒久之道", description: "雷风，恒；君子以立不易方。" },
  { number: 33, name: "遁", binary: "001111", judgment: "亨，小利贞。", nature: "退避保身", description: "天下有山，遁；君子以远小人。" },
  { number: 34, name: "大壮", binary: "111100", judgment: "利贞。", nature: "壮大强盛", description: "雷在天上，大壮；君子以非礼弗履。" },
  { number: 35, name: "晋", binary: "000101", judgment: "康侯用锡马蕃庶。", nature: "晋升进取", description: "明出地上，晋；君子以自昭明德。" },
  { number: 36, name: "明夷", binary: "101000", judgment: "利艰贞。", nature: "晦暗蒙难", description: "明入地中，明夷；君子以莅众，用晦而明。" },
  { number: 37, name: "家人", binary: "101011", judgment: "利女贞。", nature: "诚威治业", description: "风自火出，家人；君子以言有物，行有恒。" },
  { number: 38, name: "睽", binary: "110101", judgment: "小事吉。", nature: "乖离异同", description: "上火下泽，睽；君子以同而异。" },
  { number: 39, name: "蹇", binary: "001010", judgment: "利西南，不利东北。", nature: "险阻艰难", description: "山上有水，蹇；君子以反身修德。" },
  { number: 40, name: "解", binary: "010100", judgment: "利西南。", nature: "解除困难", description: "雷雨作，解；君子以赦过宥罪。" },
  { number: 41, name: "损", binary: "110001", judgment: "有孚，元吉，无咎。", nature: "损下益上", description: "山下有泽，损；君子以惩忿窒欲。" },
  { number: 42, name: "益", binary: "100011", judgment: "利有攸往，利涉大川。", nature: "损上益下", description: "风雷，益；君子以见善则迁，有过则改。" },
  { number: 43, name: "夬", binary: "111110", judgment: "扬于王庭，孚号，有厉。", nature: "决断清除", description: "泽上于天，夬；君子以施禄及下。" },
  { number: 44, name: "姤", binary: "011111", judgment: "女壮，勿用取女。", nature: "相遇邂逅", description: "天下有风，姤；后以施命诰四方。" },
  { number: 45, name: "萃", binary: "000110", judgment: "亨。王假有庙。", nature: "聚集精英", description: "泽上于地，萃；君子以除戎器，戒不虞。" },
  { number: 46, name: "升", binary: "011000", judgment: "元亨，用见大人。", nature: "顺势上升", description: "地中生木，升；君子以顺德，积小以高大。" },
  { number: 47, name: "困", binary: "010110", judgment: "亨，贞，大人吉。", nature: "困境磨练", description: "泽无水，困；君子以致命遂志。" },
  { number: 48, name: "井", binary: "011010", judgment: "改邑不改井。", nature: "养贤惠民", description: "木上有水，井；君子以劳民劝相。" },
  { number: 49, name: "革", binary: "101110", judgment: "已日乃孚，元亨。", nature: "顺天应人", description: "泽中有火，革；君子以治历明时。" },
  { number: 50, name: "鼎", binary: "011101", judgment: "元吉，亨。", nature: "稳重图变", description: "木上有火，鼎；君子以正位凝命。" },
  { number: 51, name: "震", binary: "100100", judgment: "亨。震来虩虩。", nature: "临危不乱", description: "荐雷，震；君子以恐惧修省。" },
  { number: 52, name: "艮", binary: "001001", judgment: "艮其背，不获其身。", nature: "动静适时", description: "兼山，艮；君子以思不出其位。" },
  { number: 53, name: "渐", binary: "001011", judgment: "女归吉，利贞。", nature: "循序渐进", description: "山上有木，渐；君子以居贤德善俗。" },
  { number: 54, name: "归妹", binary: "110100", judgment: "征凶，无攸利。", nature: "违反常理", description: "泽上有雷，归妹；君子以永终知敝。" },
  { number: 55, name: "丰", binary: "101100", judgment: "亨，王假之。", nature: "盛大丰满", description: "雷电皆至，丰；君子以折狱致刑。" },
  { number: 56, name: "旅", binary: "001101", judgment: "小亨，旅贞吉。", nature: "依义顺时", description: "山上有火，旅；君子以明慎用刑。" },
  { number: 57, name: "巽", binary: "011011", judgment: "小亨，利有攸往。", nature: "谦逊受益", description: "随风，巽；君子以申命行事。" },
  { number: 58, name: "兑", binary: "110110", judgment: "亨，利贞。", nature: "喜悦沟通", description: "丽泽，兑；君子以朋友讲习。" },
  { number: 59, name: "涣", binary: "010011", judgment: "亨。王假有庙。", nature: "拯救涣散", description: "风行水上，涣；先王以享于帝立庙。" },
  { number: 60, name: "节", binary: "110010", judgment: "亨。苦节不可贞。", nature: "节制调节", description: "泽上有水，节；君子以制数度，议德行。" },
  { number: 61, name: "中孚", binary: "110011", judgment: "豚鱼吉，利涉大川。", nature: "诚信感通", description: "泽上有风，中孚；君子以议狱缓死。" },
  { number: 62, name: "小过", binary: "001100", judgment: "亨，利贞。", nature: "行动有度", description: "山上有雷，小过；君子以行过乎恭。" },
  { number: 63, name: "既济", binary: "101010", judgment: "亨，小利贞。", nature: "盛极将衰", description: "水在火上，既济；君子以思患而预防之。" },
  { number: 64, name: "未济", binary: "010101", judgment: "亨，小狐汔济。", nature: "生生不息", description: "火在水上，未济；君子以慎辨物居方。" }
];

export const getHexagram = (binary: string): HexagramData => {
  const found = HEXAGRAMS.find(h => h.binary === binary);
  if (found) return found;
  return { number: 0, name: "未知", binary, judgment: "", nature: "", description: "" };
};

export const getHexagramByNumber = (num: number): HexagramData | undefined => {
    return HEXAGRAMS.find(h => h.number === num);
};

// --- Full Text Data (Sampled for Demo, others are placeholders to save space) ---

const SAMPLE_DETAILS: Record<number, HexagramTextDetail> = {
    1: {
        ...HEXAGRAMS[0],
        fullJudgment: "乾：元，亨，利，贞。",
        image: "天行健，君子以自强不息。",
        lines: [
            { position: 1, name: "初九", text: "潜龙，勿用。", nature: "刚", image: "潜龙勿用，阳在下也。" },
            { position: 2, name: "九二", text: "见龙在田，利见大人。", nature: "刚", image: "见龙在田，德施普也。" },
            { position: 3, name: "九三", text: "君子终日乾乾，夕惕若厉，无咎。", nature: "刚", image: "终日乾乾，反复道也。" },
            { position: 4, name: "九四", text: "或跃在渊，无咎。", nature: "刚", image: "或跃在渊，进无咎也。" },
            { position: 5, name: "九五", text: "飞龙在天，利见大人。", nature: "刚", image: "飞龙在天，大人造也。" },
            { position: 6, name: "上九", text: "亢龙，有悔。", nature: "刚", image: "亢龙有悔，盈不可久也。" }
        ]
    },
    2: {
        ...HEXAGRAMS[1],
        fullJudgment: "坤：元，亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞，吉。",
        image: "地势坤，君子以厚德载物。",
        lines: [
            { position: 1, name: "初六", text: "履霜，坚冰至。", nature: "柔", image: "履霜坚冰，阴始凝也。" },
            { position: 2, name: "六二", text: "直，方，大，不习无不利。", nature: "柔", image: "六二之动，直以方也。" },
            { position: 3, name: "六三", text: "含章可贞。或从王事，无成有终。", nature: "柔", image: "含章可贞，以时发也。" },
            { position: 4, name: "六四", text: "括囊，无咎无誉。", nature: "柔", image: "括囊无咎，慎不害也。" },
            { position: 5, name: "六五", text: "黄裳，元吉。", nature: "柔", image: "黄裳元吉，文在中也。" },
            { position: 6, name: "上六", text: "龙战于野，其血玄黄。", nature: "柔", image: "龙战于野，其道穷也。" }
        ]
    },
    11: {
        ...HEXAGRAMS[10],
        fullJudgment: "泰：小往大来，吉，亨。",
        image: "天地交，泰。后以财成天地之道，辅相天地之宜，以左右民。",
        lines: [
            { position: 1, name: "初九", text: "拔茅茹，以其汇，征吉。", nature: "刚", image: "拔茅征吉，志在外也。" },
            { position: 2, name: "九二", text: "包荒，用冯河，不遐遗，朋亡，得尚于中行。", nature: "刚", image: "包荒，得尚于中行，以光大也。" },
            { position: 3, name: "九三", text: "无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福。", nature: "刚", image: "无往不复，天地际也。" },
            { position: 4, name: "六四", text: "翩翩，不富以其邻，不戒以孚。", nature: "柔", image: "翩翩不富，皆失实也。" },
            { position: 5, name: "六五", text: "帝乙归妹，以祉元吉。", nature: "柔", image: "以祉元吉，中以行愿也。" },
            { position: 6, name: "上六", text: "城复于隍，勿用师。自邑告命，贞吝。", nature: "柔", image: "城复于隍，其命乱也。" }
        ]
    }
};

// Helper to get full detail, with fallback for missing data
export const getHexagramDetail = (number: number): HexagramTextDetail => {
    if (SAMPLE_DETAILS[number]) return SAMPLE_DETAILS[number];
    
    // Fallback generator for other hexagrams
    const base = HEXAGRAMS.find(h => h.number === number)!;
    return {
        ...base,
        fullJudgment: base.judgment + " (此处为示例数据，完整版请连接数据库)",
        image: base.description,
        lines: Array.from({length: 6}, (_, i) => ({
            position: i + 1,
            name: ["初", "二", "三", "四", "五", "上"][i] + (parseInt(base.binary[i]) ? "九" : "六"),
            text: "（暂无爻辞数据，请补充）",
            nature: parseInt(base.binary[i]) ? "刚" : "柔"
        }))
    };
};