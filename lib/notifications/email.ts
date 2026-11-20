import "server-only";
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export async function sendClinicEmail(e: { ref: string; name: string; phone: string; category: string; date: string; time: string; patientType: string }) {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL_TO, from = process.env.NOTIFY_EMAIL_FROM;
  if (!key || !to || !from) return { sent: false, reason: "not_configured" as const };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `New appointment request ${e.ref}`,
        html: `<p><b>${esc(e.ref)}</b></p><p>${esc(e.name)} · ${esc(e.phone)}<br>${esc(e.category)} · ${esc(e.patientType)} patient<br>Preferred: ${esc(e.date)}, ${esc(e.time)}</p><p>Request only. Not confirmed until the clinic contacts the patient.</p>` }),
    });
    return { sent: res.ok, reason: res.ok ? undefined : ("provider_error" as const) };
  } catch { return { sent: false, reason: "network_error" as const }; }
}
