import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export function LoadingGoogleAccountTable() {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Profile</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-72" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>GAIA ID</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-72" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Last updated</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-72" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Services</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Google Maps</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-96" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Google Calendar</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-96" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Google Plus <span className="text-xs">(Archive)</span>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-96" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Photos</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Avatar</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-72" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cover</TableCell>
          <TableCell>
            <Skeleton className="h-5 w-72" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
