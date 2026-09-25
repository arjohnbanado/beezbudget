import Button from "@mui/material/Button";

export interface PrimaryButtonProps {
  type: "button" | "submit";
  text: string;
  loading?: boolean;
  disabled?: boolean;
  path?: string;
  onClick?: () => void;
}

function PrimaryButton({
  path,
  type,
  text,
  loading,
  disabled,
}: PrimaryButtonProps) {
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      type={type}
      loading={loading}
      disabled={disabled}
      href={path}
    >
      <span className="text-base text-light text-shadow-lg font-bold py-xs px-xl text-nowrap">
        {text}
      </span>
    </Button>
  );
}

export default PrimaryButton;
