import { Box, Typography } from "@mui/material";
import Copyright from "../Copyright";
import Link from "next/link";
interface FooterProps {
  className?: string;
}
const Footer: React.FC<FooterProps> = ({ className }) => {
  const MENU_ITEMS = [
    {
      title: "Privacy policy",
    },
    {
      title: "Term & condition",
    },
    {
      title: "Contact",
    },
  ];
  return (
    <Box
      component="div"
      className="footer-wraper"
      sx={{ px: { xs: 6, md: 8, lg: 12 }, py: 4 }}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-12">
          <Copyright />
          <div className="flex items-center gap-6">
            {MENU_ITEMS.map((item, _index) => (
              <div key={_index}>
                <Link href={"/"}>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      opacity: 0.8,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>social</div>
      </div>
    </Box>
  );
};
export default Footer;
