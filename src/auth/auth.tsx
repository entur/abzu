import { useCallback } from "react";
import {
  AuthProvider as OidcAuthProvider,
  useAuth as useOidcAuth,
} from "react-oidc-context";
import { useConfig } from "../config/ConfigContext";

/**
 * Auth state facade
 */
export interface Auth {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: {
    name?: string;
  };
  roleAssignments?: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: ({ returnTo }: { returnTo?: string }) => Promise<void>;
  login: (redirectUri?: string) => Promise<void>;
}

/**
 * Wraps the useAuth hook from react-oidc-context and returns a facade for
 * the auth state.
 */
export const useAuth = (): Auth => {
  const { isLoading, isAuthenticated, user, signoutRedirect, signinRedirect } =
    useOidcAuth();

  const { claimsNamespace, preferredNameNamespace } = useConfig();

  const getAccessToken = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      const accessToken = user?.access_token;
      if (accessToken) {
        resolve(accessToken);
      } else {
        reject();
      }
    });
  }, [user]);

  const logout = useCallback(
    ({ returnTo }: { returnTo?: string }) => {
      return signoutRedirect({ post_logout_redirect_uri: returnTo });
    },
    [signoutRedirect],
  );

  const login = useCallback(
    (redirectUri?: string) => signinRedirect({ redirect_uri: redirectUri }),
    [signinRedirect],
  );

  return {
    isLoading,
    isAuthenticated,
    user: {
      name:
        ((preferredNameNamespace &&
          user?.profile?.[preferredNameNamespace]) as string) || "",
    },
    roleAssignments:
      ((claimsNamespace && user?.profile?.[claimsNamespace]) as string[]) || [],
    getAccessToken,
    logout,
    login,
  };
};

/**
 * Wraps AuthProvider from react-oidc-context to add the signing callback
 * and redirect uri props.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { oidcConfig } = useConfig();
  return (
    <OidcAuthProvider
      {...oidcConfig!}
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }}
      redirect_uri={
        oidcConfig?.redirect_uri ||
        window.location.origin + import.meta.env.BASE_URL
      }
    >
      {children}
    </OidcAuthProvider>
  );
};
