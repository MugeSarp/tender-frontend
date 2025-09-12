import { useState } from "react";
import { classifyTender, DEFAULT_KEYWORDS } from "../lib/utils";

const DEF = {
  IoT: DEFAULT_KEYWORDS.IoT.join(", "),
  Experience: DEFAULT_KEYWORDS.Experience.join(", "),
  Marine: DEFAULT_KEYWORDS.Marine.join(", "),
  Target: DEFAULT_KEYWORDS.Target.join(", "),
  Bisan_Emira: DEFAULT_KEYWORDS.Bisan_Emira.join(", "),
};

export default function TenderClassifier() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [kIoT, setKIoT] = useState(DEF.IoT);
  const [kExp, setKExp] = useState(DEF.Experience);
  const [kMar, setKMar] = useState(DEF.Marine);
  const [kTar, setKTar] = useState(DEF.Target);
  const [kBis, setKBis] = useState(DEF.Bisan_Emira);
  const [onlyUnit, setOnlyUnit] = useState(true);
  const [out, setOut] = useState("");
  const [debug, setDebug] = useState<any>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = classifyTender({
      title,
      summary,
      keywords: {
        IoT: kIoT,
        Experience: kExp,
        Marine: kMar,
        Target: kTar,
        Bisan_Emira: kBis,
      },
    });
    setOut(r.unit);
    setDebug(onlyUnit ? null : r);
  }

  function fillExample() {
    setTitle("Remote Asset Monitoring Solution");
    setSummary(
      "We are looking for a solution to monitor our remote assets using smart sensors and IoT technology. The system should provide real-time data and predictive maintenance capabilities."
    );
  }

  return (
    <div className="rounded-md border p-4 mb-6 bg-white">
      <h3 className="text-lg font-semibold mb-2">Tender Classifier</h3>
      <p className="text-sm text-gray-600 mb-2">
        Anahtar kelimeleri virgülle <em>veya</em> satır satır girebilirsin.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-gray-600">Title</span>
            <input
              className="mt-1 w-full rounded-md border p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Summary</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border p-2"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </label>
        </div>

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">
            Keywords (editable)
          </summary>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <label className="block text-sm">
              IoT
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border p-2"
                value={kIoT}
                onChange={(e) => setKIoT(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Experience
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border p-2"
                value={kExp}
                onChange={(e) => setKExp(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Marine
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border p-2"
                value={kMar}
                onChange={(e) => setKMar(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Target
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border p-2"
                value={kTar}
                onChange={(e) => setKTar(e.target.value)}
              />
            </label>
            <label className="block text-sm md:col-span-2">
              Bisan_Emira
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border p-2"
                value={kBis}
                onChange={(e) => setKBis(e.target.value)}
              />
            </label>
          </div>
        </details>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyUnit}
              onChange={() => setOnlyUnit((v) => !v)}
            />
            Sadece birim adını göster
          </label>
          <button
            type="button"
            onClick={fillExample}
            className="px-3 py-2 rounded-md border"
          >
            Örnek doldur
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Submit
          </button>
        </div>
      </form>

      {out && (
        <div className="mt-3">
          <div className="text-sm text-gray-600">Sonuç:</div>
          <pre className="bg-gray-50 p-2 rounded text-sm">{out}</pre>
        </div>
      )}

      {debug && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm">Detay</summary>
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
