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
