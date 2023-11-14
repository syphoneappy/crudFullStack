import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isAdmin: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      adminUser: (state, action) => {
          state.isAdmin = action.payload
      },
    }
  });
  

export const { adminUser } = userSlice.actions;
export default userSlice.reducer;