import React from "react";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import { Fraction } from "@uniswap/sdk";
import CountdownTimer from "../CountDown";

export default function AuctionHeader() {
  const { auctionId } = useSwapState();
  const {
    auctioningToken,
    biddingToken,
    auctionEndDate,
    initialAuctionOrder,
    clearingPriceOrder,
  } = useDerivedSwapInfo(auctionId);

  let clearingPrice: Fraction | undefined;
  if (
    !clearingPriceOrder ||
    clearingPriceOrder.buyAmount == undefined ||
    clearingPriceOrder.sellAmount == undefined
  ) {
    clearingPrice = undefined;
  } else {
    clearingPrice = new Fraction(
      clearingPriceOrder.sellAmount.raw.toString(),
      clearingPriceOrder.buyAmount.raw.toString(),
    );
  }
  return (
    <>
      <div style={{ float: "right", width: "20%" }}>
        <CountdownTimer auctionEndDate={auctionEndDate} />
      </div>
      <div style={{ float: "left", width: "80%" }}>
        {auctionEndDate >= new Date().getTime() / 1000 ? (
          <div>
            <h1>Auction</h1>
            <h3>
              Selling {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
              {auctioningToken?.symbol} for at least{" "}
              {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
              {biddingToken?.symbol}
            </h3>
          </div>
        ) : (
          <div>
            <h1>Auction</h1>
            <h3>
              Auction settled with a price of {clearingPrice?.toSignificant(4)}{" "}
              [{auctioningToken?.symbol} /{biddingToken?.symbol} ]
            </h3>
          </div>
        )}
        <br></br>
        <br></br>
      </div>
    </>
  );
}