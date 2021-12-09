import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Top3Disease {
  name: string,
  personAmount: string,
  percent: number
}

export interface AgingDisease {
  fromAge: number,
  toAge: number,
  aging: number,
  top3Diseases: Top3Disease[],
  imageBase64: string
}

export interface AgingState {
  loading: boolean,
  error: boolean,
  agingDiseases: AgingDisease[]
}

const initialState: AgingState = {
  agingDiseases: [],
  loading: false,
  error: false,
}

const agingSlice = createSlice({
  name: 'aging',
  initialState,
  reducers: {
    fetchAgingImages: (state: AgingState) => {
      state.loading = true
      state.error = false;
    },
    agingImagesFetched: (state: AgingState, action: PayloadAction<AgingDisease[]>) => {
      state.loading = false
      state.agingDiseases = [...action.payload]
    },
    agingFetchedError: (state: AgingState) => {
      state.loading = false
      state.error = true
    },
    resetState: (state: AgingState) => {
      state.loading = false
      state.error = false;
      state.agingDiseases = []
    }
  }
})

export default agingSlice.reducer
export const {actions} = agingSlice;