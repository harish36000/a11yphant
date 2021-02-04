import { SectionType } from "app/components/challenge/SideBar";
import ToggleButton from "app/components/challenge/sidebar/ToggleButton";
import React, { SetStateAction } from "react";

export interface Instructions {
  text: string[];
  tldr: string;
  requirements: string[];
}

interface InstructionSectionProps extends Instructions {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const InstructionSection: React.FunctionComponent<InstructionSectionProps> = ({ text, tldr, requirements, open, setOpen }) => {
  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16`}>
        <ToggleButton onClick={() => setOpen(SectionType.instructions)} text="Instructions" disabled={open} />
      </h3>
      {open && (
        <div className="flex-auto overflow-y-auto px-8">
          <div className="mt-10">
            {text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-primary font-bold mt-8">{tldr}</p>
          </div>
          <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
          <div>
            <ul>
              {requirements.map((requirement) => (
                <li key={requirement} className="text-primary my-2">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructionSection;
