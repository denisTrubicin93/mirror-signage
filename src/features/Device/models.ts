interface DeviceState {
  camera: 'occupied' | 'not-occupied' | undefined;
  cameraId: string
};

export { DeviceState };
