import React from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import { Wrapper } from "../../components/swap/styleds";
import { TokenWarningCards } from "../../components/TokenWarningCard";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
} from "../../state/orderplacement/hooks";
import AppBody from "../AppBody";
import OrderBody from "../OrderBody";
import ClaimerBody from "../ClaimerBody";

import AuctionDetails from "../../components/AuctionDetails";
import AuctionHeader from "../../components/AuctionHeader";

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);

  // swap state
  const { auctionId } = useSwapState();
  const { tokens, auctionEndDate } = useDerivedSwapInfo(auctionId);

  return (
    <>
      <TokenWarningCards tokens={tokens} />
      <AppBody>
        <div>
          <AuctionHeader></AuctionHeader>
        </div>
        <div style={{ width: "28%", float: "left", alignContent: "center" }}>
          <AuctionDetails></AuctionDetails>
        </div>
        <div style={{ width: "70%", float: "right", alignContent: "right" }}>
          {auctionEndDate >= new Date().getTime() / 1000 ? (
            <OrderBody>
              <Wrapper id="auction-page">
                <OrderPlacement></OrderPlacement>
              </Wrapper>
            </OrderBody>
          ) : (
            <ClaimerBody>
              <Wrapper id="auction-page">
                <Claimer></Claimer>
              </Wrapper>
            </ClaimerBody>
          )}
        </div>
      </AppBody>
    </>
  );
}