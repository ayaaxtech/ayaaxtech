import React, { useState, useEffect } from 'react';

const MESSAGES = [
  { text: "Be yourself with your brain, not your heart; it leads to what you need, not just what you like. - Ayaan K", lang: "English" },
  { text: "用大脑做自己，而不是用心；它会引导你走向所需，而不仅仅是所好。 - 阿扬 K", lang: "Chinese" },
  { text: "Sei du selbst mit deinem Verstand, nicht mit deinem Herzen; es führt dich zu dem, was du brauchst, nicht nur zu dem, was du magst. - Ayaan K", lang: "German" },
  { text: "心ではなく脳で自分らしくあれ。それは単に好きなものではなく、必要なものへと導いてくれる。 - アヤーン K", lang: "Japanese" },
  { text: "가슴이 아닌 머리로 당신 자신이 되세요. 그것은 당신이 좋아하는 것뿐만 아니라 당신에게 필요한 것으로 인도합니다. - 아얀 K", lang: "Korean" },
  { text: "Sé tú mismo con tu cerebro, no con tu corazón; te lleva a lo que necesitas, no solo a lo que te gusta. - Ayaan K", lang: "Spanish" },
  { text: "Sois toi-même avec ton cerveau, pas avec ton cœur ; cela mène à ce dont tu as besoin, pas seulement à ce que tu aimes. - Ayaan K", lang: "French" },
  { text: "Sii te stesso con il tuo cervello, non con il tuo cuore; ti porta a ciò di cui hai bisogno, non solo a ciò che ti piace. - Ayaan K", lang: "Italian" },
  { text: "Seja você mesmo com seu cérebro, não com seu coração; isso leva ao que você precisa, não apenas ao que você gosta. - Ayaan K", lang: "Portuguese" },
  { text: "Будь собой своим умом, а не сердцем; это ведет к тому, что тебе нужно, а не только к тому, что тебе нравится. - Аян К", lang: "Russian" },
  { text: "كن على طبيعتك بعقلك، لا بقلبك؛ فالعقل يقودك إلى ما تحتاجه، وليس فقط ما تحبه. - أيان ك", lang: "Arabic" }
];

export const WelcomeCycler: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 1000); // 1s for fade out
    }, 10000); // 10s total cycle

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center px-6">
      <p 
        className={`text-[18px] md:text-[22px] font-serif italic text-white/90 tracking-[0.05em] leading-relaxed transition-opacity duration-1000 text-center max-w-2xl ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        {MESSAGES[index].text}
      </p>
      <span className="text-[8px] uppercase font-sans font-black tracking-[0.6em] text-white/30 block mt-4">
        {MESSAGES[index].lang} • Logic Over Impulse
      </span>
    </div>
  );
};