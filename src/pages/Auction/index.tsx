import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionDetails from '../../components/auction/AuctionDetails'
import { AuctionNotStarted } from '../../components/auction/AuctionNotStarted'
import { AuctionPending } from '../../components/auction/AuctionPending'
import Claimer from '../../components/auction/Claimer'
import OrderPlacement from '../../components/auction/OrderPlacement'
import { OrderBook } from '../../components/auction/Orderbook'
import OrdersTable from '../../components/auction/OrdersTable'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { InlineLoading } from '../../components/common/InlineLoading'
import { NetworkIcon } from '../../components/icons/NetworkIcon'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import {
  AuctionState,
  useCurrentUserOrders,
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { useOrderbookDataCallback } from '../../state/orderbook/hooks'
import { useOrderState } from '../../state/orders/hooks'
import { OrderState } from '../../state/orders/reducer'
import { getChainName } from '../../utils/tools'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const SubTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 0 0 40px;
`

const SubTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 6px 0 0;
`

const AuctionId = styled.span`
  align-items: center;
  display: flex;
`

const CopyButton = styled(ButtonCopy)`
  height: 14px;
  position: relative;
  top: -1px;
  width: 14px;
`

const Network = styled.span`
  align-items: center;
  display: flex;
  margin-right: 5px;
`

const NetworkIconStyled = styled(NetworkIcon)`
  height: 14px;
  width: 14px;
`

const NetworkName = styled.span`
  margin-left: 8px;
  text-transform: capitalize;
`

const Grid = styled.div`
  column-gap: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 40px;
`

const Auction = ({ location: { search } }: RouteComponentProps) => {
  const { auctionState, loading } = useDerivedAuctionState()
  const orders: OrderState | undefined = useOrderState()
  const { auctionId, chainId } = useSwapState()
  const url = window.location.href
  const { auctioningToken, biddingToken } = useDerivedAuctionInfo()

  useDefaultsFromURLSearch(search)
  useCurrentUserOrders()
  useOrderbookDataCallback()

  const auctionStarted = React.useMemo(
    () => auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED,
    [auctionState],
  )

  const isNotLoading = React.useMemo(() => auctionState !== null && !loading, [
    loading,
    auctionState,
  ])
  return (
    <>
      <Title>Auction Details</Title>
      <SubTitleWrapper>
        <SubTitle>
          <Network>
            <NetworkIconStyled />
            <NetworkName>Selling on {getChainName(chainId)} -</NetworkName>
          </Network>
          <AuctionId>Auction Id #{auctionId}</AuctionId>
        </SubTitle>
        <CopyButton copyValue={url} title="Copy URL" />
      </SubTitleWrapper>
      <AuctionDetails />
      {!isNotLoading && <InlineLoading message="Loading..." />}
      {auctionStarted && isNotLoading && (
        <SectionTitle as="h2">
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) &&
            'Place Order'}
          {auctionState === AuctionState.CLAIMING && 'Claim Proceedings'}
        </SectionTitle>
      )}
      {auctionStarted && isNotLoading && (
        <Grid>
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && <OrderPlacement />}
          {auctionState === AuctionState.CLAIMING && <Claimer />}
          {auctionState === AuctionState.PRICE_SUBMISSION && (
            <AuctionPending>Auction closed. Pending on-chain price-calculation.</AuctionPending>
          )}
          <OrderBook baseToken={auctioningToken} quoteToken={biddingToken} />
        </Grid>
      )}
      {auctionState === AuctionState.NOT_YET_STARTED && <AuctionNotStarted />}
      {auctionStarted && isNotLoading && <OrdersTable orders={orders.orders} />}
    </>
  )
}

export default Auction