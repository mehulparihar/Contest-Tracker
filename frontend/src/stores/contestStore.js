import { create } from 'zustand';
import axios from 'axios';

const useContestStore = create((set) => ({
  contests: [], // All contests
  filteredContests: [], // Contests filtered by platform
  loading: false,
  error: null,

  // Fetch all contests
  fetchContests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/contest'); // Replace with your backend API
      set({ contests: response.data, filteredContests: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Filter contests by platform
  filterContests: (platform) => {
    set((state) => ({
      filteredContests:
        platform === 'All'
          ? state.contests
          : state.contests.filter((contest) => contest.platform === platform),
    }));
  },
}));

export default useContestStore;