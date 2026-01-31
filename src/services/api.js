import { MOCK_REGISTRY } from '../data/mockRegistry';
// const MOCK_REGISTRY = []; // Placeholder until data is restored

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || true; // Default to true for now
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // Registry Methods
    getRegistryEntries: async (filter = 'all', search = '') => {
        if (USE_MOCK) {
            await delay(500); // Simulate network latency
            let data = [...MOCK_REGISTRY];

            // Apply backend-side filtering logic simulation
            if (filter !== 'all') {
                data = data.filter(item => item.type === filter);
            }
            if (search) {
                const lowerSearch = search.toLowerCase();
                data = data.filter(item =>
                    item.subject.toLowerCase().includes(lowerSearch) ||
                    item.description.toLowerCase().includes(lowerSearch)
                );
            }
            return { data, error: null };
        } else {
            // Real API Call
            try {
                const params = new URLSearchParams({ filter, search });
                const response = await fetch(`${BASE_URL}/registry?${params}`);
                if (!response.ok) throw new Error('Failed to fetch registry');
                const data = await response.json();
                return { data, error: null };
            } catch (error) {
                console.error("API Error:", error);
                return { data: [], error: error.message };
            }
        }
    },

    submitEvidence: async (evidenceData) => {
        if (USE_MOCK) {
            await delay(800);
            console.log("MOCK API: Received submission", evidenceData);
            return { success: true, id: `rec-${Date.now()}` };
        } else {
            try {
                const response = await fetch(`${BASE_URL}/evidence`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(evidenceData)
                });
                if (!response.ok) throw new Error('Failed to submit evidence');
                const result = await response.json();
                return { success: true, ...result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
