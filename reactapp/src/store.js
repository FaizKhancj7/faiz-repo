// This is the main Redux Store. It combines all our slices into one central database.
// All the data for our app lives here.

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// We create the store and add our userReducer to it.
const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export default store;
