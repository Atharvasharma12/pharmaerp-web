import React from "react";
import { AppDialog } from "@/components";
import { FiX, FiLayers } from "react-icons/fi";
import { AppHeading, AppText, AppIconButton } from "./ui";
import ProductFacilityTable from "./ProductFacilityTable";

// Sample data for demonstration (replace with real API data as needed)
// Sample data retained for manual debugging (not used in production)
// const sampleData = [];


/**
 * ProductFacilityTableDialog Component
 * Full-screen / Modal Dialog to inspect Product Facility stock details & batch allocations.
 */
const ProductFacilityTableDialog = ({ open, onClose, children, data }) => {
  console.log('ProductFacilityTableDialog data prop length:', data?.length);

  if (!open) return null;

  return (
    <AppDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {children || <ProductFacilityTable {...(data ? { data } : {})} />}
    </AppDialog>
  );
};

export default ProductFacilityTableDialog;
