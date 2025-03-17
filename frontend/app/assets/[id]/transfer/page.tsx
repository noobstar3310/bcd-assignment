import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TransferPage = () => {
  const checkAuthorization = useCallback(async () => {
    // Implementation
  }, []);

  useEffect(() => {
    if (isConnected && currentAccount) {
      checkAuthorization();
    }
  }, [isConnected, currentAccount, checkAuthorization]);

  // ... rest of the code
};
