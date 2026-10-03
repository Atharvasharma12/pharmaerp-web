import React from "react";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody } from "./ui/UIModal";
import ProductFacilityTable from "./ProductFacilityTable";

/**
 * ProductFacilityTableDialog Component
 * Full-screen / Modal Dialog to inspect Product Facility stock details & batch allocations.
 */
const ProductFacilityTableDialog = ({ open, onClose, children, data }) => {
  if (!open) return null;

  return (
    <UIModal open={open} isOpen={open} onClose={onClose} size="3xl" closeOnBackdrop={true}>
      <UIModalHeader>
        <UIModalTitle>Stock Matrix</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="p-0 sm:p-4 bg-surface-alt/30">
        {children || <ProductFacilityTable {...(data ? { data } : {})} />}
      </UIModalBody>
    </UIModal>
  );
};

export default ProductFacilityTableDialog;
