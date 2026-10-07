import React from "react";
import { useParams } from "react-router-dom";
import CashExchangesPage from "./CashExchangesPage";

export const CashExchangeDetailsPage = () => {
  const { cashExchangeId } = useParams();
  return <CashExchangesPage initialExchangeId={cashExchangeId} />;
};

export default CashExchangeDetailsPage;
