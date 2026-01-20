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
    } catch (err) {
      setMessage(`❌ ${err?.message || "Failed to create item"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values) => {
    if (!onUpdate || !editingItemId) return;
    setSubmitting(true);
    setMessage("");
    try {
      await onUpdate(editingItemId, values);
      setMessage("✅ Item updated");
      setEditingItemId(null);
      if (onRefresh) await onRefresh();
    } catch (err) {
      setMessage(`❌ ${err?.message || "Failed to update item"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!onRemove) return;
    setSubmitting(true);
    setMessage("");
    try {
      await onRemove(itemId);
      setMessage("✅ Item removed");
      if (onRefresh) await onRefresh();
    } catch (err) {
      setMessage(`❌ ${err?.message || "Failed to remove item"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
        <SellerItemsForm
          mode={editingItem ? "edit" : "create"}
          initialItem={
            editingItem
              ? {
                  name: editingItem.name,
                  description: editingItem.description,
                  price: `${editingItem.price}`,
                  imageUrl: editingItem.imageUrl,
                }
              : {}
          }
          onSubmit={editingItem ? handleUpdate : handleCreate}
          isSubmitting={submitting}
          submitLabel={editingItem ? "Save Changes" : "Create Item"}
        />
        {editingItem && (
          <button
            type="button"
            onClick={() => setEditingItemId(null)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cancel edit
          </button>
        )}
        {message && (
          <div className="mt-3 text-sm">
            {message}
          </div>
        )}
      </div>

