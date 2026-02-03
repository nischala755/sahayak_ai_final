/**
 * SAHAYAK AI SDK - JavaScript/TypeScript Client
 * 
 * Lightweight SDK for integrating SAHAYAK AI classroom coaching.
 * 
 * @example
 * import { SahayakAI } from './sahayak-sdk.js';
 * const client = new SahayakAI({ apiKey: 'demo-key' });
 * const playbook = await client.getPlaybook('Students struggling with fractions');
 */

// Mock playbooks for demo mode
const MOCK_PLAYBOOKS = {
    fractions: {
        id: 'pb_fractions_001',
        problem: 'Students not understanding fractions',
        whatToSay: [
            "Let's divide this roti into equal parts",
            "Fold the paper in half - that's 1/2",
            "Now fold it again - what do we have?",
            "Share equally among friends"
        ],
        activity: {
            name: 'Paper Folding Fractions',
            steps: [
                'Give each student a piece of paper',
                'Fold in half - label as 1/2',
                'Fold again - label as 1/4',
                'Compare and discuss'
            ],
            materials: ['Paper', 'Crayons', 'Scissors'],
            durationMinutes: 15
        },
        classManagement: [
            'Use pair work for folding activity',
            'Walk around and check each pair',
            'Praise accurate folding'
        ],
        quickCheck: {
            questions: ['What is half of this paper?', 'How many quarters in a whole?'],
            expectedResponses: ['1/2', '4 quarters'],
            successIndicators: ['Can fold accurately', 'Can name fractions']
        },
        trustScore: 0.92,
        ncertReferences: [{ chapter: 'Fractions', class: '4', page: '45' }],
        youtubeResources: [{ title: 'Fun with Fractions', url: 'https://youtube.com/watch?v=demo1' }],
        fromCache: false,
        language: 'en'
    },
    counting: {
        id: 'pb_counting_001',
        problem: 'Students not learning counting',
        whatToSay: [
            "Come children, let's play a counting game",
            "Show me your fingers",
            "Count one, two, three with me",
            "Now count the stones"
        ],
        activity: {
            name: 'Finger Counting Game',
            steps: [
                'Start with finger counting song',
                'Count classroom objects',
                'Play counting relay race',
                'Practice writing numbers'
            ],
            materials: ['Stones', 'Sticks', 'Chalk'],
            durationMinutes: 10
        },
        classManagement: ['Make it a fun game', 'Use clapping rhythm', 'Celebrate every attempt'],
        quickCheck: {
            questions: ['Show me 5 fingers', 'Count to 10'],
            expectedResponses: ['Shows 5', 'Counts correctly'],
            successIndicators: ['Active participation', 'Correct counting']
        },
        trustScore: 0.95
    },
    attention: {
        id: 'pb_attention_001',
        problem: 'Students not paying attention',
        whatToSay: [
            "Everyone stand up!",
            "Touch your toes, touch the sky",
            "Clap 3 times if you can hear me",
            "Eyes on me, 1-2-3"
        ],
        activity: {
            name: 'Brain Break Activity',
            steps: [
                'Stand and stretch',
                'Simon Says game (2 min)',
                'Deep breath together',
                'Return to seats quietly'
            ],
            materials: ['None needed'],
            durationMinutes: 5
        },
        classManagement: [
            'Use attention signals consistently',
            'Eye contact with distracted students',
            'Positive reinforcement'
        ],
        quickCheck: {
            questions: ['Who can tell me what we were learning?'],
            expectedResponses: ['Students recall topic'],
            successIndicators: ['Focused eyes', 'Ready posture']
        },
        trustScore: 0.88
    }
};

/**
 * Teaching context for personalized responses
 */
class TeacherContext {
    constructor({
        grade = 3,
        subject = 'General',
        topic = '',
        language = 'en',
        ruralConstraints = []
    } = {}) {
        this.grade = grade;
        this.subject = subject;
        this.topic = topic;
        this.language = language;
        this.ruralConstraints = ruralConstraints;
    }
}

/**
 * SAHAYAK AI SDK Client
 */
class SahayakAI {
    /**
     * Create a SAHAYAK AI client
     * @param {Object} config - Configuration options
     * @param {string} config.apiKey - API key (use 'demo-key' for demo)
     * @param {string} config.baseUrl - API base URL
     * @param {string} config.language - Default language (en/hi)
     * @param {number} config.timeout - Request timeout in ms
     */
    constructor({
        apiKey = 'demo-key',
        baseUrl = 'http://localhost:8000/api',
        language = 'en',
        timeout = 30000
    } = {}) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.language = language;
        this.timeout = timeout;
        this._demoMode = apiKey === 'demo-key';
        this._cache = new Map();
    }

    /**
     * Generate cache key for request
     * @private
     */
    _getCacheKey(text, context) {
        return `${text}:${context.grade}:${context.subject}:${context.language}`;
    }

    /**
     * Detect topic from natural language
     * @private
     */
    _detectTopic(text) {
        const textLower = text.toLowerCase();

        const keywords = {
            fractions: ['fraction', 'divide', 'half', 'quarter', 'भिन्न'],
            counting: ['counting', 'count', 'number', 'गिनती'],
            attention: ['attention', 'focus', 'distracted', 'ध्यान', 'fidgeting']
        };

        for (const [topic, words] of Object.entries(keywords)) {
            if (words.some(word => textLower.includes(word))) {
                return topic;
            }
        }

        return 'attention';
    }

    /**
     * Get a teaching playbook
     * @param {string} problem - Problem description
     * @param {TeacherContext} context - Teaching context
     * @param {boolean} useCache - Whether to use cache
     * @returns {Promise<Object>} Playbook object
     */
    async getPlaybook(problem, context = null, useCache = true) {
        if (!context) {
            context = new TeacherContext({ language: this.language });
        }

        // Check cache
        const cacheKey = this._getCacheKey(problem, context);
        if (useCache && this._cache.has(cacheKey)) {
            const cached = this._cache.get(cacheKey);
            return { ...cached, fromCache: true };
        }

        // Demo mode - return mock data
        if (this._demoMode) {
            const topic = this._detectTopic(problem);
            const playbook = { ...MOCK_PLAYBOOKS[topic], language: context.language };
            this._cache.set(cacheKey, playbook);
            return playbook;
        }

        // Real API call
        const response = await fetch(`${this.baseUrl}/sos/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: problem,
                context: {
                    grade: context.grade,
                    subject: context.subject,
                    topic: context.topic,
                    language: context.language
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.playbook;
    }

    /**
     * Get cached quick fixes
     * @param {Object} options - Filter options
     * @returns {Promise<Array>} Quick fixes
     */
    async getQuickFixes({ grade, subject, limit = 10 } = {}) {
        if (this._demoMode) {
            let fixes = [
                { id: 'qf1', topic: 'Counting', grade: 1, subject: 'Math', usageCount: 234 },
                { id: 'qf2', topic: 'Addition', grade: 2, subject: 'Math', usageCount: 189 },
                { id: 'qf3', topic: 'Reading', grade: 1, subject: 'Hindi', usageCount: 156 },
                { id: 'qf4', topic: 'Attention', grade: 3, subject: 'General', usageCount: 298 },
                { id: 'qf5', topic: 'Fractions', grade: 4, subject: 'Math', usageCount: 145 }
            ];

            if (grade) fixes = fixes.filter(f => f.grade === grade);
            if (subject) fixes = fixes.filter(f => f.subject === subject);

            return fixes.slice(0, limit);
        }

        const response = await fetch(`${this.baseUrl}/sos/quick-fixes?limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });

        return response.json();
    }

    /**
     * Get teacher readiness signal
     * @param {string} teacherId - Teacher ID
     * @returns {Promise<Object>} Readiness signal
     */
    async getTeacherReadiness(teacherId) {
        if (this._demoMode) {
            return {
                teacherId,
                status: 'ready',
                score: 0.85,
                recentStruggles: ['Fractions', 'Word Problems'],
                recommendedActions: [
                    'Review fraction concepts before class',
                    'Prepare visual aids for word problems'
                ]
            };
        }

        const response = await fetch(`${this.baseUrl}/teacher/${teacherId}/readiness`, {
            headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });

        return response.json();
    }

    /**
     * Submit feedback on a playbook
     * @param {string} playbookId - Playbook ID
     * @param {boolean} wasSuccessful - Whether it worked
     * @param {string} notes - Optional notes
     * @returns {Promise<Object>} Confirmation
     */
    async submitFeedback(playbookId, wasSuccessful, notes = null) {
        if (this._demoMode) {
            return {
                status: 'success',
                message: 'Feedback recorded',
                playbookId,
                timestamp: new Date().toISOString()
            };
        }

        const response = await fetch(`${this.baseUrl}/sos/feedback`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playbookId, wasSuccessful, notes })
        });

        return response.json();
    }
}

/**
 * Quick helper function - get playbook without creating client
 * @param {string} problem - Problem description
 * @param {string} language - Language preference
 * @returns {Promise<Object>} Playbook
 */
async function quickHelp(problem, language = 'en') {
    const client = new SahayakAI({ apiKey: 'demo-key', language });
    return client.getPlaybook(problem);
}

// Export for ES modules
export { SahayakAI, TeacherContext, quickHelp };

// Export for CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SahayakAI, TeacherContext, quickHelp };
}

// Demo
if (typeof window === 'undefined' && typeof process !== 'undefined') {
    // Node.js environment - run demo
    (async () => {
        console.log('='.repeat(60));
        console.log('SAHAYAK AI SDK - JavaScript Demo');
        console.log('='.repeat(60));

        const client = new SahayakAI({ apiKey: 'demo-key' });

        console.log('\n📚 Getting playbook for fractions...');
        const playbook = await client.getPlaybook('Students struggling with fractions');

        console.log(`\n✅ Playbook ID: ${playbook.id}`);
        console.log(`📝 Problem: ${playbook.problem}`);
        console.log(`🎯 Trust Score: ${Math.round(playbook.trustScore * 100)}%`);
        console.log('\n💬 What to Say:');
        playbook.whatToSay.forEach(phrase => console.log(`   • ${phrase}`));

        console.log('\n' + '='.repeat(60));
        console.log('✅ SDK Demo Complete!');
    })();
}
