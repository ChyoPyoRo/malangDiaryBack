export type emotionType =
  | "긍정"
  | "부정";

export interface emotion {
  Positive: number;
  Negative: number;
}

export type Scope = "all" | "friend" | "off";

export enum friendStatus {
  Waiting,
  Accepted,
  Rejected,
  Cancellation,
}
