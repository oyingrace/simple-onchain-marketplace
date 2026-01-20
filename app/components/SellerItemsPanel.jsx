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

      <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Items</h3>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading || submitting}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline disabled:text-gray-400"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet. Create your first item.</p>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="border border-gray-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    {item.price}
                  </p>
                  {item.imageUrl && (
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      {item.imageUrl}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItemId(item.itemId)}
                    disabled={submitting}
                    className="text-sm text-indigo-600 hover:text-indigo-800 underline disabled:text-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.itemId)}
                    disabled={submitting}
                    className="text-sm text-red-600 hover:text-red-800 underline disabled:text-gray-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

