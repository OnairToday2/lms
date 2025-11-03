import React from "react";
import { SPALayout } from "@/shared/ui/layouts/spa";
import Authorized from "@/modules/authWrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";

interface PropTypes {
    children: React.ReactNode;
}

const Layout = async (props: PropTypes) => {
    const { children } = props;
    return (
        <Authorized>
            <UserOrganizationWraper>
                <SPALayout loading={false}>{children}</SPALayout>
            </UserOrganizationWraper>
        </Authorized>
    );
};

export default Layout;
