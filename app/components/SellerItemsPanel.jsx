"use client";

import React, { useMemo, useState } from "react";
import SellerItemsForm from "./SellerItemsForm";

/**
 * SellerItemsPanel
 * - Displays seller's items
 * - Provides create/edit form
 * - Expects callbacks from parent for data operations (fetch/create/update/remove)
 *
 * Props:
 * - items: array of { itemId, name, description, price, imageUrl, isActive }
 * - loading: boolean (loading items)
 * - onRefresh: () => Promise<void> | void
 * - onCreate: (values) => Promise<void> | void
 * - onUpdate: (itemId, values) => Promise<void> | void
 * - onRemove: (itemId) => Promise<void> | void
 */
const SellerItemsPanel = ({
  items = [],
  loading = false,
  onRefresh,
  onCreate,
  onUpdate,
  onRemove,
}) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const editingItem = useMemo(
    () => items.find((it) => `${it.itemId}` === `${editingItemId}`),
    [items, editingItemId]
  );

  const handleCreate = async (values) => {
    if (!onCreate) return;
    setSubmitting(true);
    setMessage("");
    try {
      await onCreate(values);
      setMessage("✅ Item created");
      if (onRefresh) await onRefresh();
