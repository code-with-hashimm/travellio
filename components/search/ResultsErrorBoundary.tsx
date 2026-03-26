'use client'

import { Component, ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { hasError: boolean }

export class ResultsErrorBoundary
  extends Component<Props, State> {

  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-amber-200
                        bg-amber-50 p-6 text-center
                        text-sm text-amber-700">
          Some results could not be displayed.
          <button
            onClick={() => this.setState({ hasError: false })}
            className="ml-2 underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
