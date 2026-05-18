export {};

declare global {
  interface Window {
    Kakao?: {
      isInitialized(): boolean;
      init(appKey: string): void;
      Share: {
        sendDefault(options: unknown): void;
      };
    };
  }
}
