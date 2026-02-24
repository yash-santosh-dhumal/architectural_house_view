import { FormEvent, useMemo, useState } from 'react';
import { generateRender, likeRender, loadCommunityFeed } from './services';
import type { AIModel, RenderMetadata } from './types';

const MODEL_OPTIONS: AIModel[] = ['claude-3.5-sonnet', 'gemini-1.5-pro', 'gpt-4o-mini'];

export function App() {
  const [author, setAuthor] = useState('designer@studio.ai');
  const [title, setTitle] = useState('Scandinavian Family House');
  const [prompt, setPrompt] = useState('Double-height living room, natural timber cladding, large skylight, and soft daylight mood.');
  const [style, setStyle] = useState('Nordic Minimal');
  const [model, setModel] = useState<AIModel>('claude-3.5-sonnet');
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [status, setStatus] = useState('Idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [feed, setFeed] = useState<RenderMetadata[]>(() => loadCommunityFeed());

  const totalRenders = feed.length;
  const totalLikes = useMemo(() => feed.reduce((sum, item) => sum + item.likes, 0), [feed]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!planFile) {
      setStatus('Upload a 2D floor plan before generating.');
      return;
    }

    setIsGenerating(true);
    setStatus('Deploying serverless worker and generating photoreal render...');

    try {
      const render = await generateRender({
        title,
        prompt,
        style,
        model,
        sourcePlan: planFile,
        author
      });
      setFeed((current) => [render, ...current]);
      setStatus(`Render complete and permanently hosted: ${render.renderImageUrl}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Render generation failed.');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleLike(id: string) {
    setFeed(likeRender(id));
  }

  return (
    <main className="page">
      <section className="hero card">
        <h1>ArchVision AI SaaS</h1>
        <p>
          Transform 2D floor plans into photorealistic 3D renders with Claude, Gemini, and Puter.js backed
          permanent hosting. Deploy instantly with serverless workers, high-throughput KV persistence, and a global
          community feed.
        </p>
        <div className="metrics">
          <article>
            <span>{totalRenders}</span>
            <small>Total renders</small>
          </article>
          <article>
            <span>{totalLikes}</span>
            <small>Community likes</small>
          </article>
          <article>
            <span>99.95%</span>
            <small>Worker uptime target</small>
          </article>
        </div>
      </section>

      <section className="layout">
        <form className="card form" onSubmit={handleSubmit}>
          <h2>2D → 3D Generation Studio</h2>
          <label>
            Creator identity
            <input value={author} onChange={(event) => setAuthor(event.target.value)} required />
          </label>
          <label>
            Project title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Design prompt
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} required />
          </label>
          <label>
            Visual style
            <input value={style} onChange={(event) => setStyle(event.target.value)} required />
          </label>
          <label>
            AI model
            <select value={model} onChange={(event) => setModel(event.target.value as AIModel)}>
              {MODEL_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Floor plan upload (PNG/JPG/PDF)
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(event) => setPlanFile(event.target.files?.[0] ?? null)}
              required
            />
          </label>
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Photoreal 3D Render'}
          </button>
          <p className="status">{status}</p>
        </form>

        <aside className="card feed">
          <h2>Global Community Feed</h2>
          {feed.length === 0 ? <p>No renders yet. Create the first showcase.</p> : null}
          {feed.map((render) => (
            <article key={render.id} className="feed-item">
              <img src={render.renderImageUrl} alt={render.title} loading="lazy" />
              <div>
                <h3>{render.title}</h3>
                <p>{render.renderSummary}</p>
                <p>
                  <strong>{render.author}</strong> · {new Date(render.createdAt).toLocaleString()} · {render.model}
                </p>
                <p>
                  Plan: <a href={render.sourcePlanUrl}>{render.sourcePlanName}</a>
                </p>
                <button type="button" onClick={() => handleLike(render.id)}>
                  ❤ Like ({render.likes})
                </button>
              </div>
            </article>
          ))}
        </aside>
      </section>
    </main>
  );
}
