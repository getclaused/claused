interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function Container({ children, className = "", narrow = false }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 md:px-8 ${
        narrow ? "max-w-[840px]" : "max-w-[1120px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
