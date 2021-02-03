import { SectionType } from "app/components/challenge/SideBar";
import React, { SetStateAction } from "react";

export interface Hints {
  num: number;
}

interface HintSectionProps extends Hints {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const HintSection: React.FunctionComponent<HintSectionProps> = ({ num, open, setOpen }) => {
  return (
    <>
      <h3
        onClick={() => setOpen(SectionType.hints)}
        className="flex text-primary font-bold items-center justify-center h-16 border-t-2 border-primary"
      >
        Hints
      </h3>
      {open && (
        <div className="flex-auto overflow-y-auto mt-10 text-center">
          <p>You can unlock hints by clicking on the button below.</p>
          <button className="border-2 rounded-lg border-primary p-4">show me a hint</button>
        </div>
      )}
    </>
  );
};

export default HintSection;
