import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useEnsName } from 'wagmi'
import type { UseEnsNameArgs, UseEnsNameConfig } from 'wagmi/dist/declarations/src/hooks/ens/useEnsName'

export type Props = UseEnsNameArgs &
UseEnsNameConfig & {
  children: ReactNode | Array<ReactNode> | ((payload: ReturnType<typeof useEnsName>) => JSX.Element)
}

export const AddressToEnsResolver = ({
  children,
  onSuccess,
  chainId = 1,
  ...props
}: Props): JSX.Element => {
  const result = useEnsName({ ...props, chainId })

  // Custom onSuccess callback to send success data with resolved result
  useEffect(() => {
    if (result.data && onSuccess)
      onSuccess(result.data)
  }, [onSuccess, result.data])

  if (typeof children === 'function')
    return children(result)

  return <>{children}</>
}
