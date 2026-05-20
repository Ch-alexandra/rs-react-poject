interface CrashSimulatorProps {
  shouldCrash: boolean
}

export function CrashSimulator({ shouldCrash }: CrashSimulatorProps) {
  if (shouldCrash) {
    throw new Error('Crash test triggered by user action.')
  }

  return null
}
