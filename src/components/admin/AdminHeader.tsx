import { Bell, Search } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-dc-border bg-dc-surface/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-dc-muted"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-dc-text focus:ring-0 sm:text-sm"
            placeholder="Search articles, users, settings..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-dc-muted hover:text-dc-text">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-dc-border" aria-hidden="true" />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="h-8 w-8 rounded-full bg-dc-surface-2 border border-dc-border flex items-center justify-center">
              <span className="text-xs font-medium text-dc-text">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
