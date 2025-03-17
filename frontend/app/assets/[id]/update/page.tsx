import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

useEffect(() => {
  if (isConnected && currentAccount) {
    checkAuthorization();
  }
}, [isConnected, currentAccount, checkAuthorization]);
