import { Divider, Stack } from "@mui/material";
import AccountSetting from "../MainLayout/AccountSetting";
import { LogoOnairIcon } from "@/shared/assets/icons";

const SPAHeader = () => {
    return (
        <>
            <Stack direction="row" justifyContent="space-between" py={2} px={5}>
                <LogoOnairIcon className="h-10 w-auto" />
                <AccountSetting />
            </Stack>
            <Divider />
        </>
    );
}

export default SPAHeader;