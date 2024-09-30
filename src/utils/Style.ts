import { Style, GenericStyleProp } from "@hippy/react";

// 工具：解析styleProps（数组或空）为style
export function transferStyle(style: GenericStyleProp<GenericStyleProp<Style> | null | undefined | false>): Style {
  let result: Style = {};
  if (Array.isArray(style)) {
    style.forEach((item) => {
      result = Object.assign({}, result, transferStyle(item));
    });
  } else {
    result = ({ ...style });
  }
  return result;
}
