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
import { useRouter } from "next/navigation";

export function UserAccount() {
  const router = useRouter();

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
            <p className="text-sm font-medium leading-none">Administrator</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@dashboard.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
          onClick={() => router.push("/pages/settings")}
        >
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
          onClick={() => router.push("/pages/settings")}
        >
          Setari
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
          onClick={() => router.push("/login")}
        >
          Deconectare
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
