const axios = require("axios");
const { cmd } = require("../command");

// 🔑 Heroku API Key (yahan apni wali daal dena)
const HEROKU_API_KEY = "HRKU-AAdxmiFoMKv9sJZ_voPtOZhgrBmfpzTB6pHH2uFCubPw_____wyhq0DIRRwY";

// Sirf developer number ko access dena
const DEVELOPER_NUMBER = "923237045919"; 

cmd({
    pattern: "delherokuall",
    desc: "⚠️ Delete all Heroku deployments (Developer Only).",
    category: "developer",
    react: "⚡",
    filename: __filename
}, 
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Check developer
        if (!sender.includes(DEVELOPER_NUMBER)) {
            return reply("❌ Yeh command sirf Developer ke liye hai!");
        }

        reply("⏳ Sari Heroku apps delete ki ja rahi hain...");

        // 1. Get all apps
        const apps = await axios.get("https://api.heroku.com/apps", {
            headers: {
                "Accept": "application/vnd.heroku+json; version=3",
                "Authorization": `Bearer ${HEROKU_API_KEY}`
            }
        });

        if (!apps.data || apps.data.length === 0) {
            return reply("⚠️ Koi bhi app nahi mili jo delete ki ja sake!");
        }

        // 2. Delete each app
        for (let app of apps.data) {
            await axios.delete(`https://api.heroku.com/apps/${app.id}`, {
                headers: {
                    "Accept": "application/vnd.heroku+json; version=3",
                    "Authorization": `Bearer ${HEROKU_API_KEY}`
                }
            });
        }

        await conn.sendMessage(from, {
            text: `✅ *Saari Heroku Deployments Delete Ho Gayi!* 🚀\n\nTotal Deleted: ${apps.data.length}`
        }, { quoted: mek });

    } catch (e) {
        console.error("Delete Error:", e.response?.data || e.message);
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});
