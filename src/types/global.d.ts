export {};

type VaraText = {
  text: string;
  fontSize: number;
  strokeWidth: number;
  color: string;
  duration: number;
  textAlign: string;
  x: number;
  y: number;
  fromCurrentPosition: { x: boolean; y: boolean };
};

type VaraInstance = {
  ready(callback: () => void): void;
  playAll(): void;
};

type VaraConstructor = new (
  selector: string,
  fontSource: string,
  texts: VaraText[],
  options: {
    strokeWidth: number;
    fontSize: number;
    textAlign: string;
    autoAnimation: boolean;
  }
) => VaraInstance;

declare global {
  interface Window {
    Vara?: VaraConstructor;
    Kakao?: {
      isInitialized(): boolean;
      init(appKey: string): void;
      Share: {
        sendDefault(options: unknown): void;
      };
    };
  }
}
