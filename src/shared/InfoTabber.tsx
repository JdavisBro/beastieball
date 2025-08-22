import React from "react";

export default function InfoTabberHeader<T extends string | number>({
  tab,
  setTab,
  tabs,
  className,
}: {
  tab: T;
  setTab: (tab: T) => void;
  tabs: T extends number ? React.ReactNode[] : Record<string, React.ReactNode>;
  className?: string;
}) {
  return (
    <div className={className ? `tabber ${className}` : "tabber"}>
      {Object.entries(tabs).map(([key, name]) => {
        if (!name) {
          return null;
        }
        const keyCorrect = (typeof tab == "number" ? Number(key) : key) as T;
        return (
          <button
            key={key}
            className={tab == keyCorrect ? "tabberSelected" : undefined}
            onClick={() => setTab(keyCorrect)}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
