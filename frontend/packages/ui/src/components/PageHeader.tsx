interface PageHeaderProps {
  logoSrc?: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ logoSrc, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6 text-center">
      {logoSrc && (
        <img src={logoSrc} alt="" className="w-14 h-14 object-contain mx-auto mb-2" />
      )}
      <h2 className="text-xl font-black uppercase tracking-tight text-on-surface mb-0.5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-on-surface-variant font-medium">{subtitle}</p>
      )}
    </div>
  );
}
