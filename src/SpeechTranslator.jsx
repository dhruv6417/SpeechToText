import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const LIBRE_TRANSLATE_API = "https://libretranslate.de/translate";

const languageOptions = [
  { code: "en", label: "English", speechCode: "en-US" },
  { code: "hi", label: "Hindi", speechCode: "hi-IN" },
  { code: "ta", label: "Tamil", speechCode: "ta-IN" },
  { code: "mr", label: "Marathi", speechCode: "mr-IN" },
  { code: "bn", label: "Bengali", speechCode: "bn-IN" }
];

const SpeechTranslator = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [translatedText, setTranslatedText] = useState("");
  const [inputLang, setInputLang] = useState("en"); // Default input: English
  const [outputLang, setOutputLang] = useState("hi"); // Default output: Hindi

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition.");
    }
  }, []);

  const startListening = () => {
    resetTranscript();
    const selected = languageOptions.find((lang) => lang.code === inputLang);
    SpeechRecognition.startListening({ continuous: true, language: selected?.speechCode || "en-US" });
  };

  const stopListening = async () => {
    SpeechRecognition.stopListening();
    await translateText(transcript);
  };

  const translateText = async (text) => {
    if (!text) return;
    try {
      const response = await axios.post(LIBRE_TRANSLATE_API, {
        q: text,
        source: inputLang,
        target: outputLang,
        format: "text"
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation error.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙️ Real-Time Speech Translation</h2>
      <div style={{ marginBottom: 10 }}>
        <label>
          🎤 Input Language:{" "}
          <select onChange={(e) => setInputLang(e.target.value)} value={inputLang}>
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>
          🌐 Output Language:{" "}
          <select onChange={(e) => setOutputLang(e.target.value)} value={outputLang}>
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button onClick={startListening} disabled={listening}>
          Start
        </button>
        <button onClick={stopListening} disabled={!listening}>
          Stop
        </button>
      </div>
      <div style={{ marginTop: 20 }}>
        <p>
          <strong>Original ({inputLang}):</strong> {transcript}
        </p>
        <p>
          <strong>Translated ({outputLang}):</strong> {translatedText}
        </p>
      </div>
    </div>
  );
};

export default SpeechTranslator;
