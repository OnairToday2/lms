import SvgIcon from "@mui/material/SvgIcon";

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...rest }) => {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
      >
        <path d="M6 9L12 15L18 9" />
      </svg>
    </SvgIcon>
  );
};

export default ChevronDownIcon;
