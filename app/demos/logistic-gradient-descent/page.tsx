'use client';

import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Play,
  RotateCcw,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const stepNames = ['Setup', 'Score', 'Sigmoid', 'Error', 'Gradient', 'Update', 'Check'];
const DEFAULT_FEATURES = { x1: 3, x2: 2 };
const INITIAL_PARAMETERS = { w1: 0, w2: 0, b: 0 };
const y = 1;

type Features = typeof DEFAULT_FEATURES;
type ModelParameters = typeof INITIAL_PARAMETERS;
type HistoryPoint = ModelParameters & {
  iteration: number;
  yHat: number;
  loss: number;
};

function DemoButton({
  variant = 'default',
  className = '',
  type = 'button',
  ...props
}: ComponentProps<'button'> & {
  variant?: 'default' | 'secondary' | 'outline';
}) {
  return (
    <button
      type={type}
      className={`demo-button is-${variant} ${className}`}
      {...props}
    />
  );
}

const round = (value: number, digits = 4) =>
  Number(value.toFixed(digits)).toString();

function evaluate(parameters: ModelParameters, features: Features) {
  const z =
    parameters.w1 * features.x1 +
    parameters.w2 * features.x2 +
    parameters.b;
  const yHat = 1 / (1 + Math.exp(-z));
  const error = yHat - y;
  const gradient = {
    w1: error * features.x1,
    w2: error * features.x2,
    b: error,
  };
  const loss = -Math.log(Math.max(yHat, Number.EPSILON));
  return { z, yHat, error, gradient, loss };
}

function updateParameters(
  parameters: ModelParameters,
  gradient: ModelParameters,
  eta: number,
) {
  return {
    w1: parameters.w1 - eta * gradient.w1,
    w2: parameters.w2 - eta * gradient.w2,
    b: parameters.b - eta * gradient.b,
  };
}

function historyPoint(
  iteration: number,
  parameters: ModelParameters,
  features: Features,
): HistoryPoint {
  const metrics = evaluate(parameters, features);
  return {
    iteration,
    ...parameters,
    yHat: metrics.yHat,
    loss: metrics.loss,
  };
}

function runIterations(
  startingParameters: ModelParameters,
  startingIteration: number,
  startingHistory: HistoryPoint[],
  features: Features,
  eta: number,
  count: number,
) {
  let parameters = { ...startingParameters };
  let iteration = startingIteration;
  const addedHistory: HistoryPoint[] = [];

  for (let index = 0; index < count; index += 1) {
    const metrics = evaluate(parameters, features);
    parameters = updateParameters(parameters, metrics.gradient, eta);
    iteration += 1;
    addedHistory.push(historyPoint(iteration, parameters, features));
  }

  return {
    parameters,
    iteration,
    history: [...startingHistory, ...addedHistory].slice(-101),
  };
}

function ParameterBox({
  name,
  before,
  gradient,
  after,
  showGradient,
  showAfter,
}: {
  name: string;
  before: number;
  gradient: number;
  after: number;
  showGradient: boolean;
  showAfter: boolean;
}) {
  return (
    <div className="parameter-row">
      <span className="parameter-name">{name}</span>
      <span className="parameter-value">{round(before, 3)}</span>
      <span className="parameter-operator">− η ×</span>
      <span className="gradient-value">
        {showGradient ? round(gradient, 3) : '—'}
      </span>
      <ArrowRight aria-hidden="true" className="parameter-arrow" />
      <span className={showAfter ? 'parameter-result is-revealed' : 'parameter-result'}>
        {showAfter ? round(after, 3) : '—'}
      </span>
    </div>
  );
}

function LossChart({ history }: { history: HistoryPoint[] }) {
  const width = 640;
  const height = 190;
  const padding = 28;
  const latest = history[history.length - 1];
  const maxIteration = Math.max(1, latest.iteration);
  const maxLoss = Math.max(0.01, ...history.map((point) => point.loss));
  const coordinates = history.map((point) => ({
    x: padding + (point.iteration / maxIteration) * (width - padding * 2),
    y:
      height -
      padding -
      (point.loss / maxLoss) * (height - padding * 2),
  }));
  const points = coordinates.map((point) => `${point.x},${point.y}`).join(' ');
  const lastCoordinate = coordinates[coordinates.length - 1];

  return (
    <div className="loss-chart-card">
      <div className="chart-heading">
        <div>
          <span>Cross-entropy loss</span>
          <strong>{latest.loss.toFixed(4)}</strong>
        </div>
        <div>
          <span>Positive probability ŷ</span>
          <strong>{latest.yHat.toFixed(4)}</strong>
        </div>
      </div>
      <svg
        className="loss-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Loss across ${latest.iteration} gradient descent updates`}
      >
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={padding}
            x2={width - padding}
            y1={padding + fraction * (height - padding * 2)}
            y2={padding + fraction * (height - padding * 2)}
            className="chart-grid-line"
          />
        ))}
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          className="chart-axis"
        />
        {coordinates.length > 1 && (
          <polyline points={points} className="loss-line" />
        )}
        {coordinates.map((point, index) => (
          <circle
            key={`${history[index].iteration}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === coordinates.length - 1 ? 5 : 2.5}
            className={index === coordinates.length - 1 ? 'loss-point is-latest' : 'loss-point'}
          />
        ))}
        <text x={padding} y={height - 7} className="chart-label">
          iteration 0
        </text>
        <text x={width - padding} y={height - 7} textAnchor="end" className="chart-label">
          iteration {latest.iteration}
        </text>
        {lastCoordinate && (
          <text
            x={Math.min(width - 58, lastCoordinate.x + 10)}
            y={Math.max(16, lastCoordinate.y - 10)}
            className="chart-value"
          >
            {latest.loss.toFixed(3)}
          </text>
        )}
      </svg>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [eta, setEta] = useState(0.1);
  const [features, setFeatures] = useState<Features>(DEFAULT_FEATURES);
  const [parameters, setParameters] =
    useState<ModelParameters>(INITIAL_PARAMETERS);
  const [iteration, setIteration] = useState(0);
  const [history, setHistory] = useState<HistoryPoint[]>([
    historyPoint(0, INITIAL_PARAMETERS, DEFAULT_FEATURES),
  ]);

  const featuresRef = useRef(features);
  const parametersRef = useRef(parameters);
  const etaRef = useRef(eta);
  const iterationRef = useRef(iteration);
  const historyRef = useRef(history);

  useEffect(() => {
    featuresRef.current = features;
    parametersRef.current = parameters;
    etaRef.current = eta;
    iterationRef.current = iteration;
    historyRef.current = history;
  }, [features, parameters, eta, iteration, history]);

  const metrics = useMemo(
    () => evaluate(parameters, features),
    [parameters, features],
  );
  const nextParameters = useMemo(
    () => updateParameters(parameters, metrics.gradient, eta),
    [parameters, metrics.gradient, eta],
  );
  const nextMetrics = useMemo(
    () => evaluate(nextParameters, features),
    [nextParameters, features],
  );

  const commitSteps = (count: number) => {
    const result = runIterations(
      parameters,
      iteration,
      history,
      features,
      eta,
      count,
    );
    setParameters(result.parameters);
    setIteration(result.iteration);
    setHistory(result.history);
    setStep(6);
  };

  const resetModel = (nextFeatures = features) => {
    setParameters(INITIAL_PARAMETERS);
    setIteration(0);
    setHistory([historyPoint(0, INITIAL_PARAMETERS, nextFeatures)]);
    setStep(0);
  };

  const resetPdfDefaults = () => {
    setFeatures(DEFAULT_FEATURES);
    setEta(0.1);
    resetModel(DEFAULT_FEATURES);
  };

  const updateFeature = (key: keyof Features, rawValue: string) => {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed)
      ? Math.min(50, Math.max(0, Math.round(parsed)))
      : 0;
    const nextFeatures = { ...features, [key]: value };
    setFeatures(nextFeatures);
    resetModel(nextFeatures);
  };

  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool?: (
            tool: {
              name: string;
              title: string;
              description: string;
              inputSchema: object;
              annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
              execute: (input: unknown) => unknown;
            },
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;

    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const register = (tool: Parameters<NonNullable<typeof context.registerTool>>[0]) =>
      Promise.resolve(context.registerTool?.(tool, { signal: lifecycle.signal })).catch(
        () => undefined,
      );

    void register({
      name: 'configure_gradient_demo',
      title: 'Configure gradient demo',
      description:
        'Set the walkthrough step, feature counts, or learning rate. Changing a feature resets training to iteration zero.',
      inputSchema: {
        type: 'object',
        properties: {
          step: { type: 'integer', minimum: 1, maximum: 7 },
          x1: { type: 'integer', minimum: 0, maximum: 50 },
          x2: { type: 'integer', minimum: 0, maximum: 50 },
          learningRate: { type: 'number', minimum: 0.01, maximum: 0.2 },
        },
        additionalProperties: false,
        minProperties: 1,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (!input || typeof input !== 'object') {
          throw new Error('Expected an object with at least one setting.');
        }
        const next = input as {
          step?: number;
          x1?: number;
          x2?: number;
          learningRate?: number;
        };
        if (next.step !== undefined) {
          if (!Number.isInteger(next.step) || next.step < 1 || next.step > 7) {
            throw new Error('step must be an integer from 1 to 7.');
          }
          setStep(next.step - 1);
        }
        if (next.learningRate !== undefined) {
          if (next.learningRate < 0.01 || next.learningRate > 0.2) {
            throw new Error('learningRate must be between 0.01 and 0.20.');
          }
          setEta(next.learningRate);
          etaRef.current = next.learningRate;
        }
        if (next.x1 !== undefined || next.x2 !== undefined) {
          const nextFeatures = {
            x1: next.x1 ?? featuresRef.current.x1,
            x2: next.x2 ?? featuresRef.current.x2,
          };
          if (
            !Number.isInteger(nextFeatures.x1) ||
            !Number.isInteger(nextFeatures.x2) ||
            nextFeatures.x1 < 0 ||
            nextFeatures.x1 > 50 ||
            nextFeatures.x2 < 0 ||
            nextFeatures.x2 > 50
          ) {
            throw new Error('x1 and x2 must be integers from 0 to 50.');
          }
          setFeatures(nextFeatures);
          setParameters(INITIAL_PARAMETERS);
          setIteration(0);
          const resetHistory = [
            historyPoint(0, INITIAL_PARAMETERS, nextFeatures),
          ];
          setHistory(resetHistory);
          featuresRef.current = nextFeatures;
          parametersRef.current = INITIAL_PARAMETERS;
          iterationRef.current = 0;
          historyRef.current = resetHistory;
        }
        return {
          step: next.step ?? 'unchanged',
          x1: next.x1 ?? featuresRef.current.x1,
          x2: next.x2 ?? featuresRef.current.x2,
          learningRate: next.learningRate ?? etaRef.current,
        };
      },
    });

    void register({
      name: 'run_gradient_steps',
      title: 'Run gradient steps',
      description:
        'Apply one or more gradient descent updates to the current repeated training observation and update the visible history.',
      inputSchema: {
        type: 'object',
        properties: {
          steps: { type: 'integer', minimum: 1, maximum: 100 },
        },
        required: ['steps'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const count = (input as { steps?: number } | null)?.steps;
        if (!Number.isInteger(count) || !count || count < 1 || count > 100) {
          throw new Error('steps must be an integer from 1 to 100.');
        }
        const result = runIterations(
          parametersRef.current,
          iterationRef.current,
          historyRef.current,
          featuresRef.current,
          etaRef.current,
          count,
        );
        setParameters(result.parameters);
        setIteration(result.iteration);
        setHistory(result.history);
        setStep(6);
        parametersRef.current = result.parameters;
        iterationRef.current = result.iteration;
        historyRef.current = result.history;
        const latest = result.history[result.history.length - 1];
        return {
          iteration: result.iteration,
          prediction: Number(latest.yHat.toFixed(6)),
          loss: Number(latest.loss.toFixed(6)),
          parameters: result.parameters,
        };
      },
    });

    return () => lifecycle.abort();
  }, []);

  const theta = `[${round(parameters.w1, 3)}, ${round(parameters.w2, 3)}, ${round(parameters.b, 3)}]`;
  const nextTheta = `[${round(nextParameters.w1, 3)}, ${round(nextParameters.w2, 3)}, ${round(nextParameters.b, 3)}]`;
  const gradientVector = `[${round(metrics.gradient.w1, 3)}, ${round(metrics.gradient.w2, 3)}, ${round(metrics.gradient.b, 3)}]`;

  const steps = [
    {
      eyebrow: `Iteration ${iteration} · current state`,
      title: 'Set up the current training step',
      formula: `x = [${features.x1}, ${features.x2}],   y = 1,   θᵗ = ${theta}`,
      substitution: `${features.x1} positive words · ${features.x2} negative words · positive review`,
      result: `η = ${eta.toFixed(2)}`,
      explanation:
        iteration === 0
          ? 'The PDF example starts with all three parameters at zero. You can change x₁ and x₂; doing so resets the model so the new run stays easy to interpret.'
          : 'These parameters came from the previous updates. This iteration now treats them as the starting point for the next gradient step.',
      cue: 'Next, combine the current parameters and features into a linear score.',
    },
    {
      eyebrow: `Iteration ${iteration} · forward pass`,
      title: 'Compute the linear score',
      formula: 'z = w₁x₁ + w₂x₂ + b',
      substitution: `z = (${round(parameters.w1, 3)} × ${features.x1}) + (${round(parameters.w2, 3)} × ${features.x2}) + ${round(parameters.b, 3)}`,
      result: `z = ${round(metrics.z)}`,
      explanation:
        iteration === 0
          ? 'With the PDF defaults, every parameter is zero, so neither feature influences the first prediction.'
          : 'After training, the score reflects everything the current parameters have learned from the repeated observation.',
      cue: 'The sigmoid will turn this score into a probability.',
    },
    {
      eyebrow: `Iteration ${iteration} · forward pass`,
      title: 'Convert the score to a probability',
      formula: 'ŷ = σ(z) = 1 / (1 + e⁻ᶻ)',
      substitution: `ŷ = σ(${round(metrics.z)})`,
      result: `ŷ = ${metrics.yHat.toFixed(4)}`,
      explanation:
        'This is the model’s probability for the positive class before the next update.',
      cue: 'Compare this prediction with the true label y = 1.',
    },
    {
      eyebrow: `Iteration ${iteration} · error signal`,
      title: 'Measure the direction of the mistake',
      formula: 'δ = ŷ − y',
      substitution: `δ = ${metrics.yHat.toFixed(4)} − 1`,
      result: `δ = ${round(metrics.error)}`,
      explanation:
        'Because this observation is positive, a negative error means the prediction is still too low. As ŷ approaches 1, the error shrinks toward zero.',
      cue: 'Multiply this shared error signal by each input feature.',
    },
    {
      eyebrow: `Iteration ${iteration} · gradient`,
      title: 'Compute one gradient per parameter',
      formula: '∇L = [(ŷ−y)x₁, (ŷ−y)x₂, ŷ−y]',
      substitution: `∇L = [(${round(metrics.error)})(${features.x1}), (${round(metrics.error)})(${features.x2}), ${round(metrics.error)}]`,
      result: `∇L = ${gradientVector}`,
      explanation:
        'The gradient changes at every iteration because the current prediction changes. The learning rate still does not appear inside the gradient.',
      cue: 'Now scale this gradient by η and move in the opposite direction.',
    },
    {
      eyebrow: `Iteration ${iteration} → ${iteration + 1}`,
      title: 'Preview the next parameter update',
      formula: 'θᵗ⁺¹ = θᵗ − η∇L',
      substitution: `θᵗ⁺¹ = ${theta} − ${eta.toFixed(2)}${gradientVector}`,
      result: `θᵗ⁺¹ = ${nextTheta}`,
      explanation:
        'This panel previews the next parameters. Use “Apply this update” or the multi-step controls to commit the change.',
      cue: 'Check the predicted probability and loss after the previewed update.',
    },
    {
      eyebrow: `Preview iteration ${iteration + 1}`,
      title: 'Check that the next update reduces loss',
      formula: 'zᵗ⁺¹ = w₁ᵗ⁺¹x₁ + w₂ᵗ⁺¹x₂ + bᵗ⁺¹',
      substitution: `zᵗ⁺¹ = (${round(nextParameters.w1, 3)} × ${features.x1}) + (${round(nextParameters.w2, 3)} × ${features.x2}) + ${round(nextParameters.b, 3)}`,
      result: `ŷ: ${metrics.yHat.toFixed(4)} → ${nextMetrics.yHat.toFixed(4)}`,
      explanation: `Cross-entropy would fall from ${metrics.loss.toFixed(4)} to ${nextMetrics.loss.toFixed(4)}. Apply the update to make iteration ${iteration + 1} the new current state.`,
      cue: 'Apply one step, run ten steps, or change the feature counts and begin again.',
    },
  ];

  const active = steps[step];
  const showGradient = step >= 4;
  const showAfter = step >= 5;
  const latestRows = history.slice(-7).reverse();

  return (
    <main className="min-h-screen">
      <header className="site-header">
        <div>
          <p className="course-label">APAI4011 · Logistic regression</p>
          <h1>Gradient descent, step by step</h1>
          <p className="header-copy">
            Start with the PDF example, change the features, then run as many updates as you need.
          </p>
        </div>
        <div className="header-actions">
          <a className="source-link home-link" href="/">
            <ArrowLeft aria-hidden="true" />
            All demos
          </a>
          <a
            className="source-link"
            href="https://web.stanford.edu/~jurafsky/slp3/ed3book_jan26.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen aria-hidden="true" />
            Source chapter
          </a>
        </div>
      </header>

      <section className="step-nav" aria-label="Calculation steps">
        {stepNames.map((name, index) => (
          <button
            key={name}
            type="button"
            className={index === step ? 'step-button is-active' : index < step ? 'step-button is-done' : 'step-button'}
            onClick={() => setStep(index)}
            aria-current={index === step ? 'step' : undefined}
          >
            <span>{index + 1}</span>
            {name}
          </button>
        ))}
      </section>

      <Progress className="walkthrough-progress" value={((step + 1) / steps.length) * 100} />

      <div className="workspace-grid">
        <aside className="example-panel">
          <div className="panel-heading">
            <p className="panel-kicker">Editable observation</p>
            <span className="label-chip">y = 1 · positive</span>
          </div>

          <div className="feature-grid">
            <div className="feature-card positive-feature">
              <label htmlFor="x1-input">x₁</label>
              <Input
                id="x1-input"
                className="feature-input"
                type="number"
                min={0}
                max={50}
                step={1}
                value={features.x1}
                onChange={(event) => updateFeature('x1', event.target.value)}
                aria-describedby="x1-description"
              />
              <small id="x1-description">positive lexicon words · PDF default: 3</small>
            </div>
            <div className="feature-card negative-feature">
              <label htmlFor="x2-input">x₂</label>
              <Input
                id="x2-input"
                className="feature-input"
                type="number"
                min={0}
                max={50}
                step={1}
                value={features.x2}
                onChange={(event) => updateFeature('x2', event.target.value)}
                aria-describedby="x2-description"
              />
              <small id="x2-description">negative lexicon words · PDF default: 2</small>
            </div>
          </div>

          <div className="eta-control">
            <div className="eta-heading">
              <div>
                <label htmlFor="eta-slider">Learning rate η</label>
                <p>Changes step size, not the gradient.</p>
              </div>
              <output>{eta.toFixed(2)}</output>
            </div>
            <Slider
              id="eta-slider"
              min={0.01}
              max={0.2}
              step={0.01}
              value={[eta]}
              onValueChange={(next) => setEta(Array.isArray(next) ? next[0] : Number(next))}
              aria-label="Learning rate"
            />
            <div className="slider-scale" aria-hidden="true">
              <span>0.01</span>
              <span>PDF default: 0.10</span>
              <span>0.20</span>
            </div>
          </div>

          <div className="training-control">
            <div className="training-heading">
              <div>
                <span>Multi-step training</span>
                <p>Repeats this same y = 1 observation.</p>
              </div>
              <strong>iteration {iteration}</strong>
            </div>
            <div className="training-buttons">
              <DemoButton onClick={() => commitSteps(1)}>
                <Play aria-hidden="true" />
                Run 1 step
              </DemoButton>
              <DemoButton variant="secondary" onClick={() => commitSteps(10)}>
                <FastForward aria-hidden="true" />
                Run 10 steps
              </DemoButton>
            </div>
            <button type="button" className="reset-model-link" onClick={() => resetModel()}>
              <RotateCcw aria-hidden="true" />
              Reset parameters, keep inputs
            </button>
          </div>

          <div className="parameter-panel">
            <div className="parameter-heading">
              <span>Current → next parameters</span>
              <span>θᵗ → θᵗ⁺¹</span>
            </div>
            <ParameterBox
              name="w₁"
              before={parameters.w1}
              gradient={metrics.gradient.w1}
              after={nextParameters.w1}
              showGradient={showGradient}
              showAfter={showAfter}
            />
            <ParameterBox
              name="w₂"
              before={parameters.w2}
              gradient={metrics.gradient.w2}
              after={nextParameters.w2}
              showGradient={showGradient}
              showAfter={showAfter}
            />
            <ParameterBox
              name="b"
              before={parameters.b}
              gradient={metrics.gradient.b}
              after={nextParameters.b}
              showGradient={showGradient}
              showAfter={showAfter}
            />
          </div>

          <button type="button" className="reset-link" onClick={resetPdfDefaults}>
            <RotateCcw aria-hidden="true" />
            Restore all PDF defaults
          </button>
        </aside>

        <section className="calculation-stage" aria-live="polite">
          <div className="stage-topline">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{active.eyebrow}</span>
          </div>
          <h2>{active.title}</h2>

          <div className="equation-stack">
            <div className="equation-block formula-block">
              <span>General form</span>
              <code>{active.formula}</code>
            </div>
            <div className="equation-block substitution-block">
              <span>Substitute the values</span>
              <code>{active.substitution}</code>
            </div>
            <div className="result-block">
              <span>Result</span>
              <strong>{active.result}</strong>
            </div>
          </div>

          <div className="meaning-card">
            <span>What this means</span>
            <p>{active.explanation}</p>
          </div>

          {step === 5 && (
            <div className="note-card">
              <strong>Why can w₂ increase?</strong>
              <p>
                This demo repeatedly trains on one positive review. Both active features are therefore reinforced. A real dataset needs negative reviews to teach the model that frequent negative words should push the prediction downward.
              </p>
            </div>
          )}

          <div className="next-cue">
            <ArrowRight aria-hidden="true" />
            <span>{active.cue}</span>
          </div>

          <div className="stage-controls">
            <DemoButton
              variant="outline"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              <ChevronLeft aria-hidden="true" />
              Previous
            </DemoButton>
            {step === steps.length - 1 ? (
              <DemoButton onClick={() => commitSteps(1)}>
                Apply this update
                <Play aria-hidden="true" />
              </DemoButton>
            ) : (
              <DemoButton onClick={() => setStep((current) => current + 1)}>
                Next step
                <ChevronRight aria-hidden="true" />
              </DemoButton>
            )}
          </div>
        </section>
      </div>

      <section className="history-section" aria-labelledby="history-title">
        <div className="history-heading">
          <div>
            <p className="panel-kicker">Multi-step view</p>
            <h2 id="history-title">Training history</h2>
          </div>
          <p>
            Every recorded update reuses x = [{features.x1}, {features.x2}] and y = 1.
          </p>
        </div>
        <div className="history-grid">
          <LossChart history={history} />
          <div className="history-table-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iteration</TableHead>
                  <TableHead>w₁</TableHead>
                  <TableHead>w₂</TableHead>
                  <TableHead>b</TableHead>
                  <TableHead>ŷ</TableHead>
                  <TableHead>Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestRows.map((point) => (
                  <TableRow key={point.iteration}>
                    <TableCell className="history-iteration">{point.iteration}</TableCell>
                    <TableCell>{point.w1.toFixed(3)}</TableCell>
                    <TableCell>{point.w2.toFixed(3)}</TableCell>
                    <TableCell>{point.b.toFixed(3)}</TableCell>
                    <TableCell>{point.yHat.toFixed(4)}</TableCell>
                    <TableCell>{point.loss.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <footer>
        <p>
          The PDF works through one update. The extra controls repeat that observation so you can inspect how gradient descent evolves over multiple iterations.
        </p>
      </footer>
    </main>
  );
}
