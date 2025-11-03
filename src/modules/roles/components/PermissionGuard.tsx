import { PemissionCheck, usePermissions } from "../store/PermissionsProvider";

export default function PermissionGuard(props: {
  perms: PemissionCheck[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermissions } = usePermissions();
  const isAllowed = hasPermissions(props.perms);

  if (!isAllowed) return <>{props.fallback ?? null}</>;
  return <>{props.children}</>;
}
