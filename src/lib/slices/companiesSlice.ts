import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Company {
  id: string;
  name: string;
  ceoKeyPerson: {
    name: string;
    avatar: string;
  };
  revenue: string;
  profit: string;
  profitChange: number;
  ebitda: string;
  coreMargin: number;
  coreMarginChange: number;
  keyInsights: string;
  category: string;
}

interface CompaniesState {
  companies: Company[];
  allCompanies: Company[]; // Store all companies for filtering
  loading: boolean;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: CompaniesState = {
  companies: [],
  allCompanies: [],
  loading: false,
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setAllCompanies: (state, action: PayloadAction<Company[]>) => {
      state.allCompanies = action.payload;
      state.totalItems = action.payload.length;
      state.totalPages = Math.ceil(action.payload.length / state.itemsPerPage);
    },
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.totalPages = Math.ceil(state.totalItems / action.payload);
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    updatePagination: (state, action: PayloadAction<{ totalItems: number }>) => {
      state.totalItems = action.payload.totalItems;
      state.totalPages = Math.ceil(action.payload.totalItems / state.itemsPerPage);
      // Ensure current page is not beyond total pages
      if (state.currentPage > state.totalPages) {
        state.currentPage = Math.max(1, state.totalPages);
      }
    },
  },
});

export const { 
  setAllCompanies,
  setCompanies, 
  setLoading, 
  setSearchQuery, 
  setSorting,
  setCurrentPage,
  setItemsPerPage,
  updatePagination
} = companiesSlice.actions;
