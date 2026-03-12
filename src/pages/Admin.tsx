import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, Gift, Download, Check, X } from "lucide-react";
import { toast } from "sonner";

interface RSVPResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string | null;
  guests: number;
  attending: boolean;
  message: string | null;
  created_at: string;
}

interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  value: number;
  icon: string | null;
  purchased: boolean;
  purchased_by: string | null;
  purchased_at: string | null;
}

const Admin = () => {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [tab, setTab] = useState<"rsvp" | "gifts">("rsvp");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchData();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    const [rsvpRes, giftsRes] = await Promise.all([
      supabase.from("rsvp_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("gifts").select("*").order("created_at"),
    ]);
    if (rsvpRes.data) setRsvps(rsvpRes.data);
    if (giftsRes.data) setGifts(giftsRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const exportCSV = () => {
    const headers = ["Nome", "Telefone", "Email", "Endereço", "Convidados", "Confirmou", "Mensagem", "Data"];
    const rows = rsvps.map((r) => [
      r.name, r.phone, r.email, r.address || "", r.guests,
      r.attending ? "Sim" : "Não", r.message || "",
      new Date(r.created_at).toLocaleDateString("pt-BR"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "convidados.csv";
    link.click();
    toast.success("Lista exportada!");
  };

  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = confirmed.reduce((sum, r) => sum + r.guests, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl text-foreground">Painel dos Noivos</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Respostas", value: rsvps.length, icon: Users },
            { label: "Confirmados", value: confirmed.length, icon: Check },
            { label: "Total de Convidados", value: totalGuests, icon: Users },
            { label: "Recusaram", value: declined.length, icon: X },
          ].map((stat) => (
            <div key={stat.label} className="border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <stat.icon size={16} />
                <span className="font-body text-xs uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="font-display text-3xl text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setTab("rsvp")}
            className={`font-body text-sm uppercase tracking-widest pb-3 border-b-2 transition-colors ${
              tab === "rsvp" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            <Users size={14} className="inline mr-2" /> Convidados
          </button>
          <button
            onClick={() => setTab("gifts")}
            className={`font-body text-sm uppercase tracking-widest pb-3 border-b-2 transition-colors ${
              tab === "gifts" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            <Gift size={14} className="inline mr-2" /> Presentes
          </button>
        </div>

        {tab === "rsvp" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Download size={14} /> Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {["Nome", "Telefone", "Email", "Convidados", "Status", "Mensagem", "Data"].map((h) => (
                      <th key={h} className="font-body text-xs uppercase tracking-widest text-muted-foreground py-3 px-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-body text-sm text-foreground">{r.name}</td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground">{r.phone}</td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground">{r.email}</td>
                      <td className="py-3 px-4 font-body text-sm text-foreground">{r.guests}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-body text-xs uppercase tracking-widest ${
                          r.attending ? "text-green-600" : "text-destructive"
                        }`}>
                          {r.attending ? <><Check size={12} /> Confirmado</> : <><X size={12} /> Recusou</>}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground max-w-[200px] truncate">
                        {r.message || "—"}
                      </td>
                      <td className="py-3 px-4 font-body text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center font-body text-sm text-muted-foreground">
                        Nenhuma confirmação ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "gifts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifts.map((g) => (
              <div key={g.id} className={`border border-border p-6 ${g.purchased ? "bg-muted/20" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl mr-2">{g.icon}</span>
                    <span className="font-display text-lg text-foreground">{g.name}</span>
                  </div>
                  <span className="font-display text-lg text-gold">
                    R$ {Number(g.value).toLocaleString("pt-BR")}
                  </span>
                </div>
                {g.purchased ? (
                  <div className="font-body text-xs text-muted-foreground">
                    <p>✅ Presenteado por: {g.purchased_by}</p>
                    {g.purchased_at && (
                      <p>Em: {new Date(g.purchased_at).toLocaleDateString("pt-BR")}</p>
                    )}
                  </div>
                ) : (
                  <p className="font-body text-xs text-muted-foreground">Disponível</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
