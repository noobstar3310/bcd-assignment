import React, { useEffect, useCallback } from "react";

const AssetPage = () => {
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
