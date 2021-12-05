import { EditorProps } from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import clsx from "clsx";
import React from "react";

export enum EditorLanguage {
  html = "html",
  css = "css",
  javascript = "javascript",
}

interface CustomEditorProps extends Omit<EditorProps, "language" | "value" | "onChange"> {
  className?: string;
  editors: EditorConfig[];
  onReset: (language?: EditorLanguage) => void;
}

const Editors: React.FunctionComponent<CustomEditorProps> = ({ className, editors, onReset, ...props }) => {
  return (
    <div className={clsx("pb-4 flex flex-row justify-between box-border", className)}>
      {editors.map((config) => (
        <WrappedEditor onReset={onReset} key={config.heading} config={config} {...props} />
      ))}
    </div>
  );
};

export default Editors;
