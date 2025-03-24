import { create } from 'zustand';
import axios from 'axios';


const useContestStore = create((set, get) => ({
  contests: [],
  filteredContests: [],
  bookmarks: [],
  loading: false,
  error: null,

  // Fetch all contests
  fetchContests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/contest');
      set({ contests: response.data, filteredContests: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPastContests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/contest/past');
      set({ contests: response.data, filteredContests: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  fetchBookmark: async (user) => {
    set({ loading: true, error: null });
    try {
      if(!user) return;
      const response = await axios.get('/api/contest/bookmark');
      console.log(response);
      set({ bookmarks : response.data.bookmarks, loading: false });
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
  toggleBookmark: async (contestId) => {
    try {
      const res = await axios.post('/api/contest/toogleBookmark', {contestId });
      set({ bookmarks: res.data.bookmarks });
    } catch (err) {
      console.error('Error toggling bookmark:', err.message);
    }
  },


}));

export default useContestStore;