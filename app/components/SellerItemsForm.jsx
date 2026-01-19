"use client";

import React, { useState, useEffect } from "react";

/**
 * Reusable form component for creating or editing a marketplace item.
 *
 * Props:
 * - mode: "create" | "edit" (default: "create")
 * - initialItem: {
 *     name?: string;
 *     description?: string;
 *     price?: string;        // e.g. "0.0001 ETH"
 *     imageUrl?: string;
 *   }
 * - onSubmit: (values) => Promise<void> | void
 * - isSubmitting: boolean (optional external loading flag)
 * - submitLabel: string (optional button label override)
 */
const SellerItemsForm = ({
  mode = "create",
  initialItem = {},
  onSubmit,
  isSubmitting: isSubmittingProp = false,
  submitLabel,
}) => {
  const [name, setName] = useState(initialItem.name || "");
  const [description, setDescription] = useState(initialItem.description || "");
  const [price, setPrice] = useState(initialItem.price || "");
  const [imageUrl, setImageUrl] = useState(initialItem.imageUrl || "");
  const [errors, setErrors] = useState({});
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  const isSubmitting = isSubmittingProp || isSubmittingInternal;

  // Keep form in sync if initialItem changes (e.g. when editing a different item)
  useEffect(() => {
    setName(initialItem.name || "");
    setDescription(initialItem.description || "");
    setPrice(initialItem.price || "");
    setImageUrl(initialItem.imageUrl || "");
    setErrors({});
  }, [initialItem.name, initialItem.description, initialItem.price, initialItem.imageUrl]);

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required";
    }

    if (!price.trim()) {
      nextErrors.price = "Price is required";
    } else if (!/^\d+(\.\d+)?(\s*ETH)?$/i.test(price.trim())) {
      nextErrors.price = "Price should be a positive number, e.g. 0.001 or 0.001 ETH";
    }

    if (!imageUrl.trim()) {
      nextErrors.imageUrl = "Image URL is required";
    } else if (
      !/^https?:\/\//.test(imageUrl.trim()) &&
      !imageUrl.trim().startsWith("/")
    ) {
      nextErrors.imageUrl = "Use a valid URL or a path starting with /";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!onSubmit) return;

