# APAI4011 Interactive Demos & Quizzes

Small, self-contained teaching demos and self-check quizzes for APAI4011 Natural Language Processing.

## Pages

- [Demo & quiz collection](https://yulequan.github.io/APAI4011/)
- [Gradient Descent, Step by Step](https://yulequan.github.io/APAI4011/demos/logistic-gradient-descent/)
- [Word2Vec: From Context to Embeddings](https://yulequan.github.io/APAI4011/demos/word2vec-context-prediction/)
- [Lecture 4 AI-generated demonstration video](https://yulequan.github.io/APAI4011/demos/lecture-04-ai-video/)
- [Lecture 3 quiz: Word Embedding, Set B](https://yulequan.github.io/APAI4011/tests/lecture-03-word-embedding/)
- [Lecture 3 quiz: Word Embedding, Set A](https://yulequan.github.io/APAI4011/tests/lecture-03-word-embedding/set-a.html)
- [Lectures 4.2 & 5.1 quiz: Language Models and RNNs, Set B](https://yulequan.github.io/APAI4011/tests/lecture-04-05-lm-and-rnn/)
- [Lectures 4.2 & 5.1 quiz: Language Models and RNNs, Set A](https://yulequan.github.io/APAI4011/tests/lecture-04-05-lm-and-rnn/set-a.html)

## Structure

```text
index.html
demos/
  logistic-gradient-descent/
    index.html
  word2vec-context-prediction/
    index.html
  lecture-04-ai-video/
    index.html
    lecture-04-ai-generated-video.mp4
    poster.jpg
tests/
  lecture-03-word-embedding/
    index.html
    set-a.html
  lecture-04-05-lm-and-rnn/
    index.html
    set-a.html
```

Each page contains its own HTML, CSS, and vanilla JavaScript. No package installation or build step is required.

GitHub Pages publishes the files directly from the root of the `main` branch.

## Adding a quiz for another lecture

Create `tests/lecture-NN-<topic>/index.html` (a question page whose answers toggle
open, in the same style as the existing quiz), then add a matching card to the
`Testing` section of `index.html`.

## Lecture 7 interactive labs

- [Self-Attention, Step by Step](https://yulequan.github.io/APAI4011/demos/self-attention/)
- [Multi-Head Attention](https://yulequan.github.io/APAI4011/demos/multi-head-attention/)
- [KV Cache: Compute Once, Reuse](https://yulequan.github.io/APAI4011/demos/kv-cache/)
- [Self vs. Cross Attention](https://yulequan.github.io/APAI4011/demos/self-vs-cross-attention/)

Each lab is one standalone HTML file with inline CSS and vanilla JavaScript. There are no runtime dependencies, package installation, or build steps. Open a page directly or serve the repository with any static server. GitHub Pages continues to publish `main` from the repository root.

The vectors and projections are hand-set teaching examples. The Self-Attention default reproduces the lecture’s scaled scores of 14 and 12 with compact four-dimensional queries and keys; it does not reproduce the slide’s 64-dimensional projections. KV Cache compares actual one-layer attention outputs and counts K/V vector projections, including prefill; it does not sample from a trained language model or benchmark GPU speed.
