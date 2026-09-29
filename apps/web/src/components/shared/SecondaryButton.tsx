import Button from "@mui/material/Button";
import { PrimaryButtonProps } from "./PrimaryButton";

export type SecondaryButtonProps = PrimaryButtonProps;

function SecondaryButton({
  type,
  text,
  textClassName = "text-base py-xs px-xl text-nowrap",
  path,
  icon: Icon,
  iconPosition = "left",
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
      startIcon={iconPosition === "left" && Icon ? <Icon /> : undefined}
      endIcon={iconPosition === "right" && Icon ? <Icon /> : undefined}
    >
      <span className={textClassName}>{text}</span>
    </Button>
  );
}

export default SecondaryButton;
