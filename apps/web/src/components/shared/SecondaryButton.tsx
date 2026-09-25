import Button from "@mui/material/Button";
import { PrimaryButtonProps } from "./PrimaryButton";

export interface SecondaryButtonProps extends PrimaryButtonProps {}

function SecondaryButton({
  type,
  text,
  path,
  loading,
  disabled,
  onClick,
}: SecondaryButtonProps) {
  return (
    <Button
      href={path}
      fullWidth
      variant="outlined"
      color="primary"
      type={type}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="text-base py-xs px-xl text-nowrap">{text}</span>
    </Button>
  );
}

export default SecondaryButton;
