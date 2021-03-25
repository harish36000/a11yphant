import React from "react";

import CollapsableSection from "./CollapsableSection";

interface EvaluationBodyProps {
  className?: string;
  requirementTitle: string;
  checks: any; //TODO: replace when graphQL Endpoint is ready
}

const EvaluationBody: React.FunctionComponent<EvaluationBodyProps> = ({ className, requirementTitle, checks }) => {
  return (
    <div className={`${className} flex flex-col items-left w-full box-border h-full m-auto`}>
      <h3 className="text-white font-bold h2 mb-2"> {requirementTitle}</h3>
      <CollapsableSection passed={true} title={checks.title} description={checks.description} />
    </div>
  );
};

export default EvaluationBody;
