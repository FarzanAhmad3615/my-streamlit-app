const STORAGE_KEYS = {
    HISTORY: 'study_buddy_history',
    QUIZ_SCORES: 'study_buddy_quiz_scores'
};

export const storageService = {
    // Save a quiz result
    saveQuizResult: (topic, score, total) => {
        try {
            const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES) || '[]');
            const newResult = {
                id: Date.now(),
                topic,
                score,
                total,
                date: new Date().toISOString()
            };
            results.unshift(newResult); // Add to top
            localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(results));
            return newResult;
        } catch (e) {
            console.error("Error saving quiz result", e);
        }
    },

    // Get all quiz scores
    getQuizScores: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES) || '[]');
        } catch (e) {
            return [];
        }
    },

    // Save a recent activity (e.g. topic explained)
    addToHistory: (activityType, topic) => {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
            const newActivity = {
                id: Date.now(),
                type: activityType,
                topic,
                date: new Date().toISOString()
            };
            // Keep only last 50 items
            const updatedHistory = [newActivity, ...history].slice(0, 50);
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("Error saving history", e);
        }
    },

    getHistory: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
        } catch (e) {
            return [];
        }
    },

    clearData: () => {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORES);
    }
};
