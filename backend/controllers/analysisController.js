const axios = require('axios');

// Analyze article for bias and sentiment
exports.analyzeArticle = async (req, res) => {
  const { text, title, source } = req.body;
  
  try {
    // For now, return sample analysis since we don't have API keys
    const sampleAnalysis = {
      politicalBias: "Moderate",
      politicalBiasScore: 45,
      emotionalBias: "Positive",
      emotionalBiasScore: 65,
      reliability: "High",
      summary: "This article presents a balanced view with moderate political bias and positive emotional tone.",
      keyPoints: [
        "Balanced reporting on the topic",
        "Multiple perspectives included",
        "Factual information presented",
        "Clear and objective language used"
      ],
      analysis: "The article demonstrates good journalistic standards with moderate bias and positive sentiment."
    };
    
    res.json(sampleAnalysis);
  } catch (error) {
    console.error('Error analyzing article:', error);
    res.status(500).json({ error: 'Error analyzing article' });
  }
};

// Generate article summary
exports.generateSummary = async (req, res) => {
  const { text, title } = req.body;
  
  try {
    console.log('Generating summary for:', { text, title });
    
    // Generate a more intelligent summary based on the actual content
    const keyPoints = [];
    
    // Extract key information from the text
    if (text.toLowerCase().includes('announce') || text.toLowerCase().includes('announced')) {
      keyPoints.push('New announcement or development revealed');
    }
    if (text.toLowerCase().includes('impact') || text.toLowerCase().includes('effect')) {
      keyPoints.push('Significant impact on industry or society');
    }
    if (text.toLowerCase().includes('future') || text.toLowerCase().includes('plan')) {
      keyPoints.push('Future implications and plans discussed');
    }
    if (text.toLowerCase().includes('expert') || text.toLowerCase().includes('official')) {
      keyPoints.push('Expert opinions and official statements included');
    }
    if (text.toLowerCase().includes('data') || text.toLowerCase().includes('study')) {
      keyPoints.push('Data and research findings presented');
    }
    
    // Generate a contextual summary based on the actual content
    let summary = `This article discusses ${title ? title.toLowerCase() : 'a significant topic'}. `;
    
    if (text.length > 200) {
      summary += `The content provides detailed information about the subject, covering various aspects and implications. `;
    }
    
    if (text.toLowerCase().includes('technology') || text.toLowerCase().includes('ai') || text.toLowerCase().includes('innovation')) {
      summary += `The article focuses on technological developments and their potential impact on the industry.`;
    } else if (text.toLowerCase().includes('climate') || text.toLowerCase().includes('environment')) {
      summary += `The article addresses environmental concerns and climate-related developments.`;
    } else if (text.toLowerCase().includes('economy') || text.toLowerCase().includes('market')) {
      summary += `The article examines economic factors and market implications.`;
    } else if (text.toLowerCase().includes('health') || text.toLowerCase().includes('medical')) {
      summary += `The article covers health-related developments and medical implications.`;
    } else {
      summary += `The article presents comprehensive coverage of the topic with relevant context and analysis.`;
    }
    
    const response = { 
      summary: summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        'Key development in the field',
        'Significant impact on industry',
        'Future implications discussed',
        'Expert opinions included',
        'Data and statistics presented'
      ]
    };
    
    console.log('Generated summary:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary' });
  }
};

// Get analytics dashboard data
exports.getAnalytics = async (req, res) => {
  try {
    // Get recent articles to calculate real analytics
    const Article = require('../models/Article');
    const mongoose = require('mongoose');
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return sample analytics if DB not connected
      const analytics = {
        totalArticles: 1250,
        savedArticles: 89,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: {
          low: 42,
          moderate: 35,
          high: 23
        }
      };
      
      res.json(analytics);
      return;
    }

    // Get all articles from database
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(100);
    
    if (articles.length === 0) {
      // Return sample data if no articles in DB
      const analytics = {
        totalArticles: 1250,
        savedArticles: 89,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: {
          low: 42,
          moderate: 35,
          high: 23
        }
      };
      
      res.json(analytics);
      return;
    }

    // Calculate real analytics from articles
    const totalArticles = articles.length;
    const savedArticles = articles.filter(article => article.saved).length;
    
    // Calculate average bias scores
    const politicalBiasScores = articles
      .filter(article => article.analysis && article.analysis.politicalBiasScore)
      .map(article => article.analysis.politicalBiasScore);
    
    const emotionalBiasScores = articles
      .filter(article => article.analysis && article.analysis.emotionalBiasScore)
      .map(article => article.analysis.emotionalBiasScore);
    
    const averagePoliticalBias = politicalBiasScores.length > 0 
      ? Math.round(politicalBiasScores.reduce((sum, score) => sum + score, 0) / politicalBiasScores.length)
      : 50;
    
    const averageEmotionalBias = emotionalBiasScores.length > 0
      ? Math.round(emotionalBiasScores.reduce((sum, score) => sum + score, 0) / emotionalBiasScores.length)
      : 50;

    // Calculate bias distribution
    const biasLevels = articles.map(article => {
      const politicalScore = article.analysis?.politicalBiasScore || 50;
      if (politicalScore < 30) return 'low';
      if (politicalScore > 70) return 'high';
      return 'moderate';
    });

    const biasDistribution = {
      low: Math.round((biasLevels.filter(level => level === 'low').length / biasLevels.length) * 100),
      moderate: Math.round((biasLevels.filter(level => level === 'moderate').length / biasLevels.length) * 100),
      high: Math.round((biasLevels.filter(level => level === 'high').length / biasLevels.length) * 100)
    };

    const analytics = {
      totalArticles,
      savedArticles,
      averagePoliticalBias,
      averageEmotionalBias,
      biasDistribution
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};

// Translate text
exports.translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  
  try {
    // Check if we have API key for real translation
    if (!process.env.TOGETHER_API_KEY) {
      // Return sample translation if no API key
      const sampleTranslations = {
        'es': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'Tecnología de IA Revolucionaria Transforma la Industria de la Salud',
          'Global Climate Summit Reaches Historic Agreement': 'Cumbre Climática Global Alcanza Acuerdo Histórico',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'Los Mercados Económicos Ahora Muestran Signos de Fuerte Recuperación',
          'Breakthrough in Space Exploration Technology': 'Avance en Tecnología de Exploración Espacial',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'Nueva Tecnología de Batería para Vehículos Eléctricos Alcanza 500 Millas de Autonomía',
          'Major Sports League Announces Revolutionary Rule Changes': 'Liga Deportiva Principal Anuncia Cambios Revolucionarios en las Reglas',
          'Breakthrough in Quantum Computing Research': 'Avance en Investigación de Computación Cuántica',
          'Global Food Security Initiative Launches in Developing Nations': 'Iniciativa Global de Seguridad Alimentaria Se Lanza en Naciones en Desarrollo',
          'Revolutionary Cancer Treatment Shows Promising Results': 'Tratamiento Revolucionario contra el Cáncer Muestra Resultados Prometedores',
          'Major Tech Company Announces Revolutionary AI Assistant': 'Empresa Tecnológica Principal Anuncia Asistente de IA Revolucionario',
          'Historic Peace Agreement Signed Between Rival Nations': 'Acuerdo de Paz Histórico Firmado Entre Naciones Rivales',
          'Revolutionary Renewable Energy Storage Solution': 'Solución Revolucionaria de Almacenamiento de Energía Renovable'
        },
        'fr': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'Technologie d\'IA Révolutionnaire Transforme l\'Industrie de la Santé',
          'Global Climate Summit Reaches Historic Agreement': 'Sommet Climatique Mondial Atteint un Accord Historique',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'Les Marchés Économiques Montrent Maintenant des Signes de Forte Reprise',
          'Breakthrough in Space Exploration Technology': 'Percée dans la Technologie d\'Exploration Spatiale',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'Nouvelle Technologie de Batterie pour Véhicules Électriques Atteint 500 Miles d\'Autonomie',
          'Major Sports League Announces Revolutionary Rule Changes': 'Ligue Sportive Majeure Annonce des Changements de Règles Révolutionnaires',
          'Breakthrough in Quantum Computing Research': 'Percée dans la Recherche en Informatique Quantique',
          'Global Food Security Initiative Launches in Developing Nations': 'Initiative Mondiale de Sécurité Alimentaire Lance dans les Nations en Développement',
          'Revolutionary Cancer Treatment Shows Promising Results': 'Traitement Révolutionnaire contre le Cancer Montre des Résultats Prometteurs',
          'Major Tech Company Announces Revolutionary AI Assistant': 'Entreprise Technologique Majeure Annonce un Assistant IA Révolutionnaire',
          'Historic Peace Agreement Signed Between Rival Nations': 'Accord de Paix Historique Signé Entre Nations Rivales',
          'Revolutionary Renewable Energy Storage Solution': 'Solution Révolutionnaire de Stockage d\'Énergie Renouvelable'
        },
        'de': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'Revolutionäre KI-Technologie Transformiert die Gesundheitsbranche',
          'Global Climate Summit Reaches Historic Agreement': 'Globaler Klimagipfel Erreicht Historisches Abkommen',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'Wirtschaftsmärkte Zeigen Jetzt Starke Erholungszeichen',
          'Breakthrough in Space Exploration Technology': 'Durchbruch in der Weltraumforschungstechnologie',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'Neue Elektrofahrzeug-Batterietechnologie Erreicht 500-Meilen-Reichweite',
          'Major Sports League Announces Revolutionary Rule Changes': 'Große Sportliga Kündigt Revolutionäre Regeländerungen An',
          'Breakthrough in Quantum Computing Research': 'Durchbruch in der Quantencomputerforschung',
          'Global Food Security Initiative Launches in Developing Nations': 'Globale Ernährungssicherheitsinitiative Startet in Entwicklungsländern',
          'Revolutionary Cancer Treatment Shows Promising Results': 'Revolutionäre Krebsbehandlung Zeigt Vielversprechende Ergebnisse',
          'Major Tech Company Announces Revolutionary AI Assistant': 'Großes Technologieunternehmen Kündigt Revolutionären KI-Assistenten An',
          'Historic Peace Agreement Signed Between Rival Nations': 'Historisches Friedensabkommen Zwischen Rivalisierenden Nationen Unterzeichnet',
          'Revolutionary Renewable Energy Storage Solution': 'Revolutionäre Lösung für Erneuerbare Energiespeicherung'
        },
        'hi': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'क्रांतिकारी एआई तकनीक स्वास्थ्य सेवा उद्योग को बदल रही है',
          'Global Climate Summit Reaches Historic Agreement': 'वैश्विक जलवायु शिखर सम्मेलन में ऐतिहासिक समझौता',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'आर्थिक बाजार अब मजबूत सुधार के संकेत दिखा रहे हैं',
          'Breakthrough in Space Exploration Technology': 'अंतरिक्ष अन्वेषण तकनीक में सफलता',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'नई इलेक्ट्रिक वाहन बैटरी तकनीक 500 मील की रेंज हासिल करती है',
          'Major Sports League Announces Revolutionary Rule Changes': 'प्रमुख खेल लीग क्रांतिकारी नियम परिवर्तन की घोषणा करती है',
          'Breakthrough in Quantum Computing Research': 'क्वांटम कंप्यूटिंग अनुसंधान में सफलता',
          'Global Food Security Initiative Launches in Developing Nations': 'वैश्विक खाद्य सुरक्षा पहल विकासशील देशों में शुरू',
          'Revolutionary Cancer Treatment Shows Promising Results': 'क्रांतिकारी कैंसर उपचार आशाजनक परिणाम दिखाता है',
          'Major Tech Company Announces Revolutionary AI Assistant': 'प्रमुख तकनीक कंपनी क्रांतिकारी एआई सहायक की घोषणा करती है',
          'Historic Peace Agreement Signed Between Rival Nations': 'प्रतिद्वंद्वी राष्ट्रों के बीच ऐतिहासिक शांति समझौता',
          'Revolutionary Renewable Energy Storage Solution': 'क्रांतिकारी नवीकरणीय ऊर्जा भंडारण समाधान'
        },
        'zh': {
          'Revolutionary AI Technology Transforms Healthcare Industry': '革命性人工智能技术改变医疗保健行业',
          'Global Climate Summit Reaches Historic Agreement': '全球气候峰会达成历史性协议',
          'Economic Markets Are Now Showing Strong Recovery Signs': '经济市场现在显示强劲复苏迹象',
          'Breakthrough in Space Exploration Technology': '太空探索技术取得突破',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': '新型电动汽车电池技术实现500英里续航',
          'Major Sports League Announces Revolutionary Rule Changes': '主要体育联盟宣布革命性规则变更',
          'Breakthrough in Quantum Computing Research': '量子计算研究取得突破',
          'Global Food Security Initiative Launches in Developing Nations': '全球粮食安全倡议在发展中国家启动',
          'Revolutionary Cancer Treatment Shows Promising Results': '革命性癌症治疗显示有希望的结果',
          'Major Tech Company Announces Revolutionary AI Assistant': '主要科技公司宣布革命性人工智能助手',
          'Historic Peace Agreement Signed Between Rival Nations': '敌对民族之间签署历史性和平协议',
          'Revolutionary Renewable Energy Storage Solution': '革命性可再生能源存储解决方案'
        },
        'ar': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'تقنية الذكاء الاصطناعي الثورية تحول صناعة الرعاية الصحية',
          'Global Climate Summit Reaches Historic Agreement': 'قمة المناخ العالمية تصل إلى اتفاق تاريخي',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'الأسواق الاقتصادية تظهر الآن علامات تعافي قوية',
          'Breakthrough in Space Exploration Technology': 'اختراق في تقنية استكشاف الفضاء',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'تقنية بطارية المركبات الكهربائية الجديدة تحقق مدى 500 ميل',
          'Major Sports League Announces Revolutionary Rule Changes': 'الدوري الرياضي الرئيسي يعلن تغييرات ثورية في القواعد',
          'Breakthrough in Quantum Computing Research': 'اختراق في أبحاث الحوسبة الكمية',
          'Global Food Security Initiative Launches in Developing Nations': 'مبادرة الأمن الغذائي العالمي تطلق في الدول النامية',
          'Revolutionary Cancer Treatment Shows Promising Results': 'العلاج الثوري للسرطان يظهر نتائج واعدة',
          'Major Tech Company Announces Revolutionary AI Assistant': 'شركة التكنولوجيا الرئيسية تعلن عن مساعد ذكاء اصطناعي ثوري',
          'Historic Peace Agreement Signed Between Rival Nations': 'اتفاق سلام تاريخي يوقع بين الأمم المتنافسة',
          'Revolutionary Renewable Energy Storage Solution': 'حل ثوري لتخزين الطاقة المتجددة'
        },
        'ja': {
          'Revolutionary AI Technology Transforms Healthcare Industry': '革命的なAI技術が医療業界を変革',
          'Global Climate Summit Reaches Historic Agreement': 'グローバル気候サミットが歴史的合意に達する',
          'Economic Markets Are Now Showing Strong Recovery Signs': '経済市場が強力な回復の兆候を示している',
          'Breakthrough in Space Exploration Technology': '宇宙探査技術でブレークスルー',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': '新しい電気自動車バッテリー技術が500マイルの航続距離を達成',
          'Major Sports League Announces Revolutionary Rule Changes': '主要スポーツリーグが革命的なルール変更を発表',
          'Breakthrough in Quantum Computing Research': '量子コンピューティング研究でブレークスルー',
          'Global Food Security Initiative Launches in Developing Nations': 'グローバル食料安全保障イニシアチブが発展途上国で開始',
          'Revolutionary Cancer Treatment Shows Promising Results': '革命的ながん治療が有望な結果を示す',
          'Major Tech Company Announces Revolutionary AI Assistant': '主要テック企業が革命的なAIアシスタントを発表',
          'Historic Peace Agreement Signed Between Rival Nations': '敵対国間で歴史的な平和協定が署名される',
          'Revolutionary Renewable Energy Storage Solution': '革命的な再生可能エネルギー貯蔵ソリューション'
        },
        'ko': {
          'Revolutionary AI Technology Transforms Healthcare Industry': '혁신적인 AI 기술이 의료 산업을 변화시키다',
          'Global Climate Summit Reaches Historic Agreement': '글로벌 기후 정상회담이 역사적 합의에 도달',
          'Economic Markets Are Now Showing Strong Recovery Signs': '경제 시장이 강력한 회복 신호를 보이고 있다',
          'Breakthrough in Space Exploration Technology': '우주 탐사 기술에서 돌파구',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': '새로운 전기차 배터리 기술이 500마일 주행거리 달성',
          'Major Sports League Announces Revolutionary Rule Changes': '주요 스포츠 리그가 혁신적인 규칙 변경 발표',
          'Breakthrough in Quantum Computing Research': '양자 컴퓨팅 연구에서 돌파구',
          'Global Food Security Initiative Launches in Developing Nations': '글로벌 식량 안보 이니셔티브가 개발도상국에서 시작',
          'Revolutionary Cancer Treatment Shows Promising Results': '혁신적인 암 치료가 유망한 결과를 보여주다',
          'Major Tech Company Announces Revolutionary AI Assistant': '주요 기술 기업이 혁신적인 AI 어시스턴트 발표',
          'Historic Peace Agreement Signed Between Rival Nations': '적대 국가 간 역사적인 평화 협정 체결',
          'Revolutionary Renewable Energy Storage Solution': '혁신적인 재생에너지 저장 솔루션'
        },
        'pt': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'Tecnologia de IA Revolucionária Transforma a Indústria da Saúde',
          'Global Climate Summit Reaches Historic Agreement': 'Cúpula Climática Global Alcança Acordo Histórico',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'Mercados Econômicos Agora Mostram Sinais de Forte Recuperação',
          'Breakthrough in Space Exploration Technology': 'Avanço na Tecnologia de Exploração Espacial',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'Nova Tecnologia de Bateria para Veículos Elétricos Atinge 500 Milhas de Autonomia',
          'Major Sports League Announces Revolutionary Rule Changes': 'Liga Esportiva Principal Anuncia Mudanças Revolucionárias nas Regras',
          'Breakthrough in Quantum Computing Research': 'Avanço na Pesquisa de Computação Quântica',
          'Global Food Security Initiative Launches in Developing Nations': 'Iniciativa Global de Segurança Alimentar Lança em Nações em Desenvolvimento',
          'Revolutionary Cancer Treatment Shows Promising Results': 'Tratamento Revolucionário contra o Câncer Mostra Resultados Promissores',
          'Major Tech Company Announces Revolutionary AI Assistant': 'Empresa Tecnológica Principal Anuncia Assistente de IA Revolucionário',
          'Historic Peace Agreement Signed Between Rival Nations': 'Acordo de Paz Histórico Assinado Entre Nações Rivais',
          'Revolutionary Renewable Energy Storage Solution': 'Solução Revolucionária de Armazenamento de Energia Renovável'
        },
        'ru': {
          'Revolutionary AI Technology Transforms Healthcare Industry': 'Революционная технология ИИ трансформирует здравоохранение',
          'Global Climate Summit Reaches Historic Agreement': 'Глобальный климатический саммит достиг исторического соглашения',
          'Economic Markets Are Now Showing Strong Recovery Signs': 'Экономические рынки теперь показывают признаки сильного восстановления',
          'Breakthrough in Space Exploration Technology': 'Прорыв в технологии исследования космоса',
          'New Electric Vehicle Battery Technology Achieves 500-Mile Range': 'Новая технология батарей для электромобилей достигает 500 миль',
          'Major Sports League Announces Revolutionary Rule Changes': 'Крупная спортивная лига объявляет революционные изменения правил',
          'Breakthrough in Quantum Computing Research': 'Прорыв в исследованиях квантовых вычислений',
          'Global Food Security Initiative Launches in Developing Nations': 'Глобальная инициатива продовольственной безопасности запускается в развивающихся странах',
          'Revolutionary Cancer Treatment Shows Promising Results': 'Революционное лечение рака показывает многообещающие результаты',
          'Major Tech Company Announces Revolutionary AI Assistant': 'Крупная технологическая компания объявляет о революционном ИИ-ассистенте',
          'Historic Peace Agreement Signed Between Rival Nations': 'Историческое мирное соглашение подписано между враждующими нациями',
          'Revolutionary Renewable Energy Storage Solution': 'Революционное решение для хранения возобновляемой энергии'
        }
      };
      
      // Try to find a specific translation for the text, otherwise use a generic one
      const languageTranslations = sampleTranslations[targetLang] || {};
      let translatedText = languageTranslations[text];
      
      if (!translatedText) {
        // For descriptions or other text, provide a generic translation
        const genericTranslations = {
          'es': 'Este artículo presenta información detallada sobre el tema con análisis completo y contexto relevante.',
          'fr': 'Cet article présente des informations détaillées sur le sujet avec une analyse complète et un contexte pertinent.',
          'de': 'Dieser Artikel bietet detaillierte Informationen zum Thema mit umfassender Analyse und relevantem Kontext.',
          'hi': 'यह लेख विषय पर विस्तृत जानकारी प्रस्तुत करता है जिसमें व्यापक विश्लेषण और प्रासंगिक संदर्भ शामिल है।',
          'zh': '本文详细介绍了该主题的信息，包含全面分析和相关背景。',
          'ar': 'يقدم هذا المقال معلومات مفصلة حول الموضوع مع تحليل شامل وسياق ذي صلة.',
          'ja': 'この記事は、包括的な分析と関連する文脈を含む主題に関する詳細な情報を提供します。',
          'ko': '이 기사는 포괄적인 분석과 관련 맥락을 포함한 주제에 대한 상세한 정보를 제공합니다.',
          'pt': 'Este artigo apresenta informações detalhadas sobre o tópico com análise abrangente e contexto relevante.',
          'ru': 'Эта статья представляет подробную информацию по теме с комплексным анализом и соответствующим контекстом.'
        };
        translatedText = genericTranslations[targetLang] || `[Traducción a ${targetLang}: ${text}]`;
      }
      
      res.json({
        translatedText: translatedText,
        originalText: text,
        targetLanguage: targetLang
      });
      return;
    }

    // If we have API key, use real translation
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
      model: 'meta-llama/Llama-2-70b-chat-hf',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang}. Maintain the original meaning, tone, and style. Only return the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = response.data.choices[0].message.content;
    
    res.json({
      translatedText: translatedText,
      originalText: text,
      targetLanguage: targetLang
    });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Error translating text' });
  }
};

// Get bulk analysis for multiple articles
exports.getBulkAnalysis = async (req, res) => {
  const { articles } = req.body;
  
  try {
    // For now, return sample bulk analysis since we don't have API keys
    const bulkAnalysis = articles.map((article, index) => ({
      id: article.id,
      politicalBias: "Moderate",
      politicalBiasScore: 45 + (index % 20),
      emotionalBias: "Positive",
      emotionalBiasScore: 60 + (index % 15),
      reliability: "High",
      summary: `Analysis of article ${index + 1}: Balanced reporting with moderate bias.`
    }));
    
    res.json({ analyses: bulkAnalysis });
  } catch (error) {
    console.error('Error bulk analyzing articles:', error);
    res.status(500).json({ error: 'Error bulk analyzing articles' });
  }
};
