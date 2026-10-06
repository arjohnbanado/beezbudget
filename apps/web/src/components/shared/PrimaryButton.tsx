import Button from "@mui/material/Button";
import type { SvgIconComponent } from "@mui/icons-material";

export interface PrimaryButtonProps {
  type: "button" | "submit";
  text: string;
  textClassName?: string;
  icon?: SvgIconComponent;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  path?: string;
  onClick?: () => void;
}

function PrimaryButton({
  path,
  type,
  text,
  textClassName = "text-base text-light text-shadow-lg font-bold py-xs px-xl text-nowrap",
  icon: Icon,
  iconPosition = "left",
  loading,
  disabled,
  onClick,
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
      onClick={onClick}
      startIcon={iconPosition === "left" && Icon ? <Icon /> : undefined}
      endIcon={iconPosition === "right" && Icon ? <Icon /> : undefined}
    >
      <span className={textClassName}>{text}</span>
    </Button>
  );
}

export default PrimaryButton;
