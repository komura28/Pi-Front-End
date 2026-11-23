type CardDashboardProps = {
    title: string;
    value: number | string;
    className?: string;
};

export function CardDashboard({
    title,
    value,
    className = ""
}: CardDashboardProps) {
    return (
        <article
            className={`min-w-0 rounded-xl border border-l-4 border-slate-200 bg-slate-50 p-4 sm:p-5 transition-shadow hover:shadow-md ${className}`}
        >
            <p className="break-words text-sm font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-2 break-words text-2xl font-bold text-slate-800 sm:mt-3 sm:text-3xl">
                {value}
            </h3>
        </article>
    );
}