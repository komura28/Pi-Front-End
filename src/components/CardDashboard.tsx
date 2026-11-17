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
            className={`rounded-xl border border-l-4 border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md ${className}`}
        >
            <p className="text-sm font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-3 text-3xl font-bold text-slate-800">
                {value}
            </h3>
        </article>
    );
}