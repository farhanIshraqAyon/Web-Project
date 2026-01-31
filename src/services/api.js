import { MOCK_REGISTRY } from '../data/mockRegistry';
import { MOCK_CATS } from '../data/mockCats';
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
    },

    // Cat Census Methods
    getCats: async (search = '') => {
        if (USE_MOCK) {
            await delay(400);
            let data = [...MOCK_CATS];
            if (search) {
                const lowerSearch = search.toLowerCase();
                data = data.filter(cat => cat.name.toLowerCase().includes(lowerSearch));
            }
            return { data, error: null };
        } else {
            try {
                const response = await fetch(`${BASE_URL}/cats?search=${search}`);
                if (!response.ok) throw new Error('Failed to fetch census');
                const data = await response.json();
                return { data, error: null };
            } catch (error) {
                return { data: [], error: error.message };
            }
        }
    },

    registerCat: async (catData) => {
        if (USE_MOCK) {
            await delay(800);

            // SIMULATE FILE UPLOAD: Convert File object to a fake URL (or reuse blob if possible, but blobs revoke)
            // For this mock, we'll just check if it's a file and assign a placeholder if we can't persist it properly
            // In a real app, 'catData' would likely be FormData, and the server would return the URL.

            let finalPhotoUrl = catData.photoUrl;

            if (catData.photoFile) {
                // In a browser-only mock without persistence, we can't easily store the Blob URL forever after refresh
                // But for the session it works. Or we pretend we uploaded it.
                // Let's generate a random placeholder based on the file name to simulate "stored" url
                console.log("MOCK API: Uploading file...", catData.photoFile.name);
                finalPhotoUrl = `https://placekitten.com/400/400?random=${Date.now()}`;
            }

            const newCat = {
                id: `cat-${Date.now()}`,
                name: catData.name,
                dob: catData.dob,
                photoUrl: finalPhotoUrl || 'https://placekitten.com/200/200',
                status: catData.status
            };

            // Add to local mock array so it appears in the list immediately (persists until refresh)
            MOCK_CATS.push(newCat);

            return { success: true, id: newCat.id };
        } else {
            try {
                // Real implementation would likely look like this:
                // const formData = new FormData();
                // formData.append('name', catData.name);
                // formData.append('dob', catData.dob);
                // formData.append('photo', catData.photoFile);

                // const response = await fetch(`${BASE_URL}/cats`, { method: 'POST', body: formData });

                // For now, assuming JSON for consistency with previous pattern unless changed:
                const response = await fetch(`${BASE_URL}/cats`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(catData)
                });
                if (!response.ok) throw new Error('Failed to register cat');
                const result = await response.json();
                return { success: true, ...result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
