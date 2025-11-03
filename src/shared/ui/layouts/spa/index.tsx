import { Box } from "@mui/material";
import SPAHeader from "./header";

interface PropTypes {
    children: React.ReactNode;
    loading?: boolean;
}

export const SPALayout: React.FC<PropTypes> = async ({
    children,
    loading
}) => {
    return (
        <>
            <SPAHeader />
            <Box
            >
                {children}
            </Box>
            {loading && <h1>Loading....</h1>}
        </>
    );
};
