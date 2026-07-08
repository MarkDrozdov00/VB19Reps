import http from "node:http";
import nodemailer from "nodemailer";

const PORT = Number.parseInt(process.env.BASE_REPS_MAILER_PORT || process.env.PORT || "3000", 10);
const INTERNAL_EMAIL = process.env.BASE_REPS_INTERNAL_EMAIL || "base19.reps@outlook.com";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function smtpSecure() {
  return String(process.env.BASE_REPS_SMTP_SECURE || "").toLowerCase() === "true";
}

function sender() {
  const email = requiredEnv("BASE_REPS_FROM_EMAIL");
  const name = process.env.BASE_REPS_FROM_NAME || "Base Reps";
  return `"${name.replaceAll('"', '\\"')}" <${email}>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function validateReservationEmailRequest(body) {
  const required = [
    "customerEmail",
    "customerName",
    "reservationDate",
    "reservationTime",
    "reservationName"
  ];

  const missing = required.filter((key) => typeof body[key] !== "string" || !body[key].trim());
  if (missing.length > 0) {
    return `Missing required field(s): ${missing.join(", ")}`;
  }

  if (!body.customerEmail.includes("@")) {
    return "Invalid customerEmail";
  }

  return null;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: requiredEnv("BASE_REPS_SMTP_HOST"),
    port: Number.parseInt(requiredEnv("BASE_REPS_SMTP_PORT"), 10),
    secure: smtpSecure(),
    auth: {
      user: requiredEnv("BASE_REPS_SMTP_USER"),
      pass: requiredEnv("BASE_REPS_SMTP_PASS")
    }
  });
}

async function sendReservationEmails(body) {
  const transporter = createTransporter();
  const from = sender();
  const customerName = escapeHtml(body.customerName);
  const reservationName = escapeHtml(body.reservationName);
  const reservationDate = escapeHtml(body.reservationDate);
  const reservationTime = escapeHtml(body.reservationTime);
  const customerEmail = body.customerEmail.trim();

  const customerHtml = `
    <p>Hi ${customerName},</p>
    <p>Your reservation for <b>${reservationName}</b> is confirmed.</p>
    <ul>
      <li>Date: <b>${reservationDate}</b></li>
      <li>Time: <b>${reservationTime}</b></li>
    </ul>
  `;

  const internalHtml = `
    <p>New reservation booked.</p>
    <ul>
      <li>Reservation: <b>${reservationName}</b></li>
      <li>Date: <b>${reservationDate}</b></li>
      <li>Time: <b>${reservationTime}</b></li>
      <li>Name: ${customerName}</li>
      <li>Email: ${escapeHtml(customerEmail)}</li>
    </ul>
  `;

  const results = await Promise.allSettled([
    transporter.sendMail({
      from,
      to: customerEmail,
      subject: "Reservation confirmed",
      html: customerHtml
    }),
    transporter.sendMail({
      from,
      to: INTERNAL_EMAIL,
      subject: "New reservation booked",
      html: internalHtml
    })
  ]);

  const failures = results
    .map((result, index) => ({ result, tag: index === 0 ? "customer" : "internal" }))
    .filter(({ result }) => result.status === "rejected");

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Base Reps ${failure.tag} email failed:`, failure.result.reason);
    }
    return { success: false, errors: failures.map((failure) => failure.tag) };
  }

  return { success: true };
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/api/send-reservation-emails") {
    json(res, 404, { success: false, error: "Not found" });
    return;
  }

  try {
    const body = await readJson(req);
    const validationError = validateReservationEmailRequest(body);
    if (validationError) {
      json(res, 400, { success: false, error: validationError });
      return;
    }

    const result = await sendReservationEmails(body);
    json(res, result.success ? 200 : 502, result);
  } catch (error) {
    console.error("Base Reps reservation email endpoint failed:", error);
    json(res, 500, { success: false, error: "Email sending failed" });
  }
});

server.listen(PORT, () => {
  console.log(`Base Reps mailer listening on port ${PORT}`);
});
