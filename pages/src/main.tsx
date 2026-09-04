import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import DemoCollection from '../../app/page';
import GradientDescentDemo from '../../app/demos/logistic-gradient-descent/page';
import '../../app/globals.css';

const basePath = '/APAI4011';
const route =
  window.location.pathname
    .replace(new RegExp(`^${basePath}`), '')
    .replace(/\/+$/, '') || '/';

const isGradientDemo = route === '/demos/logistic-gradient-descent';

document.title = isGradientDemo
  ? 'Gradient Descent, Step by Step · APAI4011'
  : 'APAI4011 Interactive Demos';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isGradientDemo ? <GradientDescentDemo /> : <DemoCollection />}
  </StrictMode>,
);
