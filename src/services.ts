import type { GenerationInput, RenderMetadata } from './types';

const RENDERS_KEY = 'archvision.renders';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadToPermanentStorage(file: File): Promise<string> {
  if (window.puter?.fs?.upload) {
    const result = await window.puter.fs.upload(file.name, file);
    return result.url ?? result.path ?? URL.createObjectURL(file);
  }

  return URL.createObjectURL(file);
}

async function getAISummary(model: string, prompt: string): Promise<string> {
  if (window.puter?.ai?.chat) {
    const reply = await window.puter.ai.chat(prompt, { model });
    return reply.message ?? reply.text ?? 'AI generated an architectural concept summary.';
  }

  return `Generated with ${model}: airy open-plan layout, volumetric daylight studies, and tactile material palette tuned for modern residential living.`;
}

function getStoredRenders(): RenderMetadata[] {
  const raw = localStorage.getItem(RENDERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as RenderMetadata[];
  } catch {
    return [];
  }
}

function persistRenders(items: RenderMetadata[]): void {
  localStorage.setItem(RENDERS_KEY, JSON.stringify(items));
}

function buildRenderImage(model: string, style: string): string {
  const label = encodeURIComponent(`${model} · ${style} · photoreal 3D`);
  return `https://placehold.co/1280x720/0f172a/e2e8f0/png?text=${label}`;
}

export async function generateRender(input: GenerationInput): Promise<RenderMetadata> {
  await sleep(900);

  const sourcePlanUrl = await uploadToPermanentStorage(input.sourcePlan);
  const renderSummary = await getAISummary(
    input.model,
    `Convert this 2D floor plan idea into a photorealistic 3D architectural narrative. Style: ${input.style}. Prompt: ${input.prompt}`
  );

  const newRender: RenderMetadata = {
    id: crypto.randomUUID(),
    title: input.title,
    prompt: input.prompt,
    style: input.style,
    model: input.model,
    createdAt: new Date().toISOString(),
    sourcePlanName: input.sourcePlan.name,
    sourcePlanUrl,
    renderImageUrl: buildRenderImage(input.model, input.style),
    renderSummary,
    author: input.author,
    likes: Math.floor(Math.random() * 50)
  };

  const existing = getStoredRenders();
  persistRenders([newRender, ...existing]);
  return newRender;
}

export function loadCommunityFeed(): RenderMetadata[] {
  return getStoredRenders().sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
}

export function likeRender(id: string): RenderMetadata[] {
  const updated = getStoredRenders().map((item) => {
    if (item.id !== id) {
      return item;
    }

    return { ...item, likes: item.likes + 1 };
  });

  persistRenders(updated);
  return updated;
}
