import { Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import { FLASH_MESSAGE_PORTAL_ROOT_ID } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import X from "app/components/icons/X";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";

interface FlashMessageProps {
  show: boolean;
  onClose: () => void;
}

export const FlashMessage: React.FunctionComponent<FlashMessageProps> = ({ children, show, onClose }) => {
  const [rootNode, setRootNode] = React.useState<HTMLElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const rootNode = document.getElementById(FLASH_MESSAGE_PORTAL_ROOT_ID);
    setRootNode(rootNode);
  }, []);

  if (!rootNode) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <>
      <Transition
        appear={true}
        show={show}
        as={React.Fragment}
        enter={prefersReducedMotion ? "" : "transition duration-500 ease-in-out"}
        enterFrom="-translate-y-24"
        enterTo="translate-y-0"
        leave={prefersReducedMotion ? "" : "transition duration-500 ease-in-out"}
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-24"
      >
        <div className={clsx("w-screen absolute py-2 px-2 bg-primary z-0", "flex justify-center items-center")}>
          <span className={clsx("basis-12 flex-shrink hidden", "md:block")} />
          <div className={clsx("flex-auto pr-4 pl-9 text-left", "md:text-center")}>{children}</div>
          <Button
            onClick={onClose}
            overrideClassName
            className={clsx(
              "basis-12 shrink-0 grow-0",
              "p-3.5",
              "z-10",
              "transition-colors duration-300",
              "hover:text-primary-light",
              "focus-visible:text-primary-light",
            )}
          >
            <span className={clsx("sr-only")}>Close</span>
            <X className={clsx("w-4 h-4")} />
          </Button>
        </div>
      </Transition>
      <Transition
        appear={true}
        show={show}
        enter={prefersReducedMotion ? "" : "transition-[height] duration-500 ease-in-out"}
        enterFrom="h-0"
        enterTo="h-[3.75rem]"
        leave={prefersReducedMotion ? "" : "transition-[height] duration-500 ease-in-out"}
        leaveFrom="h-[3.75rem]"
        leaveTo="h-0"
      >
        <div className={clsx("h-[3.75rem]")} />
      </Transition>
    </>,
    rootNode,
  );
};
