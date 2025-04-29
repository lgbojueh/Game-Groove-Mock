// src/types/react-rating-stars-component.d.ts

declare module "react-rating-stars-component" {
            import { ComponentType, ReactElement } from "react";
          
            export interface RatingProps {
              count?: number;
              value?: number;
              size?: number;
              activeColor?: string;
              onChange?: (newValue: number) => void;
              edit?: boolean;
              isHalf?: boolean;
              emptyIcon?: ReactElement;
              halfIcon?: ReactElement;
              filledIcon?: ReactElement;
              a11y?: boolean;
              char?: string | ReactElement;
              className?: string;
            }
          
            const ReactStars: ComponentType<RatingProps>;
            export default ReactStars;
          }
          