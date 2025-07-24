// Potential Quotient Calculator - Data Structure
// 7 Dimensions with 49 scientifically-crafted questions

export interface LocalizedString {
  en: string;
  am: string;
}

export interface Question {
  id: string;
  dimension: string;
  subFactor: string;
  type: 'likert' | 'scenario' | 'ranking' | 'binary' | 'slider';
  content: LocalizedString;
  options?: QuestionOption[];
  scoring: ScoringRule;
  timeLimit?: number;
  visualAid?: string;
}

export interface QuestionOption {
  value: number;
  label: LocalizedString;
  id?: string;
}

export interface ScoringRule {
  type: 'direct' | 'weighted' | 'ranking_matrix' | 'percentage';
  maxPoints: number;
  weights?: number[];
  optimalOrder?: string[];
}

export interface PotentialDimension {
  id: string;
  name: LocalizedString;
  storytellingName: LocalizedString;
  tagline: LocalizedString;
  weight: number;
  description: LocalizedString;
  subFactors: string[];
  color: string;
  icon: string;
  whyItMatters: LocalizedString;
  funFact: LocalizedString;
}

// The 7 Superpowers - Revolutionary Storytelling Approach
export const dimensions: PotentialDimension[] = [
  {
    id: "growth_power",
    name: { 
      en: "Growth Power", 
      am: "የእድገት ኃይል" 
    },
    storytellingName: {
      en: "🌱 Growth Power",
      am: "🌱 የእድገት ኃይል"
    },
    tagline: {
      en: "Your ability to level up from any experience",
      am: "ከማንኛውም ተሞክሮ የመማር እና የማደግ ችሎታዎ"
    },
    weight: 0.20,
    description: { 
      en: "Your superpower for turning challenges into growth opportunities",
      am: "ፈተናዎችን ወደ እድገት እድሎች የመቀየር ልዩ ኃይልዎ" 
    },
    subFactors: ["challenge_embrace", "effort_belief", "failure_perception"],
    color: "#10B981", // Emerald
    icon: "🌱",
    whyItMatters: {
      en: "Growth Power determines how quickly you evolve and adapt. People with high Growth Power recover 73% faster from setbacks.",
      am: "የእድገት ኃይል ምን ያህል በፍጥነት እንደምታደግ እና እንደምትላመድ ይወስናል። ከፍተኛ የእድገት ኃይል ያላቸው ሰዎች ከውድቀት በ73% ፍጥነት ይማሉ።"
    },
    funFact: {
      en: "Your brain creates new neural pathways every time you embrace a challenge!",
      am: "አንድ ፈተና ሲቀበሉ አንጎልዎ አዲስ የነርቭ መስመሮችን ይፈጥራል!"
    }
  },
  {
    id: "bounce_power",
    name: { 
      en: "Bounce Power", 
      am: "የመመለስ ኃይል" 
    },
    storytellingName: {
      en: "💪 Bounce Power",
      am: "💪 የመመለስ ኃይል"
    },
    tagline: {
      en: "Your superhero recovery strength",
      am: "የእርስዎ ልዩ የማገገሚያ ኃይል"
    },
    weight: 0.15,
    description: {
      en: "Your superpower to bounce back stronger from any challenge",
      am: "ከማንኛውም ፈተና በበለጠ ጥንካሬ የመመለስ ልዩ ኃይልዎ"
    },
    subFactors: ["emotional_regulation", "stress_management", "adaptability"],
    color: "#EF4444", // Red
    icon: "💪",
    whyItMatters: {
      en: "Bounce Power is your comeback strength. Research shows resilient people live 7 years longer and achieve 40% more goals.",
      am: "የመመለስ ኃይል የመንሳት ጥንካሬዎ ነው። ምርምር እንደሚያሳየው ተቋቋሚ ሰዎች በ7 ዓመት የበለጠ ይኖራሉ እና በ40% የበለጠ ግቦችን ያሳካሉ።"
    },
    funFact: {
      en: "Stress hormones can actually strengthen your brain when you view challenges positively!",
      am: "ፈተናዎችን በአዎንታዊ መንገድ ሲመለከቷቸው የጭንቀት ሆርሞኖች አንጎልዎን ሊያጠናክሩ ይችላሉ!"
    }
  },
  {
    id: "learn_power",
    name: { 
      en: "Learn Power", 
      am: "የመማሪያ ኃይል" 
    },
    storytellingName: {
      en: "🚀 Learn Power",
      am: "🚀 የመማሪያ ኃይል"
    },
    tagline: {
      en: "Your brain's upgrade speed",
      am: "የአንጎልዎ የማሻሻያ ፍጥነት"
    },
    weight: 0.15,
    description: {
      en: "Your superpower for rapid skill acquisition and knowledge mastery",
      am: "ለፈጣን ክህሎት ማግኛ እና እውቀት ማስተዳደር ያለዎት ልዩ ኃይል"
    },
    subFactors: ["curiosity_level", "pattern_recognition", "knowledge_application"],
    color: "#8B5CF6", // Purple
    icon: "🚀",
    whyItMatters: {
      en: "Learn Power accelerates your growth. High learners adapt 5x faster to change and earn 23% more over their lifetime.",
      am: "የመማሪያ ኃይል እድገትዎን ያፋጥናል። ከፍተኛ ተማሪዎች ለለውጥ በ5 እጥፍ ፍጥነት ይላመዳሉ እና በሕይወታቸው ዘመን በ23% የበለጠ ያገኛሉ።"
    },
    funFact: {
      en: "Learning a new skill creates the same brain pleasure response as eating chocolate!",
      am: "አዲስ ችሎታ መማር ቸኮሌት እንደመብላት ተመሳሳይ የአንጎል ደስታ ምላሽ ይፈጥራል!"
    }
  },
  {
    id: "vision_power",
    name: { 
      en: "Vision Power", 
      am: "የራዕይ ኃይል" 
    },
    storytellingName: {
      en: "🎯 Vision Power",
      am: "🎯 የራዕይ ኃይል"
    },
    tagline: {
      en: "Your future-building clarity",
      am: "የወደፊትዎን የመገንባት ግልጽነት"
    },
    weight: 0.15,
    description: {
      en: "Your superpower to see and create compelling futures",
      am: "አሳማኝ የወደፊት ጊዜን የማየት እና የመፍጠር ልዩ ኃይልዎ"
    },
    subFactors: ["goal_specificity", "purpose_alignment", "future_orientation"],
    color: "#3B82F6", // Blue
    icon: "🎯",
    whyItMatters: {
      en: "Vision Power drives achievement. People with clear vision are 42% more likely to achieve their goals and report 67% higher life satisfaction.",
      am: "የራዕይ ኃይል ስኬትን ይመራል። ግልጽ ራዕይ ያላቸው ሰዎች ግቦቻቸውን የማሳካት እድላቸው በ42% ይጨምራል እና በ67% ከፍተኛ የሕይወት እርካታ ያሳያሉ።"
    },
    funFact: {
      en: "Your brain can't distinguish between vividly imagined experiences and real ones!",
      am: "አንጎልዎ በግልጽ በተመነዘረ ተሞክሮ እና በእውነተኛ ተሞክሮ መካከል ለይቶ ማወቅ አይችልም!"
    }
  },
  {
    id: "action_power",
    name: { 
      en: "Action Power", 
      am: "የተግባር ኃይል" 
    },
    storytellingName: {
      en: "⚡ Action Power",
      am: "⚡ የተግባር ኃይል"
    },
    tagline: {
      en: "Your make-it-happen energy",
      am: "የማሳካት ችሎታዎ"
    },
    weight: 0.15,
    description: {
      en: "Your superpower to turn ideas into reality through decisive action",
      am: "ሃሳቦችን በተግባራዊ እርምጃ ወደ እውነታ የመቀየር ልዩ ኃይልዎ"
    },
    subFactors: ["initiative_taking", "procrastination_resistance", "completion_drive"],
    color: "#F59E0B", // Amber
    icon: "⚡",
    whyItMatters: {
      en: "Action Power creates results. High action-takers complete 3x more projects and experience 50% less regret about missed opportunities.",
      am: "የተግባር ኃይል ውጤት ይፈጥራል። ከፍተኛ እርምጃ ወሳጆች በ3 እጥፍ የበለጠ ፕሮጀክቶችን ያጠናቅቃሉ እና ስለጠፉ እድሎች በ50% ያነሰ ንዴት ያጋጥማቸዋል።"
    },
    funFact: {
      en: "Taking action within 72 hours of having an idea increases success rate by 85%!",
      am: "ሃሳብ ካገኙ በኋላ በ72 ሰዓት ውስጥ እርምጃ መውሰድ የስኬት መጠንን በ85% ይጨምራል!"
    }
  },
  {
    id: "connect_power",
    name: { 
      en: "Connect Power", 
      am: "የመገናኘት ኃይል" 
    },
    storytellingName: {
      en: "🤝 Connect Power",
      am: "🤝 የመገናኘት ኃይል"
    },
    tagline: {
      en: "Your human magnetism force",
      am: "የሰው ልጅ መሳቢያ ኃይልዎ"
    },
    weight: 0.10,
    description: {
      en: "Your superpower to build meaningful connections and influence others positively",
      am: "ትርጉም ያላቸውን ግንኙነቶች የመገንባት እና ሌሎችን በአዎንታዊ መንገድ የመነኮስ ልዩ ኃይልዎ"
    },
    subFactors: ["empathy_level", "communication_skill", "relationship_building"],
    color: "#EC4899", // Pink
    icon: "🤝",
    whyItMatters: {
      en: "Connect Power amplifies success. Strong connectors have 5x larger networks, get promoted 25% faster, and report 76% higher happiness.",
      am: "የመገናኘት ኃይል ስኬትን ያጎላል። ጠንካራ አገናኞች በ5 እጥፍ ትልቅ አውታረ መረብ አላቸው፣ በ25% ፍጥነት ያደጋሉ እና በ76% ከፍተኛ ደስታ ያሳያሉ።"
    },
    funFact: {
      en: "Mirror neurons fire in your brain when you genuinely empathize, creating actual neural connections!",
      am: "እውነተኛ ርኅራኄ ሲሰማዎት በአንጎልዎ ውስጥ የመስታወት ነርቮች ይነሳሳሉ፣ ይህም እውነተኛ የነርቭ ግንኙነቶችን ይፈጥራል!"
    }
  },
  {
    id: "create_power",
    name: { 
      en: "Create Power", 
      am: "የፈጠራ ኃይል" 
    },
    storytellingName: {
      en: "✨ Create Power",
      am: "✨ የፈጠራ ኃይል"
    },
    tagline: {
      en: "Your innovation magic",
      am: "የእርስዎ የፈጠራ አስማት"
    },
    weight: 0.10,
    description: {
      en: "Your superpower to generate original solutions and bring new ideas to life",
      am: "ኦሪጅናል መፍትሄዎችን የመፍጠር እና አዳዲስ ሃሳቦችን ወደ ሕይወት የማምጣት ልዩ ኃይልዎ"
    },
    subFactors: ["idea_generation", "risk_tolerance", "innovation_mindset"],
    color: "#6366F1", // Indigo
    icon: "✨",
    whyItMatters: {
      en: "Create Power drives innovation. Creative thinkers solve problems 6x faster and generate 3x more breakthrough solutions in their careers.",
      am: "የፈጠራ ኃይል ፈጠራን ይመራል። ፈጣሪ አስተሳሰብ ያላቸው ሰዎች ችግሮችን በ6 እጥፍ ፍጥነት ይፈታሉ እና በሙያቸው ውስጥ በ3 እጥፍ የበለጠ ታላቅ መፍትሄዎችን ያመጣሉ።"
    },
    funFact: {
      en: "Your most creative ideas often come during mind-wandering - that's why showers spark innovation!",
      am: "ፈጣሪ ሃሳቦችዎ ብዙውን ጊዜ አንጎል በሚንከራተትበት ጊዜ ይመጣሉ - ለዚህም ነው የመታጠቢያ ጊዜ ፈጠራን የሚያነሳሳው!"
    }
  }
];

// 49 Questions (7 per dimension)
export const questions: Question[] = [
  // Growth Mindset Questions (7)
  {
    id: "gm_001",
    dimension: "growth_mindset",
    subFactor: "challenge_embrace",
    type: "likert",
    content: {
      en: "When faced with a difficult challenge, I see it as an opportunity to grow.",
      am: "ከባድ ፈተና ሲገጥመኝ እንደ የማደግ እድል አየዋለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "gm_002",
    dimension: "growth_mindset",
    subFactor: "effort_belief",
    type: "likert",
    content: {
      en: "I believe that my abilities can be developed through dedication and hard work.",
      am: "ችሎታዎቼ በትጋት እና በአድካሚ ሥራ ሊዳበሩ እንደሚችሉ አምናለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "gm_003",
    dimension: "growth_mindset",
    subFactor: "failure_perception",
    type: "scenario",
    content: {
      en: "You've just failed at something important to you. What's your immediate thought?",
      am: "ለእርስዎ አስፈላጊ በሆነ ነገር ላይ አልተሳኩም። የመጀመሪያ ሃሳብዎ ምንድን ነው?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "I'm just not good at this", 
          am: "በዚህ ጥሩ አይደለሁም" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "This is disappointing, but it happens", 
          am: "ይህ አሳዛኝ ነው፣ ግን ይከሰታል" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "What can I learn from this failure?", 
          am: "ከዚህ ውድቀት ምን መማር እችላለሁ?" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "gm_004",
    dimension: "growth_mindset",
    subFactor: "challenge_embrace",
    type: "slider",
    content: {
      en: "How often do you deliberately seek out challenges that stretch your abilities?",
      am: "ችሎታዎችዎን የሚዘረጋ ፈተናዎችን ምን ያህል ጊዜ ሆን ብለው ይፈልጋሉ?"
    },
    options: [
      {
        value: 0,
        label: { en: "Never", am: "በፍፁም" }
      },
      {
        value: 50,
        label: { en: "Sometimes", am: "አንዳንድ ጊዜ" }
      },
      {
        value: 100,
        label: { en: "Always", am: "ሁልጊዜ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "gm_005",
    dimension: "growth_mindset",
    subFactor: "effort_belief",
    type: "likert",
    content: {
      en: "When others succeed, I'm curious about the process they used.",
      am: "ሌሎች ሲሳኩ የተጠቀሙበትን ሂደት ለማወቅ እጓጓለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "gm_006",
    dimension: "growth_mindset",
    subFactor: "failure_perception",
    type: "binary",
    content: {
      en: "Failure is proof that you're pushing your boundaries.",
      am: "ውድቀት ድንበሮችዎን እያሳለፉ መሆንዎ ማረጋገጫ ነው።"
    },
    options: [
      { value: 1, label: { en: "False", am: "ስህተት" }},
      { value: 5, label: { en: "True", am: "እውነት" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "gm_007",
    dimension: "growth_mindset",
    subFactor: "challenge_embrace",
    type: "scenario",
    content: {
      en: "You're offered two projects: one you know you can excel at, another that's uncertain but could teach you a lot. Which do you choose?",
      am: "ሁለት ፕሮጀክቶች ቀርበውልዎታል፡ በአንዱ ላይ መሻሻል እንደሚችሉ የሚያውቁት፣ ሌላው እርግጠኛ ያልሆነ ግን ብዙ ሊያስተምርዎ የሚችል። የትኛውን ይመርጣሉ?"
    },
    options: [
      { 
        value: 2, 
        label: { 
          en: "The one I know I can excel at", 
          am: "መሻሻል እንደምችልበት የማውቀው" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "The uncertain one that could teach me", 
          am: "ሊያስተምረኝ የሚችለው እርግጠኛ ያልሆነው" 
        }
      }
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },

  // Resilience Factor Questions (7)
  {
    id: "rf_001",
    dimension: "resilience_factor",
    subFactor: "emotional_regulation",
    type: "likert",
    content: {
      en: "I can stay calm and focused even when things don't go as planned.",
      am: "ነገሮች እንደታቀደው ሳይሄዱ እንኳ ተረጋግቼ እና ባተኮርኩ መቆየት እችላለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "rf_002",
    dimension: "resilience_factor",
    subFactor: "stress_management",
    type: "scenario",
    content: {
      en: "During a particularly stressful week, what's your typical response?",
      am: "በተለይ ጫና በሚኖርበት ሳምንት የተለመደ ምላሽዎ ምንድን ነው?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "I feel overwhelmed and struggle to function", 
          am: "በጣም ተጨንቄ ለመስራት እቸገራለሁ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "I push through but feel drained", 
          am: "አልፌ እሄዳለሁ ግን ክልክል ይለኛል" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "I prioritize and focus on what matters most", 
          am: "ቅድሚያ በመስጠት በጣም አስፈላጊ በሆነው ላይ አተኩራለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "rf_003",
    dimension: "resilience_factor",
    subFactor: "adaptability",
    type: "likert",
    content: {
      en: "I adapt quickly to unexpected changes in my environment.",
      am: "በአካባቢዬ በሚከሰቱ ሳይጠበቁ ለውጦች በፍጥነት እላመዳለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "rf_004",
    dimension: "resilience_factor",
    subFactor: "emotional_regulation",
    type: "slider",
    content: {
      en: "How well do you manage your emotions during difficult situations?",
      am: "በከባድ ሁኔታዎች ውስጥ ስሜቶችዎን ምን ያህል በጥሩ ሁኔታ ይቆጣጠራሉ?"
    },
    options: [
      {
        value: 0,
        label: { en: "Very poorly", am: "በጣም መጥፎ" }
      },
      {
        value: 50,
        label: { en: "Moderately well", am: "በመጠኑ ጥሩ" }
      },
      {
        value: 100,
        label: { en: "Extremely well", am: "በጣም ጥሩ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "rf_005",
    dimension: "resilience_factor",
    subFactor: "stress_management",
    type: "ranking",
    content: {
      en: "Rank these stress management techniques from most to least effective for you:",
      am: "እነዚህን የጫና አያያዝ ዘዴዎች ለእርስዎ ከሚበልጥ ወደ ሚያንስ ያስቀምጡ:"
    },
    options: [
      { id: "exercise", label: { en: "Physical exercise", am: "የአካል ብቃት እንቅስቃሴ" }},
      { id: "meditation", label: { en: "Meditation/mindfulness", am: "ሜዲቴሽን/ትኩረት" }},
      { id: "social", label: { en: "Talking to friends/family", am: "ከጓደኞች/ቤተሰብ ጋር መነጋገር" }},
      { id: "planning", label: { en: "Planning and organizing", am: "ማቀድ እና ማደራጀት" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["planning", "exercise", "meditation", "social"],
      maxPoints: 5
    }
  },
  {
    id: "rf_006",
    dimension: "resilience_factor",
    subFactor: "adaptability",
    type: "binary",
    content: {
      en: "Change is an opportunity, not a threat.",
      am: "ለውጥ ምንጊዜም እድል እንጂ ስጋት አይደለም።"
    },
    options: [
      { value: 1, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 5, label: { en: "Agree", am: "እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "rf_007",
    dimension: "resilience_factor",
    subFactor: "emotional_regulation",
    type: "scenario",
    content: {
      en: "You receive harsh criticism on a project you worked hard on. How do you respond?",
      am: "በጠንካራ የሰራበት ፕሮጀክት ላይ ከባድ ትችት ደርሶበዎታል። እንዴት ምላሽ ይሰጣሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "I feel hurt and defensive", 
          am: "ተንሸን እና መከላከያ ስሜት ይሰማኛል" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "I feel disappointed but try to move on", 
          am: "ተስፋ ቆርጬ ይሰማኛል ግን ለመቀጠል እሞክራለሁ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "I look for valid points to improve my work", 
          am: "ስራዬን ለማሻሻል ትክክለኛ ነጥቦችን እፈልጋለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },

  // Learning Agility Questions (7)
  {
    id: "la_001",
    dimension: "learning_agility",
    subFactor: "curiosity_level",
    type: "likert",
    content: {
      en: "I actively seek out new information and different perspectives.",
      am: "አዲስ መረጃ እና የተለያዩ አመለካከቶችን በንቃት እፈልጋለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "la_002",
    dimension: "learning_agility",
    subFactor: "pattern_recognition",
    type: "scenario",
    content: {
      en: "When learning something new, what do you focus on first?",
      am: "አዲስ ነገር ሲማሩ መጀመሪያ በምን ላይ ያተኩራሉ?"
    },
    options: [
      { 
        value: 2, 
        label: { 
          en: "Memorizing the specific details", 
          am: "የተወሰኑ ዝርዝሮችን ማስታወስ" 
        }
      },
      { 
        value: 4, 
        label: { 
          en: "Understanding the overall concept", 
          am: "አጠቃላይ ጽንሰ-ሐሳቡን መረዳት" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Finding connections to what I already know", 
          am: "ከምወቀው ነገር ጋር ያለውን ግንኙነት ማግኘት" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.4, 0.8, 1.0] }
  },
  {
    id: "la_003",
    dimension: "learning_agility",
    subFactor: "knowledge_application",
    type: "likert",
    content: {
      en: "I can quickly apply new knowledge to solve unexpected problems.",
      am: "ሳይጠበቁ ችግሮችን ለመፍታት አዲስ እውቀት በፍጥነት መጠቀም እችላለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "la_004",
    dimension: "learning_agility",
    subFactor: "curiosity_level",
    type: "slider",
    content: {
      en: "How often do you ask 'What if?' or 'Why?' questions?",
      am: "'ምን ሆነ ግን?' ወይም 'ለምን?' የሚሉ ጥያቄዎችን ምን ያህል ጊዜ ትጠይቃለህ?"
    },
    options: [
      {
        value: 0,
        label: { en: "Rarely", am: "አልፎ አልፎ" }
      },
      {
        value: 50,
        label: { en: "Sometimes", am: "አንዳንድ ጊዜ" }
      },
      {
        value: 100,
        label: { en: "Constantly", am: "ሁልጊዜ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "la_005",
    dimension: "learning_agility",
    subFactor: "pattern_recognition",
    type: "ranking",
    content: {
      en: "Rank these learning methods from most to least effective for you:",
      am: "እነዚህን የመማሪያ ዘዴዎች ለእርስዎ ከሚበልጥ ወደ ሚያንስ ያስቀምጡ:"
    },
    options: [
      { id: "visual", label: { en: "Watching videos/demonstrations", am: "ቪዲዮ/ትዕይንት መመልከት" }},
      { id: "reading", label: { en: "Reading books/articles", am: "መጽሐፍ/ጽሑፎች ማንበብ" }},
      { id: "doing", label: { en: "Hands-on practice", am: "በተግባር መለማመድ" }},
      { id: "discussing", label: { en: "Group discussions", am: "የቡድን ውይይት" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["doing", "discussing", "visual", "reading"],
      maxPoints: 5
    }
  },
  {
    id: "la_006",
    dimension: "learning_agility",
    subFactor: "knowledge_application",
    type: "binary",
    content: {
      en: "The best way to understand something is to try to teach it to someone else.",
      am: "ነገርን የመረዳት ሳይንስ ለሌላ ሰው ለማስተማር መሞከር ነው።"
    },
    options: [
      { value: 1, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 5, label: { en: "Agree", am: "እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "la_007",
    dimension: "learning_agility",
    subFactor: "curiosity_level",
    type: "scenario",
    content: {
      en: "You encounter a topic you know nothing about. What's your first instinct?",
      am: "ምንም የማታውቁት ርዕስ ገጥሞዎታል። የመጀመሪያ በደህንነትዎ ምንድን ነው?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Avoid it since I don't understand it", 
          am: "ስለማልገባው እርቀኝ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Look it up if I need to", 
          am: "ካስፈለገኝ እፈልገዋለሁ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Get excited to explore and learn about it", 
          am: "ስለእሱ ለማወቅ እና ለመማር እተጓለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },

  // Vision Clarity Questions (7)
  {
    id: "vc_001",
    dimension: "vision_clarity",
    subFactor: "goal_specificity",
    type: "likert",
    content: {
      en: "I have clearly defined goals for the next 3-5 years.",
      am: "ለሚቀጥሉት 3-5 ዓመታት በግልጽ የተወሰኑ ግቦች አለኝ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "vc_002",
    dimension: "vision_clarity",
    subFactor: "purpose_alignment",
    type: "slider",
    content: {
      en: "How well does your current path align with your deeper purpose?",
      am: "የአሁኑ መንገድዎ ከጥልቅ ዓላማዎ ጋር ምን ያህል ይመሳሰላል?"
    },
    options: [
      {
        value: 0,
        label: { en: "Not at all", am: "በፍፁም" }
      },
      {
        value: 50,
        label: { en: "Somewhat", am: "በተወሰነ ደረጃ" }
      },
      {
        value: 100,
        label: { en: "Perfectly aligned", am: "ሙሉ በሙሉ የተጣጣመ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "vc_003",
    dimension: "vision_clarity",
    subFactor: "future_orientation",
    type: "scenario",
    content: {
      en: "When you imagine yourself in 10 years, what do you see?",
      am: "እራስዎን በ10 ዓመት ውስጥ ሲያስቡ ምን ያያሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "It's hard to picture anything specific", 
          am: "የተወሰነ ነገር ማሳየት ከባድ ነው" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "A general sense of where I want to be", 
          am: "የት መሆን እንደምፈልግ አጠቃላይ ስሜት" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "A vivid, detailed picture of my ideal life", 
          am: "የሕይወቴ ምናባዊ ግልጽ እና ዝርዝር ገጽታ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "vc_004",
    dimension: "vision_clarity",
    subFactor: "goal_specificity",
    type: "binary",
    content: {
      en: "I regularly review and adjust my goals based on new insights.",
      am: "በአዲስ ግንዛቤዎች ላይ በመመስረት ግቦቼን በመደበኛነት እገመግማለሁ እና አስተካክላለሁ።"
    },
    options: [
      { value: 1, label: { en: "False", am: "ስህተት" }},
      { value: 5, label: { en: "True", am: "እውነት" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "vc_005",
    dimension: "vision_clarity",
    subFactor: "purpose_alignment",
    type: "ranking",
    content: {
      en: "Rank these factors by importance in your life decisions:",
      am: "እነዚህን ሁኔታዎች በሕይወት ውሳኔዎችዎ ውስጥ በአስፈላጊነት ያስቀምጡ:"
    },
    options: [
      { id: "money", label: { en: "Financial gain", am: "የገንዘብ ጥቅም" }},
      { id: "purpose", label: { en: "Personal fulfillment", am: "ግላዊ ዕርካታ" }},
      { id: "recognition", label: { en: "Social recognition", am: "ማህበራዊ እውቅና" }},
      { id: "impact", label: { en: "Making a difference", am: "ለውጥ ማምጣት" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["purpose", "impact", "money", "recognition"],
      maxPoints: 5
    }
  },
  {
    id: "vc_006",
    dimension: "vision_clarity",
    subFactor: "future_orientation",
    type: "likert",
    content: {
      en: "I enjoy imagining and planning for different future scenarios.",
      am: "የተለያዩ የወደፊት ሁኔታዎችን መላበስ እና ማቀድ እወዳለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "vc_007",
    dimension: "vision_clarity",
    subFactor: "goal_specificity",
    type: "scenario",
    content: {
      en: "How do you typically set goals?",
      am: "ግቦችን በመደበኛነት እንዴት ይያዛሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "I rarely set formal goals", 
          am: "በእርግጠኝነት ግቦችን አልወስንም" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "I set general goals but don't write them down", 
          am: "አጠቃላይ ግቦችን አወጣለሁ ግን አልጽፋቸውም" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "I write specific, measurable goals with deadlines", 
          am: "ከመወሰኛ ጊዜ ጋር የተወሰኑ፣ ሊለኩ የሚችሉ ግቦችን ጽፋለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },

  // Action Orientation Questions (7)
  {
    id: "ao_001",
    dimension: "action_orientation",
    subFactor: "initiative_taking",
    type: "likert",
    content: {
      en: "I take action on my goals without waiting for perfect conditions.",
      am: "ፍጹም ሁኔታዎችን ሳልጠብቅ በግቦቼ ላይ እርምጃ እወስዳለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "ao_002",
    dimension: "action_orientation",
    subFactor: "procrastination_resistance",
    type: "scenario",
    content: {
      en: "You have an important but unpleasant task to complete. What do you typically do?",
      am: "አስፈላጊ ግን ያልተመቸ ተግባር ማጠናቀቅ አለብዎት። በተለምዶ ምን ያደርጋሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Put it off until the last minute", 
          am: "እስከ መጨረሻው ደቂቃ ድረስ አቃውማለሁ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Do it eventually, but it takes some effort", 
          am: "በመጨረሻ አደርገዋለሁ፣ ግን ትንሽ ጥረት ይወስዳል" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Tackle it right away to get it done", 
          am: "ለማጠናቀቅ ወዲያውኑ እወጣለበታለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "ao_003",
    dimension: "action_orientation",
    subFactor: "completion_drive",
    type: "slider",
    content: {
      en: "How often do you complete projects you start?",
      am: "የጀመሯቸውን ፕሮጀክቶች ምን ያህል ጊዜ ይጨርሳሉ?"
    },
    options: [
      {
        value: 0,
        label: { en: "Rarely finish", am: "አልፎ አልፎ እጨርሳለሁ" }
      },
      {
        value: 50,
        label: { en: "Sometimes finish", am: "አንዳንድ ጊዜ እጨርሳለሁ" }
      },
      {
        value: 100,
        label: { en: "Almost always finish", am: "ሁሌም ወደፊት እጨርሳለሁ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "ao_004",
    dimension: "action_orientation",
    subFactor: "initiative_taking",
    type: "binary",
    content: {
      en: "I prefer to ask for forgiveness rather than permission when taking action.",
      am: "እርምጃ ሲወስድ ፈቃድ ከመጠየቅ ይቅርታ መጠየቅን እመርጣለሁ።"
    },
    options: [
      { value: 1, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 5, label: { en: "Agree", am: "እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "ao_005",
    dimension: "action_orientation",
    subFactor: "procrastination_resistance",
    type: "ranking",
    content: {
      en: "Rank these strategies for overcoming procrastination:",
      am: "የወደኻድነትን ለማሸነፍ እነዚህን ስትራቴጂዎች ያስቀምጡ:"
    },
    options: [
      { id: "deadline", label: { en: "Setting strict deadlines", am: "ጠንካራ የመጨረሻ ጊዜ መወሰን" }},
      { id: "reward", label: { en: "Promising myself a reward", am: "ለራሴ ሽልማት ማቀድ" }},
      { id: "breaking", label: { en: "Breaking tasks into smaller pieces", am: "ተግባሮችን ወደ ትናንሽ ክፍሎች መከፋፈል" }},
      { id: "accountability", label: { en: "Having someone hold me accountable", am: "አንድ ሰው ተጠያቂ እንዲያደርገኝ ማድረግ" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["breaking", "accountability", "deadline", "reward"],
      maxPoints: 5
    }
  },
  {
    id: "ao_006",
    dimension: "action_orientation",
    subFactor: "completion_drive",
    type: "likert",
    content: {
      en: "I feel energized by making progress on my goals, even in small steps.",
      am: "በትንንሽ እርምጃዎች እንኳን በግቦቼ ላይ እድገት በማድረግ ጉልበት ይሰማኛል።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "ao_007",
    dimension: "action_orientation",
    subFactor: "initiative_taking",
    type: "scenario",
    content: {
      en: "You see a problem that others are ignoring. What do you do?",
      am: "ሌሎች የሚያስተዋሉትን ችግር ይመለከታሉ። ምን ያደርጋሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Assume someone else will handle it", 
          am: "ሌላ ሰው እንደሚያስተናግደው አስበዋለሁ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Point it out to the appropriate person", 
          am: "ለተገቢው ሰው ጠቁማለሁ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Take initiative to address it myself", 
          am: "እራሴ ለመፍታት ቀዳሚነት እወስዳለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },

  // Social Intelligence Questions (7)
  {
    id: "si_001",
    dimension: "social_intelligence",
    subFactor: "empathy_level",
    type: "likert",
    content: {
      en: "I can easily sense when someone is feeling upset or uncomfortable.",
      am: "አንድ ሰው ተበሳጨ ወይም ደህንነት በማጣት ሲሰማው በቀላሉ መገንዘብ እችላለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "si_002",
    dimension: "social_intelligence",
    subFactor: "communication_skill",
    type: "scenario",
    content: {
      en: "You need to give someone difficult feedback. How do you approach it?",
      am: "ለአንድ ሰው ከባድ ግብረመልስ መስጠት አለብዎት። እንዴት ይቀርባሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Be direct and get it over with quickly", 
          am: "ቀጥ ብለው ይሁኑ እና በፍጥነት ይጨርሱት" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Find a gentle way to bring it up", 
          am: "ለማቅረብ ረህራሄ መንገድ ያግኙ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Consider their perspective and timing carefully", 
          am: "አመለካከታቸውን እና ሰዓትን በጥንቃቄ ያስቡ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "si_003",
    dimension: "social_intelligence",
    subFactor: "relationship_building",
    type: "slider",
    content: {
      en: "How easily do you build rapport with new people?",
      am: "ከአዳዲስ ሰዎች ጋር ግንኙነት ምን ያህል በቀላሉ ይገነባሉ?"
    },
    options: [
      {
        value: 0,
        label: { en: "Very difficult", am: "በጣም ከባድ" }
      },
      {
        value: 50,
        label: { en: "Sometimes easy", am: "አንዳንድ ጊዜ ቀላል" }
      },
      {
        value: 100,
        label: { en: "Very easy", am: "በጣም ቀላል" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "si_004",
    dimension: "social_intelligence",
    subFactor: "empathy_level",
    type: "binary",
    content: {
      en: "I often find myself feeling what others are feeling.",
      am: "ብዙውን ጊዜ ሌሎች የሚሰሙትን እየሰማሁ እራሴን አገኛለሁ።"
    },
    options: [
      { value: 1, label: { en: "Rarely", am: "አልፎ አልፎ" }},
      { value: 5, label: { en: "Often", am: "ብዙውን ጊዜ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "si_005",
    dimension: "social_intelligence",
    subFactor: "communication_skill",
    type: "ranking",
    content: {
      en: "Rank these communication skills by your strongest abilities:",
      am: "እነዚህን የመገናኛ ችሎታዎች በጠንካራ ችሎታዎችዎ ያስቀምጡ:"
    },
    options: [
      { id: "listening", label: { en: "Active listening", am: "ንቃተ ህሊና ማዳመጥ" }},
      { id: "speaking", label: { en: "Clear speaking", am: "ግልጽ ንግግር" }},
      { id: "nonverbal", label: { en: "Reading body language", am: "የሰውነት ቋንቋ ማንበብ" }},
      { id: "writing", label: { en: "Written communication", am: "የተፃፈ መገናኛ" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["listening", "nonverbal", "speaking", "writing"],
      maxPoints: 5
    }
  },
  {
    id: "si_006",
    dimension: "social_intelligence",
    subFactor: "relationship_building",
    type: "likert",
    content: {
      en: "I make an effort to understand different cultural perspectives.",
      am: "የተለያዩ የባህል አመለካከቶችን ለመረዳት ጥረት አደርጋለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "si_007",
    dimension: "social_intelligence",
    subFactor: "empathy_level",
    type: "scenario",
    content: {
      en: "A colleague seems stressed and overwhelmed. What's your response?",
      am: "አንድ የስራ ባልደረባ ጭንቅላት እና ስሜት ውስጥ ያለ ይመስላል። የእርስዎ ምላሽ ምንድን ነው?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Give them space unless they ask for help", 
          am: "እርዳታ እስካልጠየቁ ድረስ ቦታ ይስጧቸው" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Ask if they're okay", 
          am: "ደህና መሆናቸውን ይጠይቁ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Offer specific help and emotional support", 
          am: "የተወሰነ እርዳታ እና ስሜታዊ ድጋፍ ያቅርቡ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },

  // Creative Confidence Questions (7)
  {
    id: "cc_001",
    dimension: "creative_confidence",
    subFactor: "idea_generation",
    type: "likert",
    content: {
      en: "I regularly come up with original ideas and solutions.",
      am: "በመደበኛነት ኦሪጅናል ሃሳቦችን እና መፍትሄዎችን እመጣለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "cc_002",
    dimension: "creative_confidence",
    subFactor: "risk_tolerance",
    type: "scenario",
    content: {
      en: "You have a creative idea but you're not sure it will work. What do you do?",
      am: "የፈጠራ ሃሳብ አለዎት ግን እንደሚሰራ እርግጠኛ አይደሉም። ምን ያደርጋሉ?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "Keep it to myself until I'm more confident", 
          am: "እስከ ብዙ በራሴ መተማመን ድረስ ለራሴ እይዛለሁ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "Test it in a small, safe way first", 
          am: "መጀመሪያ በትንሽ፣ ደህንነት ባለው መንገድ እሞክረዋለሁ" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "Share it and get feedback to improve it", 
          am: "አጋራዋለሁ እና ለማሻሻል ግብረመልስ እወስዳለሁ" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  },
  {
    id: "cc_003",
    dimension: "creative_confidence",
    subFactor: "innovation_mindset",
    type: "slider",
    content: {
      en: "How comfortable are you with ambiguity and uncertain outcomes?",
      am: "ከግራ መጋባት እና እርግጠኛ ያልሆኑ ውጤቶች ጋር ምን ያህል ምቾት ይሰማዎታል?"
    },
    options: [
      {
        value: 0,
        label: { en: "Very uncomfortable", am: "በጣም ያልተመቸ" }
      },
      {
        value: 50,
        label: { en: "Somewhat comfortable", am: "በተወሰነ ደረጃ ምቹ" }
      },
      {
        value: 100,
        label: { en: "Very comfortable", am: "በጣም ምቹ" }
      }
    ],
    scoring: { type: "percentage", maxPoints: 5 }
  },
  {
    id: "cc_004",
    dimension: "creative_confidence",
    subFactor: "idea_generation",
    type: "binary",
    content: {
      en: "There are always multiple ways to solve any problem.",
      am: "ማንኛውንም ችግር ለመፍታት ሁልጊዜ ብዙ መንገዶች አሉ።"
    },
    options: [
      { value: 1, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 5, label: { en: "Agree", am: "እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "cc_005",
    dimension: "creative_confidence",
    subFactor: "risk_tolerance",
    type: "ranking",
    content: {
      en: "Rank these approaches to innovation by your preference:",
      am: "እነዚህን የፈጠራ አቀራረቦች በምርጫዎ ያስቀምጡ:"
    },
    options: [
      { id: "incremental", label: { en: "Small, gradual improvements", am: "ትንሽ፣ ቀስ በቀስ ማሻሻያዎች" }},
      { id: "radical", label: { en: "Bold, disruptive changes", am: "ደፋር፣ አሰላሳይ ለውጦች" }},
      { id: "collaborative", label: { en: "Team-based innovation", am: "በቡድን ላይ የተመሰረተ ፈጠራ" }},
      { id: "systematic", label: { en: "Structured, methodical approach", am: "የተዋቀረ፣ ዘዴአዊ አቀራረብ" }}
    ],
    scoring: { 
      type: "ranking_matrix",
      optimalOrder: ["collaborative", "radical", "systematic", "incremental"],
      maxPoints: 5
    }
  },
  {
    id: "cc_006",
    dimension: "creative_confidence",
    subFactor: "innovation_mindset",
    type: "likert",
    content: {
      en: "I enjoy exploring unconventional approaches to familiar problems.",
      am: "ለታወቁ ችግሮች ያልተለመዱ አቀራረቦችን ማስስ እወዳለሁ።"
    },
    options: [
      { value: 1, label: { en: "Strongly Disagree", am: "በጣም አልስማማም" }},
      { value: 2, label: { en: "Disagree", am: "አልስማማም" }},
      { value: 3, label: { en: "Neutral", am: "ገለልተኛ" }},
      { value: 4, label: { en: "Agree", am: "እስማማለሁ" }},
      { value: 5, label: { en: "Strongly Agree", am: "በጣም እስማማለሁ" }}
    ],
    scoring: { type: "direct", maxPoints: 5 }
  },
  {
    id: "cc_007",
    dimension: "creative_confidence",
    subFactor: "risk_tolerance",
    type: "scenario",
    content: {
      en: "You have an opportunity to pursue a creative project with uncertain results. What influences your decision most?",
      am: "እርግጠኛ ያልሆነ ውጤት ያለው የፈጠራ ፕሮጀክት የመከታተል እድል አለዎት። ውሳኔዎን በጣም የሚነካው ምንድን ነው?"
    },
    options: [
      { 
        value: 1, 
        label: { 
          en: "The risk of failure", 
          am: "የውድቀት አደጋ" 
        }
      },
      { 
        value: 3, 
        label: { 
          en: "The resources required", 
          am: "የሚያስፈልጉ ሀብቶች" 
        }
      },
      { 
        value: 5, 
        label: { 
          en: "The potential for learning and growth", 
          am: "የመማር እና የማደግ እድል" 
        }
      }
    ],
    scoring: { type: "weighted", maxPoints: 5, weights: [0.2, 0.6, 1.0] }
  }
];

// Potential Levels
export interface PotentialLevel {
  range: [number, number];
  title: LocalizedString;
  description: LocalizedString;
  color: string;
  icon: string;
  characteristics: LocalizedString[];
  nextSteps: LocalizedString[];
}

export const potentialLevels: PotentialLevel[] = [
  {
    range: [90, 100],
    title: { 
      en: "Unlimited Potential", 
      am: "ያልተገደበ አቅም" 
    },
    description: {
      en: "You possess extraordinary potential. With the right opportunities and continued growth, you're positioned to achieve remarkable things and inspire others.",
      am: "ልዩ አቅም አለዎት። በትክክለኛ እድሎች እና ቀጣይ እድገት፣ አስደናቂ ነገሮችን ለማሳካት እና ሌሎችን ለማነሳሳት ተዘጋጅተዋል።"
    },
    color: "#FFD700", // Gold
    icon: "👑",
    characteristics: [
      { en: "Exceptional growth mindset", am: "ልዩ የእድገት አስተሳሰብ" },
      { en: "High resilience and adaptability", am: "ከፍተኛ የመቋቋም እና የመላመድ ችሎታ" },
      { en: "Clear, compelling vision", am: "ግልጽ፣ አሳማኝ ራዕይ" },
      { en: "Strong action orientation", am: "ጠንካራ የተግባር ዝንባሌ" }
    ],
    nextSteps: [
      { en: "Pursue leadership opportunities", am: "የመሪነት እድሎችን ይከታተሉ" },
      { en: "Mentor others to multiply impact", am: "ተጽዕኖን ለማባዛት ሌሎችን ያማክሩ" },
      { en: "Take on ambitious challenges", am: "ከፍተኛ ፈተናዎችን ይውሰዱ" }
    ]
  },
  {
    range: [75, 89],
    title: { 
      en: "High Potential", 
      am: "ከፍተኛ አቅም" 
    },
    description: {
      en: "You have significant untapped potential. By focusing on key growth areas and maintaining momentum, you can achieve great success.",
      am: "ጉልህ ያልተነካ አቅም አለዎት። በቁልፍ የእድገት ቦታዎች ላይ በማተኮር እና ሞመንተም በመጠበቅ ታላቅ ስኬት ማግኘት ይችላሉ።"
    },
    color: "#C0C0C0", // Silver
    icon: "⭐",
    characteristics: [
      { en: "Strong foundation for growth", am: "ለእድገት ጠንካራ መሰረት" },
      { en: "Good self-awareness", am: "ጥሩ ራስን ማወቅ" },
      { en: "Developing leadership qualities", am: "የመሪነት ባህሪያትን ማዳበር" }
    ],
    nextSteps: [
      { en: "Identify and work on 1-2 growth areas", am: "1-2 የእድገት ቦታዎችን ይለዩ እና ይስሩ" },
      { en: "Seek mentorship or coaching", am: "አማካሪ ወይም አሰልጣኝ ይፈልጉ" },
      { en: "Set ambitious but achievable goals", am: "ከፍተኛ ግን ሊደረስባቸው የሚችሉ ግቦችን ያስቀምጡ" }
    ]
  },
  {
    range: [60, 74],
    title: { 
      en: "Emerging Potential", 
      am: "በመገለጥ ላይ ያለ አቅም" 
    },
    description: {
      en: "You're on the cusp of breakthrough. With focused effort on developing key skills and mindsets, your potential can flourish rapidly.",
      am: "በእመርታ ላይ ነዎት። ቁልፍ ችሎታዎችን እና አስተሳሰቦችን በማዳበር ላይ ባተኮረ ጥረት፣ አቅምዎ በፍጥነት ሊያብብ ይችላል።"
    },
    color: "#CD7F32", // Bronze
    icon: "🌟",
    characteristics: [
      { en: "Growing self-awareness", am: "እያደገ ያለ ራስን ማወቅ" },
      { en: "Developing key skills", am: "ቁልፍ ችሎታዎችን ማዳበር" },
      { en: "Open to learning", am: "ለመማር ክፍት" }
    ],
    nextSteps: [
      { en: "Focus on building growth mindset", am: "የእድገት አስተሳሰብ በመገንባት ላይ ያተኩሩ" },
      { en: "Practice resilience through challenges", am: "በፈተናዎች በኩል የመቋቋም ችሎታን ይለማመዱ" },
      { en: "Clarify your vision and goals", am: "ራዕይዎን እና ግቦችዎን ያብራሩ" }
    ]
  },
  {
    range: [40, 59],
    title: { 
      en: "Developing Potential", 
      am: "በማደግ ላይ ያለ አቅም" 
    },
    description: {
      en: "You have solid foundation to build upon. By addressing limiting beliefs and developing key skills, you can unlock significantly more potential.",
      am: "ለመገንባት ጠንካራ መሰረት አለዎት። ገዳቢ እምነቶችን በመፍታት እና ቁልፍ ችሎታዎችን በማዳበር፣ በከፍተኛ ሁኔታ ተጨማሪ አቅም መክፈት ይችላሉ።"
    },
    color: "#4B8B3B", // Green
    icon: "🌱",
    characteristics: [
      { en: "Room for significant growth", am: "ለጉልህ እድገት ቦታ" },
      { en: "Basic skills in place", am: "መሰረታዊ ችሎታዎች በቦታቸው" },
      { en: "Awareness of improvement areas", am: "የማሻሻያ ቦታዎች ግንዛቤ" }
    ],
    nextSteps: [
      { en: "Work on one dimension at a time", am: "በአንድ ጊዜ በአንድ ልኬት ላይ ይስሩ" },
      { en: "Celebrate small wins", am: "ትንንሽ ድሎችን ያክብሩ" },
      { en: "Build supportive environment", am: "ደጋፊ አካባቢ ይገንቡ" }
    ]
  },
  {
    range: [0, 39],
    title: { 
      en: "Awakening Potential", 
      am: "እየነቃ ያለ አቅም" 
    },
    description: {
      en: "You're at the beginning of an exciting journey. Everyone starts somewhere, and recognizing where you are is the first step to growth.",
      am: "አስደሳች ጉዞ መጀመሪያ ላይ ነዎት። ሁሉም ሰው ከአንድ ቦታ ይጀምራል፣ እና የት እንዳሉ ማወቅ የእድገት የመጀመሪያ እርምጃ ነው።"
    },
    color: "#836953", // Brown
    icon: "🌰",
    characteristics: [
      { en: "Awareness is awakening", am: "ግንዛቤ እየነቃ ነው" },
      { en: "Potential is dormant but present", am: "አቅም ተኝቷል ግን አለ" },
      { en: "Ready for transformation", am: "ለለውጥ ዝግጁ" }
    ],
    nextSteps: [
      { en: "Start with small, daily improvements", am: "ከትንሽ፣ ዕለታዊ ማሻሻያዎች ይጀምሩ" },
      { en: "Find inspiring role models", am: "አነቃቂ አርአያዎችን ያግኙ" },
      { en: "Focus on building one positive habit", am: "አንድ አዎንታዊ ልምድ በመገንባት ላይ ያተኩሩ" }
    ]
  }
];

// Helper function to get dimension by ID
export const getDimensionById = (id: string): PotentialDimension | undefined => {
  return dimensions.find(dim => dim.id === id);
};

// Helper function to get questions by dimension
export const getQuestionsByDimension = (dimensionId: string): Question[] => {
  return questions.filter(q => q.dimension === dimensionId);
};

// Helper function to determine potential level
export const getPotentialLevel = (score: number): PotentialLevel => {
  return potentialLevels.find(level => 
    score >= level.range[0] && score <= level.range[1]
  ) || potentialLevels[potentialLevels.length - 1];
};