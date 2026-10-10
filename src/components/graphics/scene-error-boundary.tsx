"use client";

import { Component, type ReactNode } from "react";

interface Props {
  onError: () => void;
  children: ReactNode;
}

/** Catches failures while loading or rendering a 3D scene (chunk errors, shader errors). */
export class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onError();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}
