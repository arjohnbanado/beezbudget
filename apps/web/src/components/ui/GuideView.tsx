interface GuideViewProps {
  children: React.ReactNode;
}

export default function GuideView({ children }: GuideViewProps) {
  return (
    <div className="min-h-screen md:bg-canvas md:flex md:items-center md:justify-center">
      <div className="h-max p-lg pb-2xl flex flex-col gap-md sm:p-xl md:pb-2xl md:bg-light md:w-[70%] lg:w-[50%] xl:w-[30%] md:my-xl md:rounded-lg">
        {children}
      </div>
    </div>
  );
}
