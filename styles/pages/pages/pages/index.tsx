import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "AI Voice Lab",
        subtitle: "Turn any text into realistic speech instantly.",
        placeholder: "Type your text here...",
        button: "Convert to Speech",
      },
      ar: {
        title: "معمل الصوت بالذكاء الاصطناعي",
        subtitle: "حوّل أي نص إلى صوت واقعي فوراً.",
        placeholder: "اكتب النص هنا...",
        button: "تحويل النص إلى صوت",
      },
    };
    return translations[lang][key];
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAudio(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      const data = await res.json();
      setAudio(data.audio);
    } catch (err) {
      alert("حدث خطأ أثناء التحويل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white p-4"
    >
      <header className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 relative flex items-center justify-center">
          <div className="absolute bottom-0 flex items-end gap-1 animate-pulse-wave">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full"
                style={{
                  height: `${6 + Math.random() * 18}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </header>

      <div className="max-w-xl w-full bg-white text-gray-800 rounded-2xl shadow-2xl p-6 text-center">
        <h2 className="text-lg mb-4">{t("subtitle")}</h2>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>

        <textarea
          className="w-full border rounded p-3 mb-4"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "⏳ جاري التحويل..." : t("button")}
        </button>

        {audio && (
          <div className="mt-6">
            <audio controls src={audio} className="w-full"></audio>
          </div>
        )}
      </div>

      <footer className="mt-8 text-sm text-white/80">
        © 2025 AI Voice Lab — Powered by Hugging Face
      </footer>
    </div>
  );
}
