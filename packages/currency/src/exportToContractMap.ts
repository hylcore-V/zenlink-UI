export interface ContractExport {
  address: string
  abi: unknown[]
  linkedData?: unknown
}

export interface Export {
  chainId: string
  name: string
  contracts: { [name: string]: ContractExport }
}

export interface MultiExport {
  [chainId: string]: Export[]
}

// TODO: Use to generate typed address maps from hardhat-deploy exports
export function exportToContractMap(name: string, multiExport: MultiExport) {
  return Object.fromEntries(Object.entries(multiExport).map(entry => [entry[0], entry[1][0].contracts[name]]))
}
