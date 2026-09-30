

type CardDashboardProps = {
    title: string;
    value: number | string;
    className?: string;
}

export function CardDashboard({ title, value, className }: CardDashboardProps) {
    return (
        <div className= {`rounded-2xl p-6 bg-white shadow-md border-l-4 ${className || ""}`}>
            <div className="mb-2 flex items-center">
                <h2 className="ml-2 text-2xl font-semibold text-gray-800">{title}</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    )
}