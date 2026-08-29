export type ViewportScope = 'all' | 'desktop' | 'tablet' | 'mobile';
export type ViewportType = 'desktop' | 'tablet' | 'mobile';

export interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  gap?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: string;
  alignItems?: string;
  gridTemplateColumns?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  minHeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface ElementLayout {
  order?: number;
  flexGrow?: number;
  alignSelf?: string;
  zIndex?: number;
  display?: string;
  position?: 'static' | 'relative' | 'absolute';
  top?: string;
  left?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gridTemplateColumns?: string;
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
}

export interface ElementContent {
  text?: string;
  tagline?: string;
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  linkText?: string;
  linkHref?: string;
  icon?: string;
  listItems?: string[];
}

export interface ViewportOverride {
  style?: ElementStyle;
  layout?: ElementLayout;
  content?: ElementContent;
}

export interface ViewportOverrides {
  desktop?: ViewportOverride;
  tablet?: ViewportOverride;
  mobile?: ViewportOverride;
}

export interface ElementHistorySnapshot {
  style: ElementStyle;
  layout: ElementLayout;
  content: ElementContent;
  overrides: ViewportOverrides;
}

export interface ElementHistoryEntry {
  id: string;
  timestamp: string;
  scope: ViewportScope;
  source: 'manual' | 'ai' | 'code' | 'recovery' | 'initial';
  description: string;
  snapshot: ElementHistorySnapshot;
}

export interface TemplateElement {
  id: string;
  type: 'container' | 'section' | 'heading' | 'text' | 'button' | 'image' | 'badge' | 'card' | 'grid' | 'nav';
  name: string;
  parentId: string | null;
  children: string[];
  content: ElementContent;
  style: ElementStyle;
  layout: ElementLayout;
  overrides: ViewportOverrides;
  revision: number;
  history: ElementHistoryEntry[];
}

export interface GlobalStyles {
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface TemplateModel {
  id: string;
  name: string;
  version: number;
  rootId: string;
  globalStyles: GlobalStyles;
  elements: Record<string, TemplateElement>;
}

export interface EditCommand {
  id: string;
  timestamp: string;
  source: 'manual' | 'ai' | 'code' | 'recovery';
  targetIds: string[];
  viewportScope: ViewportScope;
  changes: Record<string, {
    content?: Partial<ElementContent>;
    style?: Partial<ElementStyle>;
    layout?: Partial<ElementLayout>;
  }>;
  description: string;
}

export interface AIProposalItem {
  elementId: string;
  elementName: string;
  proposed: {
    content?: Partial<ElementContent>;
    style?: Partial<ElementStyle>;
    layout?: Partial<ElementLayout>;
  };
  beforeSnapshot: ElementHistorySnapshot;
  scope: ViewportScope;
  reasoning: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface AIProposalResult {
  id: string;
  timestamp: string;
  prompt: string;
  viewportScope: ViewportScope;
  success: boolean;
  error?: string;
  items: AIProposalItem[];
}
