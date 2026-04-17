"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "@/lib/actions/posts";

interface ViewTrackerProps {
  articleId: string;
}

export default function ViewTracker({ articleId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      incrementViewCount(articleId);
      hasTracked.current = true;
    }
  }, [articleId]);

  return null; // Invisible component
}
