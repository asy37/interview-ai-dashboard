'use client'

import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="text-lg font-semibold">
        {/* Page title can be dynamic */}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          title="Change Language"
        >
          <Globe className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={session?.user?.image || ''}
                  alt={session?.user?.name || 'User'}
                />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
