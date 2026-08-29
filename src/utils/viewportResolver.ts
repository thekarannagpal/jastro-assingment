import type { TemplateElement, ViewportType, ElementStyle, ElementLayout, ElementContent } from '../types/template';

export interface ResolvedElementProps {
  style: ElementStyle;
  layout: ElementLayout;
  content: ElementContent;
  hasViewportOverride: boolean;
  overriddenKeys: {
    style: string[];
    layout: string[];
    content: string[];
  };
}

export function resolveElementForViewport(
  element: TemplateElement,
  viewport: ViewportType
): ResolvedElementProps {
  const baseStyle = { ...element.style };
  const baseLayout = { ...element.layout };
  const baseContent = { ...element.content };

  const override = element.overrides?.[viewport];

  if (!override) {
    return {
      style: baseStyle,
      layout: baseLayout,
      content: baseContent,
      hasViewportOverride: false,
      overriddenKeys: { style: [], layout: [], content: [] }
    };
  }

  const resolvedStyle: ElementStyle = {
    ...baseStyle,
    ...(override.style || {})
  };

  const resolvedLayout: ElementLayout = {
    ...baseLayout,
    ...(override.layout || {})
  };

  const resolvedContent: ElementContent = {
    ...baseContent,
    ...(override.content || {})
  };

  const overriddenStyleKeys = override.style ? Object.keys(override.style) : [];
  const overriddenLayoutKeys = override.layout ? Object.keys(override.layout) : [];
  const overriddenContentKeys = override.content ? Object.keys(override.content) : [];

  const hasOverride =
    overriddenStyleKeys.length > 0 ||
    overriddenLayoutKeys.length > 0 ||
    overriddenContentKeys.length > 0;

  return {
    style: resolvedStyle,
    layout: resolvedLayout,
    content: resolvedContent,
    hasViewportOverride: hasOverride,
    overriddenKeys: {
      style: overriddenStyleKeys,
      layout: overriddenLayoutKeys,
      content: overriddenContentKeys
    }
  };
}
