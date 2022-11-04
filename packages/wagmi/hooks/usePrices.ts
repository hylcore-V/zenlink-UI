import { getAddress, isAddress } from '@ethersproject/address'
import { Fraction } from '@zenlink-interface/math'
import type { UseQueryOptions } from '@tanstack/react-query'
import { parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useQuery } from 'wagmi'

export const usePrices = ({
  chainId,
  options,
}: {
  chainId?: number
  options?: Omit<
    UseQueryOptions<Record<string, number>, unknown, Record<string, number>, string[]>,
    'queryKey' | 'queryFn' | 'initialData'
  >
}) => {
  const queryKey = useMemo(() => [`https://token-price-ruby.vercel.app/v0/${chainId}`], [chainId])
  const {
    data: pricesMap,
    isError,
    isLoading,
  } = useQuery(
    queryKey,
    () => fetch(`https://token-price-ruby.vercel.app/v0/${chainId}`).then(response => response.json()),
    { staleTime: 20000, enabled: Boolean(chainId), ...options },
  )

  return useMemo(() => ({
    isError,
    isLoading,
    data:
      pricesMap && !isError && !isLoading
        ? Object.entries(pricesMap).reduce<Record<string, Fraction>>((acc, [address, price]) => {
          if (isAddress(address)) {
            acc[getAddress(address)] = new Fraction(
              parseUnits(price.toFixed(18), 18).toString(),
              parseUnits('1', 18).toString(),
            )
          }

          return acc
        }, {})
        : undefined,
  }), [isError, isLoading, pricesMap])
}
