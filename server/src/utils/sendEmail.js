const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const CLIENT_URL = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/$/, "");

const NOVAVAULT_ICON_URL = `${CLIENT_URL}/novavault-icon.svg`;

function getNovaVaultHeader() {
  return `
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      "
    >
      <img
        src="${NOVAVAULT_ICON_URL}"
        width="32"
        height="32"
        alt="NovaVault"
        style="
          display: block;
          width: 32px;
          height: 32px;
          border: 0;
          outline: none;
          text-decoration: none;
        "
      />

      <div
        style="
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          line-height: 32px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #ffffff;
          white-space: nowrap;
        "
      >
        NOVA<span style="color: #8b5cf6;">VAULT</span>
      </div>
    </div>
  `;
}


async function sendVerificationEmail(name, email, otp) {
  const mailOptions = {
    from: `"NovaVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your NovaVault account",

    text: `Hello ${name},

Welcome to NovaVault.

Your email verification code is:

${otp}

This code will expire in 10 minutes.

If you did not create a NovaVault account, you can safely ignore this email.

— NovaVault Team`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>Verify your NovaVault account</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #080b15;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              width: 100%;
              padding: 40px 16px;
              box-sizing: border-box;
              background-color: #080b15;
            "
          >
            <div
              style="
                max-width: 560px;
                margin: 0 auto;
                background-color: #101522;
                border: 1px solid #252b3b;
                border-radius: 16px;
                overflow: hidden;
              "
            >

        
              <div
                style="
                  padding: 28px 32px;
                  border-bottom: 1px solid #252b3b;
                  text-align: center;
                "
              >
                ${getNovaVaultHeader()}

                <div
                  style="
                    margin-top: 8px;
                    color: #8b93a7;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  Your gaming marketplace
                </div>
              </div>

        
              <div style="padding: 32px;">

                <h1
                  style="
                    margin: 0 0 16px;
                    color: #ffffff;
                    font-size: 24px;
                    line-height: 1.3;
                    font-weight: 700;
                  "
                >
                  Verify your email
                </h1>

                <p
                  style="
                    margin: 0 0 12px;
                    color: #c4c9d6;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  Hello ${name},
                </p>

                <p
                  style="
                    margin: 0 0 24px;
                    color: #c4c9d6;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  Thanks for creating your NovaVault account.
                  Enter the verification code below to verify your
                  email address.
                </p>

        
                <div
                  style="
                    margin: 24px 0;
                    padding: 24px;
                    background-color: #080b15;
                    border: 1px solid #2d3548;
                    border-radius: 12px;
                    text-align: center;
                  "
                >
                  <div
                    style="
                      margin-bottom: 10px;
                      color: #8b93a7;
                      font-size: 12px;
                      text-transform: uppercase;
                      letter-spacing: 2px;
                    "
                  >
                    Verification Code
                  </div>

                  <div
                    style="
                      color: #a78bfa;
                      font-size: 36px;
                      font-weight: 700;
                      letter-spacing: 8px;
                    "
                  >
                    ${otp}
                  </div>
                </div>

                <p
                  style="
                    margin: 0 0 10px;
                    color: #c4c9d6;
                    font-size: 14px;
                    line-height: 1.6;
                  "
                >
                  This code will expire in
                  <strong style="color: #ffffff;">
                    10 minutes
                  </strong>.
                </p>

                <p
                  style="
                    margin: 0;
                    color: #747d91;
                    font-size: 13px;
                    line-height: 1.6;
                  "
                >
                  If you did not create a NovaVault account, you can
                  safely ignore this email.
                </p>

              </div>

          
              <div
                style="
                  padding: 20px 32px;
                  border-top: 1px solid #252b3b;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #60697c;
                    font-size: 12px;
                    line-height: 1.5;
                  "
                >
                  © ${new Date().getFullYear()}
                  NovaVault. All rights reserved.
                </p>
              </div>

            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}


async function sendPasswordResetEmail(name, email, resetUrl) {
  const mailOptions = {
    from: `"NovaVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your NovaVault password",

    text: `Hello ${name},

We received a request to reset your NovaVault password.

Use the following link to create a new password:

${resetUrl}

This password reset link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

— NovaVault Team`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>Reset your NovaVault password</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #080b15;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              width: 100%;
              padding: 40px 16px;
              box-sizing: border-box;
              background-color: #080b15;
            "
          >
            <div
              style="
                max-width: 560px;
                margin: 0 auto;
                background-color: #101522;
                border: 1px solid #252b3b;
                border-radius: 16px;
                overflow: hidden;
              "
            >

              <div
                style="
                  padding: 28px 32px;
                  border-bottom: 1px solid #252b3b;
                  text-align: center;
                "
              >
                ${getNovaVaultHeader()}

                <div
                  style="
                    margin-top: 8px;
                    color: #8b93a7;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  Your gaming marketplace
                </div>
              </div>


              <div style="padding: 32px;">

                <h1
                  style="
                    margin: 0 0 16px;
                    color: #ffffff;
                    font-size: 24px;
                    line-height: 1.3;
                    font-weight: 700;
                  "
                >
                  Reset your password
                </h1>

                <p
                  style="
                    margin: 0 0 12px;
                    color: #c4c9d6;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  Hello ${name},
                </p>

                <p
                  style="
                    margin: 0 0 24px;
                    color: #c4c9d6;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  We received a request to reset your
                  NovaVault password. Click the button below
                  to create a new password.
                </p>


                <div
                  style="
                    text-align: center;
                    margin: 28px 0;
                  "
                >
                  <a
                    href="${resetUrl}"
                    style="
                      display: inline-block;
                      padding: 13px 24px;
                      background-color: #7c3aed;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      font-size: 13px;
                      font-weight: 700;
                      line-height: 1.2;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p
                  style="
                    margin: 0 0 10px;
                    color: #c4c9d6;
                    font-size: 14px;
                    line-height: 1.6;
                  "
                >
                  This link will expire in
                  <strong style="color: #ffffff;">
                    15 minutes
                  </strong>.
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    color: #747d91;
                    font-size: 13px;
                    line-height: 1.6;
                  "
                >
                  If the button doesn't work, copy and paste
                  the following link into your browser:
                </p>

                <p
                  style="
                    margin: 10px 0 0;
                    word-break: break-all;
                    color: #8b5cf6;
                    font-size: 12px;
                    line-height: 1.6;
                  "
                >
                  ${resetUrl}
                </p>

                <p
                  style="
                    margin: 22px 0 0;
                    color: #747d91;
                    font-size: 13px;
                    line-height: 1.6;
                  "
                >
                  If you did not request a password reset,
                  you can safely ignore this email.
                </p>

              </div>

              <!-- ==================================================
                   FOOTER
              =================================================== -->

              <div
                style="
                  padding: 20px 32px;
                  border-top: 1px solid #252b3b;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #60697c;
                    font-size: 12px;
                    line-height: 1.5;
                  "
                >
                  © ${new Date().getFullYear()}
                  NovaVault. All rights reserved.
                </p>
              </div>

            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};