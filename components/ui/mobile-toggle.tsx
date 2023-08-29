import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Aside from '../aside';
import { ServerAside } from '../server/server-aside';
 

type Props = {
  serverId: string;
};

export const MobileToggle = ({ serverId }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Aside />
        </div>
        <ServerAside serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
