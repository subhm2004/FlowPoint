import { getCurrentUserQueryFn } from "@/lib/api";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const useAuth = () => {
  const { pathname } = useLocation();
  const skipCurrentUser =
    pathname === AUTH_ROUTES.SIGN_IN || pathname === AUTH_ROUTES.SIGN_UP;

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: skipCurrentUser ? false : 2,
    enabled: !skipCurrentUser,
  });
  return query;
};

export default useAuth;
