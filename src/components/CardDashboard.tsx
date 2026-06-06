

type CardDashboardProps = {
    title: string;
    value: number | string;
}

export function CardDashboard({ title, value }: CardDashboardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-md border-l-4 border-blue-600">
            <div className="mb-2 flex items-center">
                <h2 className="ml-2 text-2xl font-semibold text-gray-800">{title}</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    )
}