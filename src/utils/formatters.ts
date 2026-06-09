

export function formatDate(value: string | null | undefined): string {
    if (!value) return "-";
    const [year, month, day] = value.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}
