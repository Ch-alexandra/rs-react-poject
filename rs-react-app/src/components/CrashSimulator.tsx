import { Component } from 'react'

interface CrashSimulatorProps {
  shouldCrash: boolean
}

export class CrashSimulator extends Component<CrashSimulatorProps> {
  render() {
    if (this.props.shouldCrash) {
      throw new Error('Crash test triggered by user action.')
    }

    return null
  }
}
