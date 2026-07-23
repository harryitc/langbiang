import { type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  childrenStagger?: boolean;
  once?: boolean;
  id?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  id,
}: RevealProps) {
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
}
