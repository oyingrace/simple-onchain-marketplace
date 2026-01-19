"use client";

import React, { useState, useEffect } from "react";

/**
 * Reusable form component for creating or editing a marketplace item.
 *
 * Props:
 * - mode: "create" | "edit" (default: "create")
 * - initialItem: {
