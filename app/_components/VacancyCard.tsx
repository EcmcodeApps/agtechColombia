import Image from "next/image";

export interface VacancyCardProps {
  company: string;
  companyLogo: string;
  title: string;
  matchScore: number; // 0-100
  location: string;
  salary: string;
  type: string;
  typeIcon: string;
  /** Aplica opacidad reducida a la tarjeta (menor relevancia) */
  dimmed?: boolean;
}

export default function VacancyCard({
  company,
  companyLogo,
  title,
  matchScore,
  location,
  salary,
  type,
  typeIcon,
  dimmed = false,
}: VacancyCardProps) {
  return (
    <div
      className={`bg-surface rounded-xl p-md shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 flex flex-col gap-sm transition-all duration-200 ${
        dimmed ? "opacity-80" : "hover:shadow-[0px_8px_30px_rgba(15,76,129,0.10)] active:scale-[0.98]"
      }`}
    >
      {/* Encabezado: logo + cargo + match */}
      <div className="flex justify-between items-start gap-sm">
        <div className="flex gap-sm min-w-0">
          {/* Logo empresa */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={companyLogo}
              alt={`Logo ${company}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nombre cargo + empresa */}
          <div className="min-w-0">
            <h3 className="text-body-md font-bold text-primary leading-snug truncate">
              {title}
            </h3>
            <p className="text-on-surface-variant text-body-sm truncate">{company}</p>
          </div>
        </div>

        {/* Badge de match */}
        <div className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-lg flex flex-col items-center flex-shrink-0 min-w-[48px]">
          <span className="font-bold text-label-md leading-tight">{matchScore}%</span>
          <span className="text-[10px] uppercase tracking-wider font-bold leading-none">Match</span>
        </div>
      </div>

      {/* Etiquetas de detalle */}
      <div className="flex flex-wrap gap-xs">
        <div className="flex items-center gap-xs text-on-surface-variant text-body-sm bg-surface-container-low px-sm py-1 rounded-full">
          <span className="material-symbols-outlined text-[15px]">location_on</span>
          {location}
        </div>
        <div className="flex items-center gap-xs text-on-surface-variant text-body-sm bg-surface-container-low px-sm py-1 rounded-full">
          <span className="material-symbols-outlined text-[15px]">payments</span>
          {salary}
        </div>
        <div className="flex items-center gap-xs text-on-surface-variant text-body-sm bg-surface-container-low px-sm py-1 rounded-full">
          <span className="material-symbols-outlined text-[15px]">{typeIcon}</span>
          {type}
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-energy-orange text-white py-2.5 rounded-xl text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all">
        Postularme Ahora
      </button>
    </div>
  );
}
