"use server";

import { company } from "@/content/home";

export type Field = "name" | "email" | "phone" | "subject" | "message";

export type ContactState = {
  status: "idle" | "sent" | "invalid" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  /** What was typed, so a failed send doesn't wipe the form. */
  values?: Partial<Record<Field, string>>;
};

const limits: Record<Field, number> = { name: 120, email: 200, phone: 40, subject: 200, message: 5000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where messages go. Not chosen yet (email service or Payload, see PAGES.md). In development a message
 * is logged and the form reports success; in production the send fails loudly with the office's
 * email address instead of dropping it silently.
 */
async function deliver(msg: Record<Field, string>): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] message received (no delivery configured):", { ...msg, message: `${msg.message.length} chars` });
    return true;
  }
  return false;
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    (Object.keys(limits) as Field[]).map((k) => [k, String(formData.get(k) ?? "").trim()]),
  ) as Record<Field, string>;

  // Honeypot: people never see this field, so anything in it is a bot. Pretend it worked.
  if (String(formData.get("company") ?? "") !== "") return { status: "sent" };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Please enter your name.";
  if (!values.email) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(values.email)) errors.email = "That email address doesn't look right.";
  // Phone is optional; if given, it needs enough digits to call back (7 local, up to 15 international).
  const digits = values.phone.replace(/\D/g, "").length;
  if (values.phone && (digits < 7 || digits > 15 || /[^\d\s()+.\-x]/i.test(values.phone))) errors.phone = "That phone number doesn't look right.";
  if (!values.message) errors.message = "Please write a message.";
  for (const k of Object.keys(limits) as Field[]) {
    if (values[k].length > limits[k]) errors[k] = `Please keep this under ${limits[k]} characters.`;
  }
  if (Object.keys(errors).length) return { status: "invalid", errors, values };

  const ok = await deliver(values);
  if (!ok) {
    return {
      status: "error",
      message: `Your message couldn't be sent. Please email us at ${company.email} or call ${company.phone}.`,
      values,
    };
  }
  return { status: "sent" };
}
