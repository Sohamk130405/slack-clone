import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;
    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });

    quill.enable(false);
    const contents = JSON.parse(value);
    quill.setContents(contents);
    const checkIsEmpty =
      isEmpty ||
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    setIsEmpty(checkIsEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [value, isEmpty]);
  return <div ref={rendererRef} className="ql-editor ql-renderer" />;
};

export default Renderer;
