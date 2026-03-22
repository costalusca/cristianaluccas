import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, Gift, Download, Check, X, Settings, Plus, Trash2, Upload, Save } from "lucide-react";
import { toast } from "sonner";
import type { TimelineEvent } from "@/hooks/use-site-settings";

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
  payment_url: string | null;
}

interface SiteSettingsData {
  id: string;
  groom_name: string;
  bride_name: string;
  couple_initials: string;
  wedding_date: string;
  story_quote: string;
  story_text: string;
  timeline_events: TimelineEvent[];
  venue_name: string;
  venue_address: string;
  ceremony_time: string;
  party_time: string;
  venue_map_url: string;
  venue_map_embed: string;
  hero_photo_url: string | null;
  couple_photo_url: string | null;
  gallery_photo_urls: string[];
  welcome_text: string;
  footer_text: string;
}

const inputClass =
  "w-full bg-transparent border border-border rounded px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors";

const labelClass = "font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block";

const Admin = () => {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [tab, setTab] = useState<"rsvp" | "gifts" | "content">("rsvp");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // New gift form
  const [newGift, setNewGift] = useState({ name: "", description: "", value: "", icon: "🎁", payment_url: "" });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      fetchData();
    };
    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    const [rsvpRes, giftsRes, settingsRes] = await Promise.all([
      supabase.from("rsvp_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("gifts").select("*").order("created_at"),
      supabase.from("site_settings").select("*").limit(1).single(),
    ]);
    if (rsvpRes.data) setRsvps(rsvpRes.data);
    if (giftsRes.data) setGifts(giftsRes.data);
    if (settingsRes.data) {
      setSettings({
        ...settingsRes.data,
        timeline_events: (settingsRes.data.timeline_events as unknown as TimelineEvent[]) || [],
        gallery_photo_urls: (settingsRes.data.gallery_photo_urls as unknown as string[]) || [],
      });
    }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/login"); };

  const exportCSV = () => {
    const headers = ["Nome", "Telefone", "Email", "Endereço", "Confirmou", "Mensagem", "Data"];
    const rows = rsvps.map((r) => [
      r.name, r.phone, r.email, r.address || "",
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

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, ...rest } = settings;
    const { error } = await supabase.from("site_settings").update({
      ...rest,
      timeline_events: rest.timeline_events as unknown as any,
      gallery_photo_urls: rest.gallery_photo_urls as unknown as any,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) toast.error("Erro ao salvar.");
    else toast.success("Conteúdo salvo com sucesso!");
    setSaving(false);
  };

  const uploadPhoto = async (file: File, field: "hero_photo_url" | "couple_photo_url") => {
    if (!settings) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${field}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) { toast.error("Erro no upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
    setSettings({ ...settings, [field]: urlData.publicUrl });
    setUploading(false);
    toast.success("Foto enviada!");
  };

  const uploadGalleryPhoto = async (file: File) => {
    if (!settings) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) { toast.error("Erro no upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
    setSettings({ ...settings, gallery_photo_urls: [...settings.gallery_photo_urls, urlData.publicUrl] });
    setUploading(false);
    toast.success("Foto adicionada à galeria!");
  };

  const removeGalleryPhoto = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      gallery_photo_urls: settings.gallery_photo_urls.filter((_, i) => i !== index),
    });
  };

  const addTimelineEvent = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      timeline_events: [...settings.timeline_events, { year: "", title: "", desc: "" }],
    });
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    if (!settings) return;
    const events = [...settings.timeline_events];
    events[index] = { ...events[index], [field]: value };
    setSettings({ ...settings, timeline_events: events });
  };

  const removeTimelineEvent = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      timeline_events: settings.timeline_events.filter((_, i) => i !== index),
    });
  };

  const addGift = async () => {
    if (!newGift.name || !newGift.value) { toast.error("Preencha nome e valor."); return; }
    const { error } = await supabase.from("gifts").insert({
      name: newGift.name,
      description: newGift.description || null,
      value: parseFloat(newGift.value),
      icon: newGift.icon || "🎁",
      payment_url: newGift.payment_url || null,
    });
    if (error) toast.error("Erro ao adicionar.");
    else {
      toast.success("Presente adicionado!");
      setNewGift({ name: "", description: "", value: "", icon: "🎁", payment_url: "" });
      fetchData();
    }
  };

  const deleteGift = async (id: string) => {
    const { error } = await supabase.from("gifts").delete().eq("id", id);
    if (error) toast.error("Erro ao remover.");
    else { toast.success("Presente removido."); setGifts(gifts.filter((g) => g.id !== id)); }
  };

  const confirmed = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = confirmed.length;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-muted-foreground">Carregando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl text-foreground">Painel dos Noivos</h1>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="font-body text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
              Ver site
            </a>
            <button onClick={handleLogout}
              className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={16} /> Sair
            </button>
          </div>
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
        <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto">
          {[
            { id: "rsvp" as const, label: "Convidados", icon: Users },
            { id: "gifts" as const, label: "Presentes", icon: Gift },
            { id: "content" as const, label: "Conteúdo do Site", icon: Settings },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`font-body text-sm uppercase tracking-widest pb-3 border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              }`}>
              <t.icon size={14} className="inline mr-2" /> {t.label}
            </button>
          ))}
        </div>

        {/* RSVP Tab */}
        {tab === "rsvp" && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={exportCSV}
                className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                <Download size={14} /> Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {["Nome", "Telefone", "Email", "Status", "Mensagem", "Data"].map((h) => (
                      <th key={h} className="font-body text-xs uppercase tracking-widest text-muted-foreground py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-body text-sm text-foreground">{r.name}</td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground">{r.phone}</td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground">{r.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-body text-xs uppercase tracking-widest ${
                          r.attending ? "text-green-600" : "text-destructive"}`}>
                          {r.attending ? <><Check size={12} /> Confirmado</> : <><X size={12} /> Recusou</>}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-body text-sm text-muted-foreground max-w-[200px] truncate">{r.message || "—"}</td>
                      <td className="py-3 px-4 font-body text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center font-body text-sm text-muted-foreground">Nenhuma confirmação ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Gifts Tab */}
        {tab === "gifts" && (
          <>
            {/* Add gift form */}
            <div className="border border-border p-6 mb-6">
              <h3 className="font-display text-lg text-foreground mb-4">Adicionar Presente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Emoji</label>
                  <input value={newGift.icon} onChange={(e) => setNewGift({ ...newGift, icon: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Nome</label>
                  <input value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} className={inputClass} placeholder="Ex: Lua de Mel" />
                </div>
                <div>
                  <label className={labelClass}>Descrição</label>
                  <input value={newGift.description} onChange={(e) => setNewGift({ ...newGift, description: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Valor (R$)</label>
                  <input type="number" value={newGift.value} onChange={(e) => setNewGift({ ...newGift, value: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClass}>Link de Pagamento (Pix / URL externa)</label>
                  <input value={newGift.payment_url} onChange={(e) => setNewGift({ ...newGift, payment_url: e.target.value })} className={inputClass} placeholder="https://... ou chave Pix" />
                </div>
                <div className="flex items-end">
                  <button onClick={addGift}
                    className="bg-foreground text-background px-6 py-2 font-body text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                    <Plus size={14} className="inline mr-2" /> Adicionar
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((g) => (
                <div key={g.id} className={`border border-border p-6 ${g.purchased ? "bg-muted/20" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-2xl mr-2">{g.icon}</span>
                      <span className="font-display text-lg text-foreground">{g.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-display text-lg text-gold">R$ {Number(g.value).toLocaleString("pt-BR")}</span>
                      <button onClick={() => deleteGift(g.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {g.description && <p className="font-body text-xs text-muted-foreground mb-2">{g.description}</p>}
                  {g.purchased ? (
                    <div className="font-body text-xs text-muted-foreground">
                      <p>✅ Presenteado{g.purchased_by ? ` por: ${g.purchased_by}` : ""}</p>
                      {g.purchased_at && <p>Em: {new Date(g.purchased_at).toLocaleDateString("pt-BR")}</p>}
                    </div>
                  ) : (
                    <div className="font-body text-xs text-muted-foreground">
                      <p>Disponível</p>
                      {g.payment_url && <p className="truncate mt-1">🔗 {g.payment_url}</p>}
                    </div>
                  )}
                  {/* Inline edit */}
                  <details className="mt-3">
                    <summary className="font-body text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">✏️ Editar</summary>
                    <div className="mt-2 space-y-2">
                      <input value={g.name} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, name: e.target.value } : gi))} className={inputClass} placeholder="Nome" />
                      <input value={g.description || ""} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, description: e.target.value } : gi))} className={inputClass} placeholder="Descrição" />
                      <input type="number" value={g.value} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, value: Number(e.target.value) } : gi))} className={inputClass} placeholder="Valor" />
                      <input value={g.icon || "🎁"} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, icon: e.target.value } : gi))} className={inputClass} placeholder="Emoji" />
                      <input value={g.payment_url || ""} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, payment_url: e.target.value } : gi))} className={inputClass} placeholder="Link de pagamento" />
                      <div className="flex gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={g.purchased} onChange={(e) => setGifts(gifts.map(gi => gi.id === g.id ? { ...gi, purchased: e.target.checked } : gi))} />
                          <span className="font-body text-xs">Presenteado</span>
                        </label>
                      </div>
                      <button onClick={async () => {
                        const { error } = await supabase.from("gifts").update({
                          name: g.name, description: g.description, value: g.value,
                          icon: g.icon, payment_url: g.payment_url, purchased: g.purchased,
                        }).eq("id", g.id);
                        if (error) toast.error("Erro ao salvar.");
                        else toast.success("Presente atualizado!");
                      }} className="bg-foreground text-background px-4 py-1.5 font-body text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                        Salvar
                      </button>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Content Tab */}
        {tab === "content" && settings && (
          <div className="space-y-10 max-w-3xl">
            {/* Save button - sticky */}
            <div className="sticky top-[65px] z-10 bg-background py-3 border-b border-border flex justify-end">
              <button onClick={saveSettings} disabled={saving}
                className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/90 transition-colors disabled:opacity-50">
                <Save size={14} /> {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>

            {/* Couple Info */}
            <section>
              <h3 className="font-display text-xl text-foreground mb-4">👫 Informações do Casal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Nome do Noivo</label>
                  <input value={settings.groom_name} onChange={(e) => setSettings({ ...settings, groom_name: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Nome da Noiva</label>
                  <input value={settings.bride_name} onChange={(e) => setSettings({ ...settings, bride_name: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Iniciais (menu)</label>
                  <input value={settings.couple_initials} onChange={(e) => setSettings({ ...settings, couple_initials: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><label className={labelClass}>Data do Casamento</label>
                  <input type="datetime-local" value={settings.wedding_date.slice(0, 16)} onChange={(e) => setSettings({ ...settings, wedding_date: new Date(e.target.value).toISOString() })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Texto de Boas-vindas</label>
                  <input value={settings.welcome_text} onChange={(e) => setSettings({ ...settings, welcome_text: e.target.value })} className={inputClass} />
                </div>
              </div>
            </section>

            {/* Photos */}
            <section>
              <h3 className="font-display text-xl text-foreground mb-4">📸 Fotos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Foto Principal (Hero)</label>
                  {settings.hero_photo_url && <img src={settings.hero_photo_url} alt="Hero" className="w-full h-32 object-cover mb-2 border border-border" />}
                  <label className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-sm cursor-pointer hover:border-foreground transition-colors">
                    <Upload size={14} /> {uploading ? "Enviando..." : "Enviar foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "hero_photo_url")} />
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Foto do Casal (História)</label>
                  {settings.couple_photo_url && <img src={settings.couple_photo_url} alt="Casal" className="w-full h-32 object-cover mb-2 border border-border" />}
                  <label className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-sm cursor-pointer hover:border-foreground transition-colors">
                    <Upload size={14} /> {uploading ? "Enviando..." : "Enviar foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], "couple_photo_url")} />
                  </label>
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-6">
                <label className={labelClass}>Fotos da Galeria</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  {settings.gallery_photo_urls.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Galeria ${i + 1}`} className="w-full h-20 object-cover border border-border" />
                      <button onClick={() => removeGalleryPhoto(i)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-sm cursor-pointer hover:border-foreground transition-colors">
                  <Plus size={14} /> Adicionar foto
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadGalleryPhoto(e.target.files[0])} />
                </label>
              </div>
            </section>

            {/* Story */}
            <section>
              <h3 className="font-display text-xl text-foreground mb-4">💕 Nossa História</h3>
              <div className="space-y-4">
                <div><label className={labelClass}>Citação</label>
                  <input value={settings.story_quote} onChange={(e) => setSettings({ ...settings, story_quote: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Texto da História</label>
                  <textarea value={settings.story_text} onChange={(e) => setSettings({ ...settings, story_text: e.target.value })}
                    rows={6} className={`${inputClass} resize-none`} />
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Linha do Tempo</label>
                  <button onClick={addTimelineEvent}
                    className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={12} /> Adicionar evento
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.timeline_events.map((event, i) => (
                    <div key={i} className="grid grid-cols-[80px_1fr_1fr_32px] gap-2 items-start">
                      <input value={event.year} onChange={(e) => updateTimelineEvent(i, "year", e.target.value)}
                        className={inputClass} placeholder="Ano" />
                      <input value={event.title} onChange={(e) => updateTimelineEvent(i, "title", e.target.value)}
                        className={inputClass} placeholder="Título" />
                      <input value={event.desc} onChange={(e) => updateTimelineEvent(i, "desc", e.target.value)}
                        className={inputClass} placeholder="Descrição" />
                      <button onClick={() => removeTimelineEvent(i)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Venue */}
            <section>
              <h3 className="font-display text-xl text-foreground mb-4">📍 Local do Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Nome do Local</label>
                  <input value={settings.venue_name} onChange={(e) => setSettings({ ...settings, venue_name: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Endereço</label>
                  <input value={settings.venue_address} onChange={(e) => {
                    const addr = e.target.value;
                    const encoded = encodeURIComponent(addr);
                    setSettings({
                      ...settings,
                      venue_address: addr,
                      venue_map_url: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
                      venue_map_embed: `https://www.google.com/maps?q=${encoded}&output=embed`,
                    });
                  }} className={inputClass} />
                </div>
                <div><label className={labelClass}>Horário da Cerimônia</label>
                  <input value={settings.ceremony_time} onChange={(e) => setSettings({ ...settings, ceremony_time: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Horário da Festa</label>
                  <input value={settings.party_time} onChange={(e) => setSettings({ ...settings, party_time: e.target.value })} className={inputClass} />
                </div>
                <div><label className={labelClass}>Link do Google Maps (auto-gerado)</label>
                  <input value={settings.venue_map_url} onChange={(e) => setSettings({ ...settings, venue_map_url: e.target.value })} className={inputClass} placeholder="Gerado automaticamente ao alterar endereço" />
                </div>
                <div><label className={labelClass}>Embed do Google Maps (auto-gerado)</label>
                  <input value={settings.venue_map_embed} onChange={(e) => setSettings({ ...settings, venue_map_embed: e.target.value })} className={inputClass} placeholder="Gerado automaticamente ao alterar endereço" />
                </div>
              </div>
              {settings.venue_map_embed && (
                <div className="mt-4 h-[200px] border border-border overflow-hidden">
                  <iframe src={settings.venue_map_embed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Preview do mapa" />
                </div>
              )}
            </section>

            {/* Footer */}
            <section>
              <h3 className="font-display text-xl text-foreground mb-4">✨ Rodapé</h3>
              <div><label className={labelClass}>Texto do Rodapé</label>
                <input value={settings.footer_text} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} className={inputClass} />
              </div>
            </section>

            {/* Bottom save */}
            <div className="pt-6">
              <button onClick={saveSettings} disabled={saving}
                className="w-full bg-foreground text-background font-body text-sm uppercase tracking-widest py-4 hover:bg-foreground/90 transition-colors disabled:opacity-50">
                <Save size={14} className="inline mr-2" /> {saving ? "Salvando..." : "Salvar Todas as Alterações"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
