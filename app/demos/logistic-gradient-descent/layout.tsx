import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gradient Descent, Step by Step',
  description:
    'An interactive, multi-step walkthrough of logistic regression gradient descent based on Jurafsky and Martin, Section 4.6.3.',
};

export default function GradientDescentDemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
