import { createClient } from "@/utils/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MoreVertical, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function AdminTenantsPage() {
  const supabase = await createClient()

  const { data: tenants, error } = await supabase
    .from("tenants")
    .select("*, tenant_members(count)")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">Error loading tenants: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenants Explorer</h1>
          <p className="text-zinc-400">View and manage all registered business entities.</p>
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200">
          Manual Enrollment
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Filter by name, slug, or owner..." 
            className="pl-10 bg-zinc-950 border-zinc-800"
          />
        </div>
        <Badge variant="outline" className="h-10 px-4 border-zinc-800 text-zinc-400">
          Showing {tenants?.length || 0} Entities
        </Badge>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-900">
              <TableHead className="text-zinc-400 font-semibold">Tenant Name</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Subdomain</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Status</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map((tenant) => (
              <TableRow key={tenant.id} className="border-zinc-900 hover:bg-zinc-900/40">
                <TableCell className="font-medium py-4">
                  <div className="flex flex-col">
                    <span>{tenant.name}</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">ID: {tenant.id.slice(0, 8)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-400">
                  <span className="bg-zinc-900 px-2 py-1 rounded">{tenant.slug}.localhost:3000</span>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-zinc-800">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-zinc-800">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
            {(!tenants || tenants.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-zinc-500 italic">
                  No business entities registered on the network.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
