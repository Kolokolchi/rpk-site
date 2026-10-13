"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="fatal-error" role="alert">
      <h1>Не удалось отобразить страницу</h1>
      <p>Попробуйте загрузить страницу снова.</p>
      <button type="button" onClick={reset}>
        Повторить
      </button>
    </main>
  );
}
