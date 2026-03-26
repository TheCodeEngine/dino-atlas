interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  if (!text) {
    return <div className="border-t-2 border-outline-variant" />;
  }
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-grow border-t-2 border-outline-variant" />
      <span className="text-[10px] font-black uppercase tracking-wider text-outline">{text}</span>
      <div className="flex-grow border-t-2 border-outline-variant" />
    </div>
  );
}
