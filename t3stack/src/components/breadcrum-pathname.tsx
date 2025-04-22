'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

export function BreadcrumbPathname() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const paths = segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/board" className="font-semibold">Zonaka board</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={paths[index + 1]!} className="capitalize">
                  {segment.replaceAll('-', ' ')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
