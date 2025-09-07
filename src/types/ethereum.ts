// Ethereum provider types
export interface EthereumRequestArgs {
  method: string
  params?: unknown[]
}

export interface EthereumProvider {
  request: (args: EthereumRequestArgs) => Promise<unknown>
  on: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void
  isMetaMask?: boolean
}

export interface WindowWithEthereum extends Window {
  ethereum?: EthereumProvider
}