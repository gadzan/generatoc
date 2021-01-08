export interface List {
  index: number;
  level: number | null;
  ele: Element | null;
  children: List[];
}

export interface Params {
  content: string;
  heading?: string[];
  selector?: string;
  scrollHistory?: boolean;
  scrollOffset?: number;
  // 60 = 1s
  duration?: number;
  fold?: boolean;
}

export interface Generatoc {
  init: ({ content, heading, selector }: Params) => void;
  destroy: () => void;
  refresh: () => void;
}