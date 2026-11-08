"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessage, type ContactState, type Field } from "@/app/contact/actions";

const initial: ContactState = { status: "idle" };

const labelCls = "mb-2 block pl-1 text-[clamp(0.85rem,1.2vw,1.125rem)] font-bold uppercase tracking-[0.01em] text-navy";
const boxCls = "rounded-md bg-white shadow-[0_1px_3px_rgb(23_53_93/0.12)] transition-[box-shadow] duration-300";
const focusCls = "focus-within:ring-2 focus-within:ring-blue";
const invalidCls = "ring-2 ring-[#b42318]";
const sendCls = "inline-flex items-center px-5 py-3 text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.14em] text-white";

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-1.5 pl-1 text-[0.875rem] font-semibold text-[#b42318]">
      {text}
    </p>
  ) : null;
}

/** "Send us a message": fields sit straight on the photo; the message box holds the Send button. */
export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const err = state.errors ?? {};
  const val = state.values ?? {};

  // After a failed submit, take the keyboard to the first field that needs fixing; after a send, to the confirmation.
  useEffect(() => {
    if (state.status === "invalid") {
      const first = (["name", "email", "phone", "subject", "message"] as Field[]).find((k) => err[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else if (state.status === "sent" || state.status === "error") {
      statusRef.current?.focus();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const input = (name: Exclude<Field, "message">, label: string, type = "text", autoComplete?: string, optional = false) => (
    <div>
      <label htmlFor={`contact-${name}`} className={labelCls}>
        {label}
        {optional && <span className="ml-1.5 font-medium normal-case text-navy">(optional)</span>}
      </label>
      <div className={`${boxCls} ${err[name] ? invalidCls : focusCls}`}>
        <input
          id={`contact-${name}`}
          data-no-ring
          name={name}
          type={type}
          autoComplete={autoComplete}
          defaultValue={val[name]}
          aria-invalid={err[name] ? true : undefined}
          aria-describedby={err[name] ? `contact-${name}-error` : undefined}
          className="block h-[clamp(44px,3.33vw,50px)] w-full rounded-md bg-transparent px-4 text-[1.0625rem] text-ink outline-none"
        />
      </div>
      <FieldError id={`contact-${name}-error`} text={err[name]} />
    </div>
  );

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-[clamp(14px,1.6vw,24px)]">
      {input("name", "Name", "text", "name")}
      {/* Email and phone side by side from md; stacked on phones. */}
      <div className="grid gap-[clamp(14px,1.6vw,24px)] md:grid-cols-2">
        {input("email", "Email address", "email", "email")}
        {input("phone", "Phone", "tel", "tel", true)}
      </div>
      {input("subject", "Subject")}

      <div>
        <label htmlFor="contact-message" className={labelCls}>
          Message
        </label>
        <div className={`${boxCls} rounded-lg px-[clamp(16px,2.9vw,44px)] pb-[clamp(16px,1.9vw,28px)] pt-[clamp(14px,1.6vw,24px)] ${err.message ? invalidCls : focusCls}`}>
          <textarea
            id="contact-message"
            data-no-ring
            name="message"
            rows={7}
            defaultValue={val.message}
            placeholder="We will get back to you as soon as possible."
            aria-invalid={err.message ? true : undefined}
            aria-describedby={err.message ? "contact-message-error" : undefined}
            className="block min-h-[clamp(150px,13vw,200px)] w-full resize-y bg-transparent text-[clamp(1rem,1.4vw,1.3125rem)] leading-[1.45] tracking-[0.04em] text-ink outline-none placeholder:font-light placeholder:italic placeholder:text-ink/90"
          />
          <div className="mt-[clamp(12px,1.4vw,20px)] border-t border-ink/45 pt-[clamp(14px,2vw,30px)]">
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
              <p
                ref={statusRef}
                data-no-ring
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className={`mr-auto text-[0.9375rem] outline-none ${state.status === "error" ? "font-semibold text-[#b42318]" : "text-navy"}`}
              >
                {state.status === "sent" && "Thanks, your message is on its way. We'll be in touch soon."}
                {state.status === "error" && state.message}
              </p>
              <button
                type="submit"
                disabled={pending}
                // The site's block button (Button.tsx): a navy copy wipes across on hover or focus.
                className={`wipe relative ${sendCls} cursor-pointer bg-blue disabled:cursor-wait disabled:opacity-60`}
              >
                {pending ? "Sending" : "Send"}
                <span aria-hidden className={`wipe-fill absolute inset-0 ${sendCls} bg-navy`}>
                  {pending ? "Sending" : "Send"}
                </span>
              </button>
            </div>
          </div>
        </div>
        <FieldError id="contact-message-error" text={err.message} />
      </div>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </form>
  );
}
