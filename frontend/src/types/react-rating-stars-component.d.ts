// src/types/react-rating-stars-component.d.ts
import { ComponentType } from "react";

interface RatingProps {
  count?: number;
  value?: number;
  size?: number;
  activeColor?: string;
  onChange?: (newValue: number) => void;
  edit?: boolean;
  isHalf?: boolean;
  emptyIcon?: JSX.Element;
  halfIcon?: JSX.Element;
  filledIcon?: JSX.Element;
  a11y?: boolean;
  char?: string | JSX.Element;
  className?: string;
}

declare const StarRating: ComponentType<RatingProps>;
export default StarRating;
