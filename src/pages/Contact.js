import React, { useState } from "react";
import { sendContact } from "../api/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    if (!form.email && !form.phone) {
      setStatus({ type: "error", msg: "Please provide email or phone." });
      setLoading(false);
      return;
    }
    if (!form.message.trim()) {
      setStatus({ type: "error", msg: "Message cannot be empty." });
      setLoading(false);
      return;
    }

    try {
      await sendContact(form);
      setStatus({ type: "success", msg: "Message sent — I will get back to you soon!" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("contact submit error", err);
      setStatus({ type: "error", msg: "Failed to send message." });
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ maxWidth: 600, margin: "auto" }}>
        <h1>Get in touch</h1>

      <p style={{color:'var(--muted)', marginBottom:20}}>
        Feel free to contact me using the details below or send me a direct message.
      </p>

      <div className="card" style={{marginBottom:32}}>
        <h3>My Contact Details</h3>
        <p><strong>Email:</strong> <a href="https://mail.google.com/mail/?view=cm&fs=1&to=tvenkatesh457146@gmail.com" target="_blank" rel="noreferrer">tvenkatesh457146@gmail.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:8309108618">8309108618</a></p>
      </div>

        <form onSubmit={submitContact} className="contact-form" style={{ marginTop: 20 }}>
          <label>Your Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label>Phone *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />

          <label>Message *</label>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message"
          />

          <button className="btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <p
              style={{
                marginTop: 10,
                color: status.type === "error" ? "salmon" : "lightgreen",
              }}
            >
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}