export interface SeparatorWithTextProps {
  text?: string;
  color?: string;
}

function SeparatorWithText({
  text = "OR continue with",
  color = "var(--color-dark)",
}: SeparatorWithTextProps) {
  return (
    <div className="flex items-center w-full my-xl">
      <div className="flex-grow border-t" style={{ borderColor: color }}></div>
      {text !== "" && (
        <span className="mx-md text-sm font-normal" style={{ color: color }}>
          {text}
        </span>
      )}

      <div className="flex-grow border-t" style={{ borderColor: color }}></div>
    </div>
  );
}

export default SeparatorWithText;
