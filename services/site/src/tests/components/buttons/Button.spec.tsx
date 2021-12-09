import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Button from "app/components/buttons/Button";

const buttonText = "Button Text";

afterEach(cleanup);

describe("Button", () => {
  it("renders text", () => {
    const { container } = render(<Button>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
    expect(container.querySelectorAll("button")).toHaveProperty("length", 1);
  });

  it("className is added", () => {
    const cl = "test-class";
    render(<Button className={cl}>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" }).classList.contains(cl)).toBeTruthy();
  });

  it("override className", () => {
    render(<Button overrideClassName>{buttonText}</Button>);

    // expected value is {"0": "undefined", "1": "false"}
    expect(screen.getByText(buttonText, { selector: "button" }).classList.length).toBeLessThanOrEqual(2);
  });

  it("full attribute works", () => {
    const { container } = render(<Button primary>{buttonText}</Button>);

    expect(container.querySelector("button.bg-primary")).toBeTruthy();
    expect(container.querySelector("button.text-light")).toBeTruthy();
  });

  it("icon works", () => {
    const icon = <svg />;
    const srText = "Screen Reader Text";

    const { container } = render(
      <Button srText={srText}>
        {icon}
        {buttonText}
      </Button>,
    );

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
    expect(screen.getByText(srText, { selector: "span" })).toBeTruthy();
  });
});
