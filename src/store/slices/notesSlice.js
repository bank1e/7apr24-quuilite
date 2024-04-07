import { createSlice } from "@reduxjs/toolkit";
import { reset } from "../actions";

const notesSlice = createSlice({
  name: "note",
  initialState: [],
  reducers: {
    addNote(state, action) {
      state.push(action.payload);
    },
    removeNote(state, action) {
      // action.payload === string, the note we want to remove
      const index = state.indexOf(action.payload);
      state.splice(index, 1);
    },
  },
  extraReducers(builder) {
    builder.addCase(reset, (state, action) => {
      return [];
    });
  },
});

export const { addNote, removeNote } = notesSlice.actions;
export const notesReducer = notesSlice.reducer;
