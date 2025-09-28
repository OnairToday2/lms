export interface WithAuthProps {}
const withAuth = (Comp: React.ElementType<WithAuthProps>) => {
  return function WrapedComponent(props: any) {
    /**
     * do something
     */
    return <Comp {...props} />;
  };
};
export default withAuth;
