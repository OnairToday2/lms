import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";

interface SessionAccordionProps extends React.PropsWithChildren {
  summary?: React.ReactNode;
  detail?: React.ReactNode;
  index: number;
  title?: string;
  status?: "idle" | "valid" | "invalid";
}
const SessionAccordion: React.FC<SessionAccordionProps> = ({
  summary,
  detail,
  index = 0,
  children,
  title,
  status = "idle",
}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        className="felx items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Typography
            component="span"
            sx={{
              width: "1.25rem",
              height: "1.25rem",
              background: "#7B61FF",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              fontWeight: "bold",
              color: "white",
              fontSize: "0.75rem",
            }}
          >
            {index + 1}
          </Typography>

          <Typography component="span" sx={{ fontWeight: 600 }}>
            {title ? title : `Lớp học ${index + 1}`}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
export default SessionAccordion;
