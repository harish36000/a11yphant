import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CodeLevel } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import HintList from "./sidebar/HintList";

interface SidebarProps {
  className?: string;
  challengeName: string;
  level: Pick<CodeLevel, "instructions" | "tasks">;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ className, challengeName, level }) => {
  return (
    <section className={clsx("h-full w-[45%]", "container-dark", "xl:w-[40%] 2xl:w-[28%]", className)}>
      <ScrollOverlayWrapper className="max-h-full" classNameTopOverlay="h-28 -mb-28" classNameBottomOverlay="h-28 -mt-28">
        <div className="py-4 px-7">
          <h2 className={clsx("text-grey-middle", "h6")}>{challengeName}</h2>
          <h3 className={clsx("my-8", "h4")}>Instructions</h3>
          <div className={clsx("whitespace-pre-wrap", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(level.instructions) }} />
          <HintList tasks={level.tasks} />
        </div>
      </ScrollOverlayWrapper>
    </section>
  );
};

export default Sidebar;
