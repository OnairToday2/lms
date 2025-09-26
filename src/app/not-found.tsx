import { headers } from "next/headers";
import { redirect } from "next/navigation";
export async function generateMetadata() {
  return {
    title: `LMS  - ONAIR`,
  };
}

export default async function NotFound() {
  const headersList = await headers();
  // const domain = headersList.get("host") || "";
  // const fullUrl = headersList.get("referer") || "";
  // const pathname = headersList.get("x-pathname") || "";

  // if (pathname.startsWith("/dashboard")) {
  //   redirect("/dashboard/404");
  // }

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="text-center">
        <h2 className="text-2xl">Not Found</h2>
        <p>Could not find requested resource</p>
      </div>
    </div>
  );
}
