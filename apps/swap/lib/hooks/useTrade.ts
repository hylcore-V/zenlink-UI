import type { MultiRoute, Pair, StableSwap, TradeType } from '@zenlink-interface/amm'
import { FACTORY_ADDRESS, Trade } from '@zenlink-interface/amm'
import type { Amount, Token } from '@zenlink-interface/currency'
import { useCurrencyCombinations } from '@zenlink-interface/currency'
import { PairState, StablePoolState, useGetStablePools, usePairs } from '@zenlink-interface/wagmi'
import { AMM_ENABLED_NETWORKS } from 'config'
import { useMemo } from 'react'

export interface UseTradeOutput {
  trade: Trade | undefined
  route: MultiRoute | undefined
}

export function useTrade(
  chainId: number | undefined,
  tokenMap: { [address: string]: Token },
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: Amount<Token>,
  mainCurrency?: Token,
  otherCurrency?: Token,
): UseTradeOutput {
  const [currencyIn, currencyOut] = useMemo(
    () => [mainCurrency, otherCurrency],
    [tradeType, mainCurrency, otherCurrency],
  )
  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)

  const { data: pairs } = usePairs(chainId, currencyCombinations, {
    enabled: Boolean(chainId && AMM_ENABLED_NETWORKS.includes(chainId)),
  })

  const { data: stablePools } = useGetStablePools(chainId, tokenMap)

  const filteredPairs = useMemo(
    () => Object.values(
      pairs
        .filter((result): result is [PairState.EXISTS, Pair] =>
          Boolean(result[0] === PairState.EXISTS && result[1]))
        .map(([, pair]) => pair),
    ),
    [pairs],
  )

  const filteredStablePools = useMemo(
    () => Object.values(
      stablePools
        .filter((result): result is [StablePoolState.EXISTS, StableSwap] =>
          Boolean(result[0] === StablePoolState.EXISTS && result[1]))
        .map(([, stablePool]) => stablePool),
    ),
    [stablePools],
  )

  return useMemo(() => {
    if (
      currencyIn
      && currencyOut
      && currencyIn.wrapped.chainId === currencyOut.wrapped.chainId
      && currencyIn.wrapped.chainId === chainId
      && currencyOut.wrapped.chainId === chainId
      && currencyIn.wrapped.address !== currencyOut.wrapped.address
      && chainId
      && amountSpecified
      && amountSpecified.greaterThan(0)
      && otherCurrency
      && filteredPairs.length > 0
    ) {
      if (chainId in FACTORY_ADDRESS) {
        const bestTrade = Trade.bestTradeExactIn(
          chainId,
          filteredPairs,
          filteredStablePools,
          amountSpecified,
          currencyOut,
        )[0]

        return {
          trade: bestTrade,
          route: bestTrade?.route,
        }
      }
    }

    return {
      trade: undefined,
      route: undefined,
    }
  }, [currencyIn, currencyOut, chainId, amountSpecified, otherCurrency, filteredPairs, filteredStablePools])
}
