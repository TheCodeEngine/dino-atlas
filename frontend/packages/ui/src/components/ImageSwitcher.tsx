import { useState } from "react";

interface ImageView {
  id: string;
  label: string;
  icon: string;
  url: string;
  bg?: string;
  contain?: boolean;
}

interface ImageSwitcherProps {
  views: ImageView[];
  defaultView?: string;
  alt: string;
  square?: boolean;
}

export function ImageSwitcher({ views, defaultView, alt, square = false }: ImageSwitcherProps) {
  const [active, setActive] = useState(defaultView ?? views[0]?.id ?? "");
  const current = views.find((v) => v.id === active) ?? views[0]!;

  return (
    <div>
      <div
        className={`rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden ${current.bg ?? ""}`}
      >
        <img
          src={current.url}
          alt={`${alt} — ${current.label}`}
          className={`w-full ${square ? "aspect-square" : "h-44"} ${current.contain ? "object-contain p-2" : "object-cover"}`}
        />
      </div>

      {views.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActive(view.id)}
              className={[
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                active === view.id
                  ? "bg-primary-container text-white border-[2px] border-on-surface shadow-[2px_2px_0px_0px_#1c1c17]"
                  : "bg-surface-container-low text-on-surface-variant border-[2px] border-outline-variant",
              ].join(" ")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
