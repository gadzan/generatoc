interface List {
  level: number | null;
  ele: Element | null;
  children: List[];
}

interface Params {
  content: string;
  heading?: string[];
  selector?: string;
}

interface Generatoc {
  init?: Function
}
