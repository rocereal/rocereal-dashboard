"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserAccount() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user.jpg" alt="User" />
            <AvatarFallback>OG</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 !bg-card" align="end" forceMount>
        <DropdownMenuLabel className="font-normal bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Obare Geoffrey</p>
            <p className="text-xs leading-none text-muted-foreground">
              info@obare27.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white">
          Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
