interface BackDropViewProps {
  children: React.ReactNode;
}

export default function BackDropView({ children }: BackDropViewProps) {
  return (
    <div
      className="overflow-y-auto rounded-lg w-[90%] max-h-[80%] bg-light p-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
