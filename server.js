const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


app.post("/contact", async (req, res) => {
    const { name, email, company, service, message } = req.body;
  
    try {
      // 管理者通知
      await resend.emails.send({
        from: "SIEG CREATE <contact@sieg-sports.com>",
        to: "yurie6312@gmail.com",
        subject: "お問い合わせが届きました",
        html: `
          <h2>お問い合わせが届きました</h2>
          <p><strong>お名前:</strong> ${name}</p>
          <p><strong>メール:</strong> ${email}</p>
          <p><strong>会社名・団体名:</strong> ${company || "未入力"}</p>
          <p><strong>ご相談内容:</strong> ${service}</p>
          <hr>
          <p>${message}</p>
        `
      });
  
      // 自動返信
      await resend.emails.send({
        from: "SIEG CREATE <contact@sieg-sports.com>",
        to: email,
        subject: "お問い合わせありがとうございます｜SIEG CREATE",
        html: `
          <p>${name} 様</p>
      
          <br>
      
          <p>
            この度はSIEG CREATEへお問い合わせいただき、
            誠にありがとうございます。
          </p>
      
          <p>
            内容を確認のうえ、
            ご返信いたします。
          </p>
      
          <br>
      
          <p>
            お問い合わせ内容
          </p>
      
          <div style="
            background:#f5f8f8;
            padding:20px;
            border-radius:10px;
            margin:15px 0;
          ">
            ${message}
          </div>
      
          <br>
      
      
          <br><br>
      
          <p>
            ━━━━━━━━━━━━━━━<br>
            SIEG CREATE<br>
            Web Design / System / Marketing<br>
            ━━━━━━━━━━━━━━━
          </p>
        `
      });
  
      res.redirect("/thanks.html");
  
    } catch (error) {
      console.error(error);
      res.status(500).send("送信失敗");
    }
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});