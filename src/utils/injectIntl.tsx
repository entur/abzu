import { ComponentType } from "react";
import { IntlShape, useIntl } from "react-intl";

/**
 * Props injected by {@link injectIntl}.
 */
export interface WrappedComponentProps {
  intl: IntlShape;
}

/**
 * Drop-in replacement for react-intl's `injectIntl` HOC, which was removed in
 * react-intl v9. It wraps a component and supplies the `intl` object as a prop
 * by reading it from the (supported) `useIntl` hook.
 *
 * This keeps existing class components working without converting each of them
 * to function components/hooks. New code should prefer the `useIntl` hook
 * directly.
 */
export const injectIntl = <P extends WrappedComponentProps>(
  WrappedComponent: ComponentType<P>,
) => {
  const WithIntl = (props: Omit<P, "intl">) => {
    const intl = useIntl();
    return <WrappedComponent {...(props as P)} intl={intl} />;
  };

  WithIntl.displayName = `injectIntl(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithIntl;
};
