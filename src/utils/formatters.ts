


export function formatDate(value: string | null | undefined): string {
    if (!value) return "-";
    const [year, month, day] = value.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}

export function formatarCPF(valor: string){
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

export function formatarTelefone(valor: string) {
    const digitos = valor.replace(/\D/g, "").substring(0, 11);
    if (digitos.length <= 10) {
      return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };
