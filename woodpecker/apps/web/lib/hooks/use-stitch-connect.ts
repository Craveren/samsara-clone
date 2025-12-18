export function useStitchConnect() {
  return {
    connect: () => Promise.resolve(),
    disconnect: () => {},
    isConnected: false,
  }
}

