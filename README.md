# APAI4011 Interactive Demos & Quizzes

Small, self-contained teaching demos and self-check quizzes for APAI4011 Natural Language Processing.

## Pages

- [Demo & quiz collection](https://yulequan.github.io/APAI4011/)
- [Gradient Descent, Step by Step](https://yulequan.github.io/APAI4011/demos/logistic-gradient-descent/)
- [Word2Vec: From Context to Embeddings](https://yulequan.github.io/APAI4011/demos/word2vec-context-prediction/)
- [Lecture 3 quiz: Word Embedding](https://yulequan.github.io/APAI4011/tests/lecture-03-word-embedding/)

## Structure

```text
index.html
demos/
  logistic-gradient-descent/
    index.html
  word2vec-context-prediction/
    index.html
tests/
  lecture-03-word-embedding/
    index.html
```

Each page contains its own HTML, CSS, and vanilla JavaScript. No package installation or build step is required.

GitHub Pages publishes the files directly from the root of the `main` branch.

## Adding a quiz for another lecture

Create `tests/lecture-NN-<topic>/index.html` (a question page whose answers toggle
open, in the same style as the existing quiz), then add a matching card to the
`Testing` section of `index.html`.
