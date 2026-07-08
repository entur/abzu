import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Component } from "react";
import { IntlProvider, IntlShape } from "react-intl";
import { describe, expect, test } from "vitest";
import { injectIntl, WrappedComponentProps } from "../utils/injectIntl";

const messages = { greeting: "Hello {name}" };

const renderWithIntl = (ui: React.ReactNode) =>
  render(
    <IntlProvider locale="en" messages={messages}>
      {ui}
    </IntlProvider>,
  );

describe("injectIntl shim", () => {
  test("injects a working intl prop into a function component", () => {
    const FnComponent = ({ intl }: WrappedComponentProps) => (
      <span data-testid="out">
        {intl.formatMessage({ id: "greeting" }, { name: "World" })}
      </span>
    );
    const Wrapped = injectIntl(FnComponent);

    renderWithIntl(<Wrapped />);

    expect(screen.getByTestId("out")).toHaveTextContent("Hello World");
  });

  test("injects a working intl prop into a class component", () => {
    // 46 of the migrated files are class components reading this.props.intl.
    class ClassComponent extends Component<WrappedComponentProps> {
      render() {
        return (
          <span data-testid="out">
            {this.props.intl.formatMessage(
              { id: "greeting" },
              { name: "Class" },
            )}
          </span>
        );
      }
    }
    const Wrapped = injectIntl(ClassComponent);

    renderWithIntl(<Wrapped />);

    expect(screen.getByTestId("out")).toHaveTextContent("Hello Class");
  });

  test("forwards own props through to the wrapped component", () => {
    interface Props extends WrappedComponentProps {
      label: string;
    }
    const FnComponent = ({ intl, label }: Props) => (
      <span data-testid="out">
        {label}: {intl.formatMessage({ id: "greeting" }, { name: "x" })}
      </span>
    );
    const Wrapped = injectIntl(FnComponent);

    renderWithIntl(<Wrapped label="mylabel" />);

    expect(screen.getByTestId("out")).toHaveTextContent("mylabel: Hello x");
  });

  test("intl passed to the component is the same instance from context", () => {
    let captured: IntlShape | undefined;
    const FnComponent = ({ intl }: WrappedComponentProps) => {
      captured = intl;
      return null;
    };
    const Wrapped = injectIntl(FnComponent);

    renderWithIntl(<Wrapped />);

    expect(captured).toBeDefined();
    expect(captured?.locale).toBe("en");
    expect(typeof captured?.formatMessage).toBe("function");
  });

  test("sets a helpful displayName", () => {
    const Named = (_props: WrappedComponentProps) => null;
    expect(injectIntl(Named).displayName).toBe("injectIntl(Named)");
  });
});
