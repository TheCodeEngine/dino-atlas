import { Icon } from "../primitives/Icon";

export interface DinoHeaderProps {
  name: string;
  latin: string;
  onPlayName?: () => void;
}

export function DinoHeader({ name, latin, onPlayName }: DinoHeaderProps) {
  return (
    <div className="text-center mb-2 px-4">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl font-black uppercase tracking-tight">{name}</h1>
        {onPlayName && (
          <button
            onClick={onPlayName}
            className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <Icon name="volume_up" size="xs" filled className="text-on-surface-variant" />
          </button>
        )}
      </div>
      <p className="text-xs font-semibold text-on-surface-variant italic">{latin}</p>
    </div>
  );
}
