interface BackDropViewProps {
  children: React.ReactNode;
  isHeightContents?: boolean;
}

export default function BackDropView({
  children,
  isHeightContents = false,
}: BackDropViewProps) {
  return (
    <div
      className="overflow-y-auto rounded-lg w-[90%] bg-light p-lg md:w-[70%] lg:w-[50%] xl:w-[30%] "
      style={isHeightContents ? { maxHeight: "80%" } : { height: "80%" }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
