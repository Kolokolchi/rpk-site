"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import {
  Layers3,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Upload,
  X,
} from "lucide-react";
import { catalogIndex } from "../../shared/catalog-index";
import { defaultSettings, previewConfigs } from "./config";
import type { PreviewSettings, SceneProps } from "./types";
import { readArtwork, type ArtworkMeta } from "./artwork-upload";
const FacadeScene = dynamic(() => import("./FacadeScene"));
const ObjectScene = dynamic(() => import("./ObjectScene"));
const ProductionScene = dynamic(() => import("./ProductionScene"));

type Props = {
  slug: string;
};

const colors = [
  ["#ff8a00", "Оранжевый"],
  ["#ffffff", "Белый"],
  ["#173e56", "Синий"],
  ["#267c62", "Зелёный"],
  ["#ca4969", "Розовый"],
  ["#242d35", "Графит"],
] as const;

export default function ProductPreview({ slug }: Props) {
  const [saved, setSaved] = useState<Record<string, PreviewSettings>>({});
  const latestSaved = useRef(saved);
  latestSaved.current = saved;
  const imageUrls = useRef(new Set<string>());
  const currentSettings = saved[slug] ?? defaultSettings(slug);
  useEffect(() => {
    const urls = imageUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  function updateSettings(patch: Partial<PreviewSettings>) {
    const previousSettings = latestSaved.current[slug] ?? defaultSettings(slug);
    const next = { ...previousSettings, ...patch };
    if (previousSettings.image && previousSettings.image !== next.image) {
      URL.revokeObjectURL(previousSettings.image);
      imageUrls.current.delete(previousSettings.image);
    }
    if (next.image) imageUrls.current.add(next.image);
    latestSaved.current = { ...latestSaved.current, [slug]: next };
    setSaved((previous) => ({ ...previous, [slug]: next }));
  }
  return (
    <PreviewEditor
      key={slug}
      slug={slug}
      settings={currentSettings}
      onChange={updateSettings}
    />
  );
}

function PreviewEditor({
  slug,
  settings,
  onChange,
}: Props & {
  slug: string;
  settings: PreviewSettings;
  onChange: (settings: Partial<PreviewSettings>) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const previewRef = useRef<HTMLElement>(null);
  const uploadVersion = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const config = previewConfigs[slug];
  const entry = catalogIndex.find((item) => item.slug === slug)!;
  const [step, setStep] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMeta, setUploadMeta] = useState<ArtworkMeta | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [autoPlayed, setAutoPlayed] = useState(false);
  const fieldId = (name: string) => `${uid}-${name}`;
  const sceneProps: SceneProps = { slug, settings, step, exploded, id: uid };
  const widthCm = Math.round((settings.width / 240) * config.dimensions[0]);
  const heightCm = Math.round((settings.height / 100) * config.dimensions[1]);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([event]) => setInView(event.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(element);
    const handleVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      uploadVersion.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!inView || !pageVisible || autoPlayed) return;
    // Defer the authored sequence; the server-rendered scene is complete and usable.
    const timer = window.setTimeout(() => {
      setAutoPlayed(true);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setStep(0);
        setPlaying(true);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [inView, pageVisible, autoPlayed]);

  useEffect(() => {
    if (!playing || !inView || !pageVisible) return;
    const timer = window.setTimeout(() => {
      if (step < 3) setStep((previous) => previous + 1);
      else setPlaying(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [playing, step, inView, pageVisible]);

  function update(patch: Partial<PreviewSettings>) {
    onChange(patch);
    setAutoPlayed(true);
    setPlaying(false);
    setStep(3);
  }

  function play() {
    setAutoPlayed(true);
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === 3) setStep(0);
    setPlaying(true);
  }

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    await loadSelectedFile(file);
  }

  async function loadSelectedFile(file: File) {
    const version = ++uploadVersion.current;
    setUploadError("");
    setDecoding(true);
    try {
      const { url, meta } = await readArtwork(file);
      if (version !== uploadVersion.current) {
        URL.revokeObjectURL(url);
        return;
      }
      update({
        image: url,
        imageFit: "contain",
        imageScale: 100,
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageRotation: 0,
      });
      setUploadMeta(meta);
    } catch (error) {
      if (version === uploadVersion.current)
        setUploadError(
          error instanceof Error
            ? error.message
            : "Не удалось открыть макет. Попробуйте другой файл.",
        );
    } finally {
      if (version === uploadVersion.current) setDecoding(false);
    }
  }

  function reset() {
    uploadVersion.current += 1;
    setDecoding(false);
    setUploadError("");
    setUploadMeta(null);
    setExploded(false);
    update(defaultSettings(slug));
  }

  return (
    <section
      className="product-preview"
      id="interactive-preview"
      ref={previewRef}
      aria-labelledby={fieldId("title")}
      data-slug={slug}
    >
      <div className="preview-heading">
        <div>
          <h2 id={fieldId("title")}>Примерьте вашу идею</h2>
          <p>
            Измените детали и посмотрите, как изделие собирается на объекте.
          </p>
        </div>
        <span className="preview-live-label">
          <span aria-hidden="true" />
          Интерактивная модель
        </span>
      </div>
      <div className="preview-workspace">
        <div className="preview-visual">
          <div className="preview-scene-caption">
            <span>{entry.title}</span>
            <span>Иллюстрация применения</span>
          </div>
          <svg
            className="preview-scene"
            viewBox="0 0 800 520"
            role="img"
            aria-labelledby={fieldId("scene-title")}
            data-step={step}
            data-exploded={exploded}
          >
            <title id={fieldId("scene-title")}>
              {`${entry.title}: ${settings.text || "без надписи"}. ${config.steps[step]}${exploded ? ". Слои разнесены" : ""}.`}
            </title>
            <defs>
              <filter
                id={`${uid}-shadow`}
                x="-30%"
                y="-40%"
                width="160%"
                height="190%"
              >
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <filter
                id={`${uid}-glow`}
                x="-30%"
                y="-50%"
                width="160%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {config.family === "facade" ? (
              <FacadeScene {...sceneProps} />
            ) : config.family === "production" ? (
              <ProductionScene {...sceneProps} />
            ) : (
              <ObjectScene {...sceneProps} />
            )}
          </svg>
          <div className="preview-playback">
            <button
              type="button"
              onClick={play}
              aria-label={
                playing
                  ? "Приостановить сборку"
                  : step === 3
                    ? "Повторить сборку"
                    : "Продолжить сборку"
              }
            >
              {playing ? (
                <Pause aria-hidden="true" />
              ) : step === 3 ? (
                <RotateCcw aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              <span>
                {playing
                  ? "Пауза"
                  : step === 3
                    ? "Повторить сборку"
                    : "Продолжить"}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={exploded}
              onClick={() => {
                setExploded((value) => !value);
                setAutoPlayed(true);
                setPlaying(false);
                setStep(3);
              }}
            >
              <Layers3 aria-hidden="true" />
              <span>{exploded ? "Собрать изделие" : "По слоям"}</span>
            </button>
          </div>
          <ol className="preview-steps" aria-label="Этапы изготовления">
            {config.steps.map((label, index) => (
              <li key={label}>
                <button
                  type="button"
                  aria-current={step === index ? "step" : undefined}
                  data-complete={step >= index}
                  onClick={() => {
                    setStep(index);
                    setAutoPlayed(true);
                    setPlaying(false);
                  }}
                >
                  <span aria-hidden="true">{index + 1}</span>
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="preview-controls">
          <p className="preview-hint">{config.hint}</p>
          {slug !== "metal-fabrication" && (
            <div className="preview-field">
              <label htmlFor={fieldId("text")}>
                {slug === "stencils-and-marking"
                  ? "Текст маркировки"
                  : "Ваша надпись"}
                <span>{Array.from(settings.text).length}/24</span>
              </label>
              <input
                id={fieldId("text")}
                type="text"
                value={settings.text}
                maxLength={48}
                onChange={(event) =>
                  update({
                    text: Array.from(event.target.value).slice(0, 24).join(""),
                  })
                }
                placeholder="Введите название"
                autoComplete="off"
                disabled={
                  Boolean(settings.image) &&
                  !["banner-printing", "uv-printing"].includes(slug)
                }
              />
              {settings.image &&
                !["banner-printing", "uv-printing"].includes(slug) && (
                  <small className="preview-text-note">
                    Ваш макет заменяет надпись. Удалите изображение, чтобы
                    изменить текст.
                  </small>
                )}
            </div>
          )}
          {config.image && (
            <div
              className="preview-upload"
              data-dragover={dragging}
              onDragOver={(event) => {
                if (event.dataTransfer.types.includes("Files")) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                  setDragging(true);
                }
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const files = event.dataTransfer.files;
                if (files.length !== 1) {
                  setUploadError("Перетащите один файл макета из папки.");
                  return;
                }
                void loadSelectedFile(files[0]);
              }}
            >
              <input
                ref={fileRef}
                className="preview-file-input"
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                aria-label="Загрузить свой макет"
                onChange={chooseImage}
              />
              <button
                type="button"
                disabled={decoding}
                onClick={() => fileRef.current?.click()}
              >
                <Upload aria-hidden="true" />
                {decoding
                  ? "Открываем изображение…"
                  : settings.image
                    ? "Заменить изображение"
                    : "Загрузить свой макет"}
              </button>
              {settings.image ? (
                <div className="preview-uploaded preview-artwork-summary">
                  <img
                    src={settings.image}
                    alt="Предпросмотр загруженного макета"
                    width={56}
                    height={56}
                  />
                  <span>
                    <strong>{uploadMeta?.name || "Ваше изображение"}</strong>
                    {uploadMeta && (
                      <small>
                        {uploadMeta.format} · {uploadMeta.width} ×{" "}
                        {uploadMeta.height} px ·{" "}
                        {uploadMeta.bytes < 1024 * 1024
                          ? `${Math.ceil(uploadMeta.bytes / 1024)} КБ`
                          : `${(uploadMeta.bytes / 1024 / 1024).toFixed(1)} МБ`}
                      </small>
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label="Удалить изображение"
                    onClick={() => {
                      uploadVersion.current += 1;
                      setDecoding(false);
                      update({ image: null });
                      setUploadMeta(null);
                      setUploadError("");
                    }}
                  >
                    <X aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              <small className="preview-file-formats">
                PNG, JPG, WebP, SVG · до 8 МБ. Файл остаётся в браузере.
              </small>
              <small className="preview-drop-hint">
                Можно перетащить один файл из папки.
              </small>
              <details className="preview-artwork-help">
                <summary>Как подготовить макет?</summary>
                <p>
                  Для логотипа — SVG или PNG с прозрачным фоном. Для готовой
                  композиции — PNG, JPG, WebP или SVG.
                </p>
                <p>
                  Из PDF, AI, CDR или EPS экспортируйте SVG со шрифтами в кривых
                  либо PNG. Исходник можно передать менеджеру при заказе.
                </p>
                <p>
                  До 12 000 px по стороне и до 40 Мп. Это примерка:
                  производственный файл согласуем отдельно.
                </p>
              </details>
              {settings.image && (
                <fieldset className="preview-artwork-placement">
                  <legend>Размещение макета</legend>
                  <div className="preview-artwork-fit">
                    <button
                      type="button"
                      aria-pressed={
                        (settings.imageFit ?? "contain") === "contain"
                      }
                      onClick={() => update({ imageFit: "contain" })}
                    >
                      Вписать целиком
                    </button>
                    <button
                      type="button"
                      aria-pressed={settings.imageFit === "cover"}
                      onClick={() => update({ imageFit: "cover" })}
                    >
                      Заполнить поверхность
                    </button>
                  </div>
                  {[
                    ["imageScale", "Масштаб макета", 50, 180, 100],
                    ["imageOffsetX", "Макет по горизонтали", -50, 50, 0],
                    ["imageOffsetY", "Макет по вертикали", -50, 50, 0],
                  ].map(([key, label, min, max, fallback]) => {
                    const field = key as
                      "imageScale" | "imageOffsetX" | "imageOffsetY";
                    const value = settings[field] ?? Number(fallback);
                    return (
                      <div key={key} className="preview-field">
                        <label htmlFor={fieldId(String(key))}>
                          {String(label)}
                          <output htmlFor={fieldId(String(key))}>
                            {value}%
                          </output>
                        </label>
                        <input
                          id={fieldId(String(key))}
                          type="range"
                          min={Number(min)}
                          max={Number(max)}
                          step="5"
                          value={value}
                          onChange={(event) =>
                            update({ [field]: Number(event.target.value) })
                          }
                        />
                      </div>
                    );
                  })}
                  <div className="preview-artwork-actions">
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          imageRotation:
                            ((settings.imageRotation ?? 0) + 90) % 360,
                        })
                      }
                    >
                      <RotateCw aria-hidden="true" />
                      Повернуть 90°
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          imageFit: "contain",
                          imageScale: 100,
                          imageOffsetX: 0,
                          imageOffsetY: 0,
                          imageRotation: 0,
                        })
                      }
                    >
                      Сбросить размещение
                    </button>
                  </div>
                </fieldset>
              )}
              {uploadError && (
                <p className="preview-error" role="alert">
                  {uploadError}
                </p>
              )}
            </div>
          )}
          <fieldset className="preview-colors">
            <legend>
              Цвет {config.family === "production" ? "графики" : "изделия"}
            </legend>
            {colors.map(([color, label]) => (
              <button
                key={color}
                type="button"
                aria-label={label}
                aria-pressed={settings.color === color}
                onClick={() => update({ color })}
              >
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="3" y="3" width="26" height="26" fill={color} />
                  {settings.color === color && (
                    <path
                      d="m10 16 4 4 8-9"
                      fill="none"
                      stroke={
                        color === "#ffffff" || color === "#ff8a00"
                          ? "#111"
                          : "#fff"
                      }
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </button>
            ))}
          </fieldset>
          <div className="preview-dimensions">
            <div className="preview-field">
              <label htmlFor={fieldId("width")}>
                Ширина<output htmlFor={fieldId("width")}>{widthCm} см</output>
              </label>
              <input
                id={fieldId("width")}
                type="range"
                min="120"
                max="360"
                step="10"
                value={settings.width}
                onChange={(event) =>
                  update({ width: Number(event.target.value) })
                }
                aria-valuetext={`${widthCm} сантиметров`}
              />
            </div>
            <div className="preview-field">
              <label htmlFor={fieldId("height")}>
                Высота<output htmlFor={fieldId("height")}>{heightCm} см</output>
              </label>
              <input
                id={fieldId("height")}
                type="range"
                min="50"
                max="150"
                step="5"
                value={settings.height}
                onChange={(event) =>
                  update({ height: Number(event.target.value) })
                }
                aria-valuetext={`${heightCm} сантиметров`}
              />
            </div>
          </div>
          {config.light && (
            <label className="preview-light">
              <input
                type="checkbox"
                checked={settings.lit}
                onChange={(event) => update({ lit: event.target.checked })}
              />
              <span>Включить подсветку</span>
            </label>
          )}
          <p className="preview-scale-note">
            Размеры условные — для сравнения пропорций. Точную конструкцию
            подбираем после замера.
          </p>
          <div className="preview-control-footer">
            <button type="button" className="preview-reset" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              Сбросить
            </button>
          </div>
        </div>
      </div>
      <p className="preview-status" role="status" aria-live="polite">
        {playing ? "Сборка: " : "Этап: "}
        {config.steps[step]}
        {exploded ? ". Показаны слои изделия." : ""}
      </p>
    </section>
  );
}
