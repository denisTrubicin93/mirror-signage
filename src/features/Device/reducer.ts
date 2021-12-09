import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceState } from './models';

export const initialState: DeviceState = {
  camera: undefined,
  cameraId: ''
};

export const deviceStateSlice = createSlice({
  name: "device-state",
  initialState: initialState,
  reducers: {
    updateCameraState: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<'occupied' | 'not-occupied' | undefined >) => {
      state.camera = action.payload;
    },
    setCameraId: (state: DeviceState, action: PayloadAction<string>) => {
      state.cameraId = action.payload
    }
  }
});

export const { updateCameraState, setCameraId } = deviceStateSlice.actions;
export default deviceStateSlice.reducer;
