interface ModalLGPDProps {
    onFechar: () => void
}

export function ModalLGPD({onFechar}: ModalLGPDProps) {

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 sm:p-8 shadow-2xl">
              <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">
                Termos de Privacidade e Proteção de Dados (LGPD)
              </h2>

              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Para fins de transparência e em cumprimento à Lei Geral de
                  Proteção de Dados (Lei nº 13.709/2018), informamos
                  detalhadamente quais dados são coletados e qual a sua
                  finalidade:
                </p>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    1. Dados Pessoais Identificáveis:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Nome completo:</strong> Para identificação do
                      usuário na plataforma.
                    </li>
                    <li>
                      <strong>CPF:</strong> Para validação única e autenticidade
                      da conta.
                    </li>
                    <li>
                      <strong>Data de Nascimento:</strong> Para validação de
                      faixa etária.
                    </li>
                    <li>
                      <strong>E-mail:</strong> Para login, comunicações e
                      recuperação de senha.
                    </li>
                    <li>
                      <strong>Telefones (Principal e Secundário):</strong> Para
                      contato e avisos organizacionais.
                    </li>
                    <li>
                      <strong>Estado Civil e Profissão:</strong> Para mapeamento
                      de perfil dos integrantes.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    2. Dados Sensíveis (Saúde):
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Problemas de Saúde e Condições Médicas:</strong>{" "}
                      Utilizados exclusivamente para segurança do participante
                      em atividades presenciais ou eventos da instituição.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    3. Finalidade e Armazenamento:
                  </h3>
                  <p>
                    Os dados são armazenados em ambiente seguro com controle de
                    acesso estrito e não são compartilhados com terceiros para
                    fins comerciais.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onFechar}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Entendi e Fechar
                </button>
              </div>
            </div>
          </div>
    )
}