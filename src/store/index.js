import { configureStore } from "@reduxjs/toolkit";
import { notesReducer, addNote, removeNote } from "./slices/notesSlice";

import { reset } from "./actions";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export { store, reset, addNote, removeNote };
